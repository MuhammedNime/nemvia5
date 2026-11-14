import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRIMARY_MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-4-hydrogen';

function getCandidateModels(): string[] {
  const models: string[] = [];
  const addModel = (val?: string) => {
    const clean = (val || '').trim();
    if (clean && !models.includes(clean)) models.push(clean);
  };
  addModel(PRIMARY_MODEL);
  const extraRaw = process.env.GEMINI_MODELS || '';
  for (const part of extraRaw.split(/[,;\n\r]+/)) {
    addModel(part);
  }
  addModel('gemini-2.5-flash');
  addModel('gemini-3.1-flash-lite');
  return models;
}

function loadFirebaseWebApiKey(): string {
  const fromEnv = (process.env.FIREBASE_WEB_API_KEY || process.env.VITE_FIREBASE_API_KEY || '').trim();
  if (fromEnv) return fromEnv;
  try {
    const cfgPath = path.resolve(__dirname, 'firebase-applet-config.json');
    if (fs.existsSync(cfgPath)) {
      const parsed = JSON.parse(fs.readFileSync(cfgPath, 'utf8')) as { apiKey?: string };
      return String(parsed.apiKey || '').trim();
    }
  } catch {
    /* ignore */
  }
  return '';
}

const FIREBASE_WEB_API_KEY = loadFirebaseWebApiKey();
const verifiedTokenCache = new Map<string, { uid: string; exp: number }>();
const aiRateLimits = new Map<string, { count: number; resetAt: number }>();
const AI_MAX_REQUESTS_PER_HOUR = Math.max(10, Number(process.env.AI_RATE_LIMIT_PER_HOUR) || 45);

async function verifyFirebaseBearer(token: string): Promise<string | null> {
  if (!token || !FIREBASE_WEB_API_KEY) return null;
  const cached = verifiedTokenCache.get(token);
  const now = Date.now();
  if (cached && cached.exp > now) return cached.uid;
  try {
    const resp = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(FIREBASE_WEB_API_KEY)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!resp.ok) return null;
    const data = (await resp.json()) as { users?: Array<{ localId?: string }> };
    const uid = data.users?.[0]?.localId;
    if (!uid) return null;
    if (verifiedTokenCache.size > 500) verifiedTokenCache.clear();
    verifiedTokenCache.set(token, { uid, exp: now + 5 * 60 * 1000 });
    return uid;
  } catch {
    return null;
  }
}

function getGeminiApiKeys(): string[] {
  const collected: string[] = [];
  const addKey = (val?: string) => {
    const trimmed = (val || '').trim();
    if (trimmed && !collected.includes(trimmed)) collected.push(trimmed);
  };
  addKey(process.env.GEMINI_API_KEY);
  const listRaw = process.env.GEMINI_API_KEYS || '';
  for (const part of listRaw.split(/[,;\n\r]+/)) {
    addKey(part);
  }
  for (let i = 1; i <= 10; i++) {
    addKey(process.env[`GEMINI_API_KEY_${i}`]);
  }
  return collected;
}

const aiClientPool = new Map<string, GoogleGenAI>();
const keyCooldownUntil = new Map<string, number>();
const modelCooldownUntil = new Map<string, number>();
let keyRoundRobinIndex = 0;

function getAIClientForKey(apiKey: string): GoogleGenAI {
  let client = aiClientPool.get(apiKey);
  if (!client) {
    client = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    aiClientPool.set(apiKey, client);
  }
  return client;
}

async function runWithAI<T>(fn: (ai: GoogleGenAI, model: string) => Promise<T>): Promise<T> {
  const keys = getGeminiApiKeys();
  if (keys.length === 0) {
    throw new Error('NO_GEMINI_KEY_CONFIGURED');
  }

  const now = Date.now();
  const allModels = getCandidateModels();
  const activeModels = allModels.filter(m => (modelCooldownUntil.get(m) || 0) <= now);
  const modelsToTry = activeModels.length > 0 ? activeModels : allModels;

  const start = keyRoundRobinIndex % keys.length;
  keyRoundRobinIndex = (keyRoundRobinIndex + 1) % keys.length;
  const rotated = [...keys.slice(start), ...keys.slice(0, start)];

  const readyKeys = rotated.filter(k => (keyCooldownUntil.get(k) || 0) <= now);
  const candidateKeys = readyKeys.length > 0 ? readyKeys : rotated;

  let lastErr: unknown;
  for (let mIdx = 0; mIdx < modelsToTry.length; mIdx++) {
    const model = modelsToTry[mIdx];
    for (let idx = 0; idx < candidateKeys.length; idx++) {
      const key = candidateKeys[idx];
      const ai = getAIClientForKey(key);
      const maxRetriesForKey = candidateKeys.length === 1 ? 1 : 0;

      for (let attempt = 0; attempt <= maxRetriesForKey; attempt++) {
        try {
          return await fn(ai, model);
        } catch (err: unknown) {
          lastErr = err;
          const msg = err instanceof Error ? err.message : String(err);
          const isModelNotFound = msg.includes('404') || msg.includes('NOT_FOUND');
          const isQuota = msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED');
          const isTransient = isQuota || msg.includes('503') || msg.includes('UNAVAILABLE');
          const isInvalidKey = msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED');

          if (isModelNotFound) {
            modelCooldownUntil.set(model, Date.now() + 30 * 60 * 1000);
            break;
          }
          if (isQuota) {
            keyCooldownUntil.set(key, Date.now() + 60 * 1000);
            if (idx < candidateKeys.length - 1 || mIdx < modelsToTry.length - 1) break;
          } else if (isInvalidKey) {
            keyCooldownUntil.set(key, Date.now() + 10 * 60 * 1000);
            if (idx < candidateKeys.length - 1) break;
          }

          if (!isTransient || attempt === maxRetriesForKey) break;
          await new Promise(r => setTimeout(r, 450 * (attempt + 1)));
        }
      }

      const lastMsg = lastErr instanceof Error ? lastErr.message : String(lastErr);
      if (lastMsg.includes('404') || lastMsg.includes('NOT_FOUND')) {
        break; // انتقل للنموذج البديل مباشرة
      }
    }
  }
  throw lastErr;
}

function sendAIError(res: Response, err: unknown, fallback: string) {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes('API_KEY_INVALID') || message.includes('PERMISSION_DENIED')) {
    res.status(403).json({
      error: 'تعذّر التحقق من مفتاح الذكاء الاصطناعي. يرجى مراجعة الإعدادات في Settings > Secrets.',
    });
    return;
  }
  if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
    res.status(429).json({
      error: 'تم تجاوز حد الطلبات المؤقت لخدمة الذكاء الاصطناعي. حاول مجدداً بعد قليل.',
    });
    return;
  }
  res.status(500).json({ error: message || fallback });
}

async function fetchRemoteMedia(url: string, maxBytes: number): Promise<{ base64: string; mimeType: string } | null> {
  if (!url || !/^https?:\/\//i.test(url)) return null;
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!resp.ok) return null;
    const contentType = (resp.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    const len = Number(resp.headers.get('content-length') || 0);
    if (len > maxBytes) return null;
    const arr = await resp.arrayBuffer();
    if (arr.byteLength === 0 || arr.byteLength > maxBytes) return null;
    return {
      base64: Buffer.from(arr).toString('base64'),
      mimeType: contentType || 'application/octet-stream',
    };
  } catch {
    return null;
  }
}

async function extractUploadedContent(file?: { base64?: string; mimeType?: string; name?: string } | null): Promise<{
  inlinePart?: { inlineData: { data: string; mimeType: string } };
  extractedText?: string;
}> {
  if (!file?.base64) return {};
  const rawBase64 = file.base64.includes(',') ? file.base64.split(',').pop() || '' : file.base64;
  if (!rawBase64) return {};

  const mime = (file.mimeType || '').toLowerCase().split(';')[0].trim();
  const name = (file.name || '').toLowerCase();

  // Images & PDFs go directly to Gemini multimodal inlineData
  if (mime.startsWith('image/') || mime === 'application/pdf' || /\.(png|jpe?g|webp|gif|pdf)$/.test(name)) {
    const safeMime = mime || (name.endsWith('.pdf') ? 'application/pdf' : 'image/png');
    return { inlinePart: { inlineData: { data: rawBase64, mimeType: safeMime } } };
  }

  // .docx Word archive extraction via JSZip
  if (
    mime.includes('wordprocessingml') ||
    name.endsWith('.docx')
  ) {
    try {
      const buf = Buffer.from(rawBase64, 'base64');
      const zip = await JSZip.loadAsync(buf);
      const docXml = await zip.file('word/document.xml')?.async('string');
      if (docXml) {
        const text = docXml
          .replace(/<w:tr[^>]*>/g, '\n')
          .replace(/<w:p[^>]*>/g, '\n')
          .replace(/<w:tc[^>]*>/g, ' | ')
          .replace(/<w:tab\/>/g, '  ')
          .replace(/<w:br[^>]*\/>/g, '\n')
          .replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/\n{3,}/g, '\n\n')
          .trim();
        return { extractedText: text.slice(0, 12000) };
      }
    } catch {
      // fall through to text decode
    }
  }

  // .doc (HTML-Word or plain text) / .txt / .md / .csv
  try {
    const rawText = Buffer.from(rawBase64, 'base64').toString('utf8');
    const clean = rawText
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    return { extractedText: clean.slice(0, 12000) };
  } catch {
    return {};
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '20mb' }));

  app.use('/api', (req: Request, res: Response, next) => {
    const origin = req.headers.origin || '';
    const allowedOrigin =
      origin === 'https://localhost' ||
      origin === 'http://localhost' ||
      origin === 'capacitor://localhost' ||
      origin === process.env.APP_URL ||
      /^https?:\/\/localhost(:\d+)?$/.test(origin)
        ? origin
        : '*';
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    const apkPath = path.resolve(__dirname, 'release', 'NEMVIA-v1.0.0.apk');
    const keys = getGeminiApiKeys();
    res.json({
      ok: true,
      aiReady: keys.length > 0,
      aiKeyCount: keys.length,
      aiModels: getCandidateModels(),
      apkAvailable: fs.existsSync(apkPath),
    });
  });

  // حماية مسارات الذكاء الاصطناعي بتحقق جلسة Firebase + حد استخدام عادل لحماية الحصة المجانية
  app.use('/api/ai', async (req: Request, res: Response, next) => {
    if (!FIREBASE_WEB_API_KEY) {
      next();
      return;
    }
    const authHeader = String(req.headers.authorization || '');
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const uid = await verifyFirebaseBearer(token);
    if (!uid) {
      res.status(401).json({ error: 'يرجى تسجيل الدخول في المنصة لاستخدام خدمات الذكاء الاصطناعي.' });
      return;
    }
    const now = Date.now();
    const bucket = aiRateLimits.get(uid);
    if (!bucket || bucket.resetAt <= now) {
      if (aiRateLimits.size > 1000) aiRateLimits.clear();
      aiRateLimits.set(uid, { count: 1, resetAt: now + 60 * 60 * 1000 });
    } else if (bucket.count >= AI_MAX_REQUESTS_PER_HOUR) {
      res.status(429).json({ error: 'بلغت الحد الساعي لاستخدام الذكاء الاصطناعي. انتظر قليلاً ثم حاول مجدداً.' });
      return;
    } else {
      bucket.count += 1;
    }
    next();
  });

  app.get('/download/nemvia.apk', (_req: Request, res: Response) => {
    const apkPath = path.resolve(__dirname, 'release', 'NEMVIA-v1.0.0.apk');
    if (!fs.existsSync(apkPath)) {
      res.status(404).json({ error: 'APK file not built yet' });
      return;
    }
    res.download(apkPath, 'NEMVIA-v1.0.0.apk');
  });

  // 1) المعلم الذكي التفاعلي (Multi-turn AI Tutor)
  app.post('/api/ai/tutor', async (req: Request, res: Response) => {
    if (getGeminiApiKeys().length === 0) {
      res.status(503).json({ error: 'خدمة الذكاء الاصطناعي غير مفعّلة بعد في Settings > Secrets.' });
      return;
    }
    try {
      const body = req.body as {
        messages?: Array<{ role: 'user' | 'assistant'; text: string }>;
        mode?: 'explain' | 'solve' | 'summarize' | 'practice';
        context?: string;
      };
      const msgs = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
      if (msgs.length === 0) {
        res.status(400).json({ error: 'أرسل سؤالاً أو رسالة للمعلم الذكي.' });
        return;
      }

      const modeInstruction: Record<string, string> = {
        explain: 'اشرح المفهوم بأسلوب مبسط وواضح خطوة بخطوة مع مثال عملي من الواقع.',
        solve: 'حل المسألة خطوة بخطوة مع توضيح سبب كل خطوة والنتيجة النهائية بوضوح.',
        summarize: 'قدّم ملخصاً مركّزاً ومنظماً في نقاط رئيسية سريعة المراجعة.',
        practice: 'أنشئ أسئلة تدريبية قصيرة مع إجاباتها المخفية أسفلها ليختبر الطالب نفسه.',
      };
      const modeHint = modeInstruction[body.mode || 'explain'] || modeInstruction.explain;
      const contextBlock = body.context?.trim()
        ? `\n\nسياق الدرس أو المادة المرفق:\n${body.context.trim().slice(0, 4000)}`
        : '';

      const contents = msgs.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      const response = await runWithAI((ai, model) =>
        ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction:
              `أنت معلّم ومساعد أكاديمي ذكي داخل منصة NEMVIA التعليمية. تجيب باللغة العربية الفصحى الواضحة (أو بلغة السؤال إن كان مادة لغات). ${modeHint}${contextBlock}`,
          },
        }),
      );

      res.json({ reply: (response.text || '').trim() || 'لم أتمكن من توليد إجابة، حاول صياغة السؤال بشكل أوضح.' });
    } catch (err) {
      sendAIError(res, err, 'تعذّر الاتصال بالمعلم الذكي');
    }
  });

  // 2) توليد اختبار متنوع بالذكاء الاصطناعي (نص، صورة، PDF، أو على نمط ملف وورد)
  app.post('/api/ai/generate-quiz', async (req: Request, res: Response) => {
    if (getGeminiApiKeys().length === 0) {
      res.status(503).json({ error: 'خدمة الذكاء الاصطناعي غير مفعّلة بعد في Settings > Secrets.' });
      return;
    }
    try {
      const {
        topic = '',
        count = 5,
        types = ['mcq', 'true_false', 'short_answer'],
        mode = 'standard',
        sourceFile = null,
        templateFile = null,
      } = req.body as {
        topic?: string;
        count?: number;
        types?: string[];
        mode?: 'standard' | 'from_media' | 'word_template';
        sourceFile?: { base64?: string; mimeType?: string; name?: string } | null;
        templateFile?: { base64?: string; mimeType?: string; name?: string } | null;
      };

      const sourceContent = await extractUploadedContent(sourceFile);
      const templateContent = await extractUploadedContent(templateFile);
      const hasAnyInput =
        Boolean(topic.trim()) ||
        Boolean(sourceContent.inlinePart) ||
        Boolean(sourceContent.extractedText) ||
        Boolean(templateContent.inlinePart) ||
        Boolean(templateContent.extractedText);

      if (!hasAnyInput) {
        res.status(400).json({ error: 'اكتب موضوع الاختبار أو ارفع صورة / ملف درس أو ورقة اختبار أولاً.' });
        return;
      }

      const safeCount = Math.max(1, Math.min(15, Number(count) || 5));
      const allowedTypes = Array.isArray(types) && types.length > 0 ? types : ['mcq', 'true_false'];

      const parts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [];
      if (sourceContent.inlinePart) {
        parts.push({ text: 'المرفق الأول (المحتوى العلمي / الصورة / ملف المادة المطلوب استخراج الأسئلة منه):' });
        parts.push(sourceContent.inlinePart);
      }
      if (templateContent.inlinePart) {
        parts.push({ text: 'المرفق الثاني (نموذج / نمط ملف الاختبار المراد محاكاة أسلوبه وترتيبه):' });
        parts.push(templateContent.inlinePart);
      }

      const promptLines = [
        `المطلوب: أنشئ اختباراً تعليمياً كاملاً يحتوي بالضبط على ${safeCount} أسئلة جاهزة للتطبيق والتصدير كملف Word.`,
        topic.trim() ? `موضوع / تعليمات المعلم:\n"""${topic.trim().slice(0, 5000)}"""` : '',
        sourceContent.extractedText
          ? `نص الملف / المستند المرفق (${sourceFile?.name || 'مستند'}):\n"""${sourceContent.extractedText}"""`
          : '',
        templateContent.extractedText
          ? `نص ونمط ورقة الاختبار المرفقة (${templateFile?.name || 'نموذج وورد'}):\n"""${templateContent.extractedText}"""`
          : '',
        mode === 'word_template' || Boolean(templateFile)
          ? 'مهم جداً: حلّل نمط وتنسيق ملف/صورة الاختبار المرفقة (توزيع الأقسام، صياغة الترويسة، أسلوب الأسئلة والدرجات) وولّد أسئلة جديدة بنفس النمط والأسلوب الأكاديمي، وأرجع أيضاً examHeader بتفاصيل الترويسة.'
          : '',
        `نوّع بين أنواع الأسئلة المطلوبة: ${allowedTypes.join(', ')}.`,
        `قواعد صارمة للإخراج:`,
        `- مصفوفة questions يجب أن تحتوي على ${safeCount} كائنات كاملة غير فارغة.`,
        `- في true_false اجعل options = ["صح", "خطأ"] وcorrectOptionIndex = 0 (لصح) أو 1 (لخطأ).`,
        `- في mcq اجعل options مصفوفة من 4 خيارات واضحة وcorrectOptionIndex رقم الخيار الصحيح (0 إلى 3).`,
        `- في multi_select اجعل options مصفوفة من 4 خيارات وcorrectOptionIndices مصفوفة فيها مؤشران صحيحان على الأقل.`,
        `- في short_answer و fill_blank (ضع ___ مكان الفراغ في نص السؤال) اكتب acceptedAnswers كمصفوفة فيها الصيغ المقبولة وoptions = [].`,
        `- في essay اكتب modelAnswer كمعيار إجابة نموذجية وoptions = [].`,
        `- أضف لكل سؤال topic (اسم الموضوع الفرعي)، explanation (تفسير علمي مختصر)، وpoints (درجة السؤال كرقم صحيح >= 1).`,
      ].filter(Boolean);

      parts.push({ text: promptLines.join('\n\n') });

      const response = await runWithAI((ai, model) =>
        ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts }],
          config: {
            systemInstruction:
              'أنت خبير مناهج وإعداد اختبارات رسمية بصيغة Word في منصة NEMVIA. أخرج JSON صحيحاً يلتزم حرفياً بالمخطط المطلوب واملأ مصفوفة questions كاملة دون اختصار.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              required: ['title', 'description', 'questions'],
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                examHeader: {
                  type: Type.OBJECT,
                  properties: {
                    institution: { type: Type.STRING },
                    subject: { type: Type.STRING },
                    gradeLevel: { type: Type.STRING },
                    instructions: { type: Type.STRING },
                  },
                },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ['type', 'question', 'options', 'correctOptionIndex', 'explanation', 'points'],
                    properties: {
                      type: { type: Type.STRING },
                      question: { type: Type.STRING },
                      topic: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctOptionIndex: { type: Type.INTEGER },
                      correctOptionIndices: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                      acceptedAnswers: { type: Type.ARRAY, items: { type: Type.STRING } },
                      modelAnswer: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                      points: { type: Type.INTEGER },
                    },
                  },
                },
              },
            },
          },
        }),
      );

      const rawText = (response.text || '{}').trim();
      const parsed = JSON.parse(rawText);
      if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        res.status(502).json({ error: 'لم يُرجع الذكاء الاصطناعي قائمة أسئلة مكتملة، حاول إضافة تفاصيل أكثر للموضوع أو الملف.' });
        return;
      }
      res.json(parsed);
    } catch (err) {
      sendAIError(res, err, 'تعذّر توليد الاختبار بالذكاء الاصطناعي');
    }
  });

  // 3) توليد بطاقات مراجعة (Flashcards)
  app.post('/api/ai/generate-flashcards', async (req: Request, res: Response) => {
    if (getGeminiApiKeys().length === 0) {
      res.status(503).json({ error: 'خدمة الذكاء الاصطناعي غير مفعّلة بعد في Settings > Secrets.' });
      return;
    }
    try {
      const { topic, count = 5, category = 'math' } = req.body as {
        topic?: string;
        count?: number;
        category?: string;
      };
      if (!topic?.trim()) {
        res.status(400).json({ error: 'اكتب موضوع البطاقات أو النص الدراسي أولاً.' });
        return;
      }
      const safeCount = Math.max(2, Math.min(8, Number(count) || 5));

      const response = await runWithAI((ai, model) =>
        ai.models.generateContent({
          model,
          contents: `أنشئ ${safeCount} بطاقات مراجعة (Flashcards) مركّزة للحفظ والاستذكار السريع حول:\n"""${topic.trim().slice(0, 4000)}"""\nالتصنيف الافتراضي: ${category}.`,
          config: {
            systemInstruction: 'أنت مصمم بطاقات استذكار ذكية باللغة العربية. كل بطاقة تتضمن سؤالاً مختصراً على الوجه الأمامي وإجابة دقيقة واضحة على الوجه الخلفي وتلميحاً قصيراً.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                cards: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      subject: { type: Type.STRING },
                      front: { type: Type.STRING },
                      back: { type: Type.STRING },
                      hint: { type: Type.STRING },
                      category: { type: Type.STRING },
                    },
                  },
                },
              },
            },
          },
        }),
      );

      const parsed = JSON.parse((response.text || '{"cards":[]}').trim());
      res.json(parsed);
    } catch (err) {
      sendAIError(res, err, 'تعذّر توليد بطاقات المراجعة');
    }
  });

  // 4) تلخيص وشرح الدرس + أسئلة تحقق سريعة
  app.post('/api/ai/lesson-summary', async (req: Request, res: Response) => {
    if (getGeminiApiKeys().length === 0) {
      res.status(503).json({ error: 'خدمة الذكاء الاصطناعي غير مفعّلة بعد في Settings > Secrets.' });
      return;
    }
    try {
      const { title, content } = req.body as { title?: string; content?: string };
      if (!title?.trim() && !content?.trim()) {
        res.status(400).json({ error: 'الدرس لا يحتوي نصاً لتلخيصه.' });
        return;
      }

      const response = await runWithAI((ai, model) =>
        ai.models.generateContent({
          model,
          contents: `عنوان الدرس: ${title || ''}\nمحتوى الدرس:\n${(content || '').slice(0, 6000)}`,
          config: {
            systemInstruction: 'لخّص الدرس للطالب بأسلوب سلس، ثم استخرج 4 نقاط ذهبية للمراجعة، وأنشئ 3 أسئلة تحقق سريعة مع إجاباتها المختصرة.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                checkQuestions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      answer: { type: Type.STRING },
                    },
                  },
                },
              },
            },
          },
        }),
      );

      const parsed = JSON.parse((response.text || '{}').trim());
      res.json(parsed);
    } catch (err) {
      sendAIError(res, err, 'تعذّر تلخيص الدرس');
    }
  });

  // 5) صياغة تغذية راجعة تربوية للمعلم على إجابة الطالب
  app.post('/api/ai/draft-feedback', async (req: Request, res: Response) => {
    if (getGeminiApiKeys().length === 0) {
      res.status(503).json({ error: 'خدمة الذكاء الاصطناعي غير مفعّلة بعد في Settings > Secrets.' });
      return;
    }
    try {
      const { question, studentAnswer, modelAnswer, maxPoints = 1 } = req.body as {
        question?: string;
        studentAnswer?: string;
        modelAnswer?: string;
        maxPoints?: number;
      };
      if (!question?.trim()) {
        res.status(400).json({ error: 'نص السؤال مطلوب لصياغة التغذية الراجعة.' });
        return;
      }

      const response = await runWithAI((ai, model) =>
        ai.models.generateContent({
          model,
          contents:
            `السؤال (الدرجة القصوى ${maxPoints}): ${question}\n` +
            `إجابة الطالب: ${studentAnswer || 'لم يُجب'}\n` +
            (modelAnswer ? `الإجابة النموذجية / المقبولة: ${modelAnswer}\n` : '') +
            `اقترح تغذية راجعة تربوية بنّاءة ومشجعة في سطرين مع الدرجة المقترحة من ${maxPoints}.`,
          config: {
            systemInstruction: 'أنت مساعد تصحيح تربوي للمعلمين. قدّم ملاحظة مختصرة ودقيقة تساعد الطالب على فهم خطئه أو تعزز إجابته الصحيحة.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                feedbackText: { type: Type.STRING },
                suggestedPoints: { type: Type.NUMBER },
              },
            },
          },
        }),
      );

      const parsed = JSON.parse((response.text || '{}').trim());
      res.json(parsed);
    } catch (err) {
      sendAIError(res, err, 'تعذّر صياغة التغذية الراجعة');
    }
  });

  // 6) خطة علاجية ذكية من تقرير أداء الطالب
  app.post('/api/ai/study-plan', async (req: Request, res: Response) => {
    if (getGeminiApiKeys().length === 0) {
      res.status(503).json({ error: 'خدمة الذكاء الاصطناعي غير مفعّلة بعد في Settings > Secrets.' });
      return;
    }
    try {
      const { quizTitle, percentage = 0, strengths = [], weaknesses = [] } = req.body as {
        quizTitle?: string;
        percentage?: number;
        strengths?: string[];
        weaknesses?: string[];
      };

      const response = await runWithAI((ai, model) =>
        ai.models.generateContent({
          model,
          contents:
            `الاختبار: ${quizTitle || 'اختبار'}\n` +
            `النسبة المحققة: ${percentage}%\n` +
            `نقاط القوة: ${(strengths || []).join(' | ') || 'غير محددة'}\n` +
            `نقاط الضعف: ${(weaknesses || []).join(' | ') || 'لا توجد نقاط ضعف واضحة'}\n` +
            `ضع خطة مذاكرة عملية من 3 خطوات قصيرة قابلة للتنفيذ اليوم.`,
          config: {
            systemInstruction: 'أنت مرشد أكاديمي ذكي. قدّم خطة علاجية عملية محفّزة ومخصصة لنتيجة الطالب.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                planSummary: { type: Type.STRING },
                steps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      action: { type: Type.STRING },
                      duration: { type: Type.STRING },
                    },
                  },
                },
              },
            },
          },
        }),
      );

      const parsed = JSON.parse((response.text || '{}').trim());
      res.json(parsed);
    } catch (err) {
      sendAIError(res, err, 'تعذّر إنشاء الخطة الدراسية');
    }
  });

  // 7) تصحيح ومراجعة الواجبات والملفات المرفقة بالذكاء الاصطناعي
  app.post('/api/ai/review-assignment', async (req: Request, res: Response) => {
    if (getGeminiApiKeys().length === 0) {
      res.status(503).json({ error: 'خدمة الذكاء الاصطناعي غير مفعّلة بعد في Settings > Secrets.' });
      return;
    }
    try {
      const { assignmentTitle, instructions, totalPoints = 20, studentAnswer = '', attachmentUrl } = req.body as {
        assignmentTitle?: string;
        instructions?: string;
        totalPoints?: number;
        studentAnswer?: string;
        attachmentUrl?: string;
      };
      if (!studentAnswer.trim() && !attachmentUrl?.trim()) {
        res.status(400).json({ error: 'لا توجد إجابة أو ملف مرفق لتحليله.' });
        return;
      }

      const parts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [];
      let attachmentNote = '';

      if (attachmentUrl?.trim()) {
        const media = await fetchRemoteMedia(attachmentUrl.trim(), 4 * 1024 * 1024);
        if (media) {
          if (media.mimeType.startsWith('image/') || media.mimeType === 'application/pdf') {
            parts.push({ inlineData: { data: media.base64, mimeType: media.mimeType } });
            attachmentNote = '\n[تم إرفاق ملف حل الطالب للمعاينة المباشرة أعلاه]';
          } else if (media.mimeType.startsWith('text/')) {
            const decoded = Buffer.from(media.base64, 'base64').toString('utf8').slice(0, 6000);
            attachmentNote = `\nمحتوى الملف النصي المرفق:\n${decoded}`;
          }
        }
      }

      const safeMax = Math.max(1, Number(totalPoints) || 20);
      parts.push({
        text:
          `عنوان الواجب: ${assignmentTitle || 'واجب دراسي'}\n` +
          `تعليمات المعلم: ${(instructions || 'لا توجد تعليمات إضافية').slice(0, 2000)}\n` +
          `الدرجة القصوى: ${safeMax}\n` +
          `نص حل الطالب:\n${(studentAnswer || '—').slice(0, 6000)}${attachmentNote}\n\n` +
          `قيّم حل الطالب بدقة وموضوعية واقترح درجة من ${safeMax} مع تغذية راجعة واضحة، ونقاط قوة، ونقاط للتحسين.`,
      });

      const response = await runWithAI((ai, model) =>
        ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts }],
          config: {
            systemInstruction: 'أنت مساعد تصحيح أكاديمي للمعلمين داخل منصة NEMVIA. قيّم حل الواجب بأمانة وتربوية عالية باللغة العربية.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                suggestedGrade: { type: Type.NUMBER },
                feedback: { type: Type.STRING },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
          },
        }),
      );

      const parsed = JSON.parse((response.text || '{}').trim());
      res.json({
        suggestedGrade: Math.max(0, Math.min(safeMax, Number(parsed.suggestedGrade) || 0)),
        feedback: String(parsed.feedback || ''),
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements.map(String) : [],
      });
    } catch (err) {
      sendAIError(res, err, 'تعذّر مراجعة الواجب بالذكاء الاصطناعي');
    }
  });

  // 8) تحويل التسجيل الصوتي للمعلم إلى نص مكتوب
  app.post('/api/ai/transcribe-audio', async (req: Request, res: Response) => {
    if (getGeminiApiKeys().length === 0) {
      res.status(503).json({ error: 'خدمة الذكاء الاصطناعي غير مفعّلة بعد في Settings > Secrets.' });
      return;
    }
    try {
      const { audioBase64, mimeType, audioUrl } = req.body as {
        audioBase64?: string;
        mimeType?: string;
        audioUrl?: string;
      };

      let finalBase64 = audioBase64?.trim() || '';
      let finalMime = (mimeType || 'audio/webm').split(';')[0].trim();

      if (!finalBase64 && audioUrl?.trim()) {
        const media = await fetchRemoteMedia(audioUrl.trim(), 6 * 1024 * 1024);
        if (!media) {
          res.status(400).json({ error: 'تعذّر تحميل الملف الصوتي لتفريغه.' });
          return;
        }
        finalBase64 = media.base64;
        if (media.mimeType.startsWith('audio/') || media.mimeType === 'video/webm') {
          finalMime = media.mimeType === 'video/webm' ? 'audio/webm' : media.mimeType;
        }
      }

      if (!finalBase64) {
        res.status(400).json({ error: 'بيانات الصوت مطلوبة للتحويل إلى نص.' });
        return;
      }

      const response = await runWithAI((ai, model) =>
        ai.models.generateContent({
          model,
          contents: [
            {
              role: 'user',
              parts: [
                { inlineData: { data: finalBase64, mimeType: finalMime || 'audio/webm' } },
                { text: 'فرّغ هذا المقطع الصوتي التعليمي إلى نص عربي دقيق وواضح مع علامات الترقيم، واكتب النص المفرّغ فقط دون مقدمات.' },
              ],
            },
          ],
        }),
      );

      const transcript = (response.text || '').trim();
      res.json({ transcript: transcript || 'تعذّر استخراج كلام واضح من التسجيل الصوتي.' });
    } catch (err) {
      sendAIError(res, err, 'تعذّر تحويل التسجيل الصوتي إلى نص');
    }
  });

  // 9) وضع التحدي: توليد أسئلة تدريب مشابهة لأخطاء الطالب
  app.post('/api/ai/mistake-drill', async (req: Request, res: Response) => {
    if (getGeminiApiKeys().length === 0) {
      res.status(503).json({ error: 'خدمة الذكاء الاصطناعي غير مفعّلة بعد في Settings > Secrets.' });
      return;
    }
    try {
      const { quizTitle = 'تدريب الأخطاء', mistakes = [] } = req.body as {
        quizTitle?: string;
        mistakes?: Array<{ question: string; topic?: string; explanation?: string }>;
      };
      if (!Array.isArray(mistakes) || mistakes.length === 0) {
        res.status(400).json({ error: 'لا توجد أخطاء مسجلة لتوليد تحدي تدريب عليها.' });
        return;
      }
      const sample = mistakes.slice(0, 5).map((m, i) =>
        `${i + 1}. السؤال: ${m.question}${m.topic ? ` (المهارة: ${m.topic})` : ''}${m.explanation ? ` — الفكرة: ${m.explanation}` : ''}`
      ).join('\n');
      const count = Math.min(4, Math.max(2, mistakes.length));

      const response = await runWithAI((ai, model) =>
        ai.models.generateContent({
          model,
          contents:
            `أخطأ الطالب في الاختبار "${quizTitle}" في الأسئلة التالية:\n${sample}\n\n` +
            `أنشئ ${count} أسئلة تدريب جديدة ومشابهة في الفكرة (ليست منسوخة حرفياً) من نوع mcq أو true_false لمساعدته على إتقان نفس المهارات، مع explanation واضح لكل سؤال.`,
          config: {
            systemInstruction: 'أنت مدرب ذكي في منصة NEMVIA. أنشئ أسئلة تحدٍ تدريبية عالية الجودة بصيغة JSON مطابقة للمخطط.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      question: { type: Type.STRING },
                      topic: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctOptionIndex: { type: Type.INTEGER },
                      explanation: { type: Type.STRING },
                    },
                  },
                },
              },
            },
          },
        }),
      );

      const parsed = JSON.parse((response.text || '{"questions":[]}').trim());
      res.json(parsed);
    } catch (err) {
      sendAIError(res, err, 'تعذّر توليد جولة التحدي');
    }
  });

  // 10) توصيات وتحليلات ذكية للمعلم بناءً على أداء الصف والأسئلة الصعبة
  app.post('/api/ai/class-insights', async (req: Request, res: Response) => {
    if (getGeminiApiKeys().length === 0) {
      res.status(503).json({ error: 'خدمة الذكاء الاصطناعي غير مفعّلة بعد في Settings > Secrets.' });
      return;
    }
    try {
      const { classSummaries = [], trickyQuestions = [] } = req.body as {
        classSummaries?: Array<{ title: string; avgScore: number; totalAttempts: number }>;
        trickyQuestions?: Array<{ question: string; accuracy: number; topic?: string }>;
      };

      const clsText = classSummaries.map(c => `- ${c.title}: متوسط ${c.avgScore}% (${c.totalAttempts} محاولة)`).join('\n') || 'لا توجد بيانات صفوف كافية';
      const qText = trickyQuestions.slice(0, 6).map(q => `- ${q.question} [نسبة الصواب: ${q.accuracy}%${q.topic ? `، الموضوع: ${q.topic}` : ''}]`).join('\n') || 'لا توجد أسئلة متعثرة مسجلة';

      const response = await runWithAI((ai, model) =>
        ai.models.generateContent({
          model,
          contents:
            `ملخص أداء الصفوف:\n${clsText}\n\nأكثر الأسئلة صعوبة أو إرباكاً للطلاب:\n${qText}\n\nقدّم موجزاً تحليلياً للمعلم في سطرين و3-4 خطوات عملية ليطبقها في الحصة القادمة.`,
          config: {
            systemInstruction: 'أنت مستشار تعليمي ذكي للمعلمين. قدّم خلاصة مركّزة وتوصيات صفية عملية وقابلة للتنفيذ.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                actions: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
          },
        }),
      );

      const parsed = JSON.parse((response.text || '{}').trim());
      res.json({
        summary: String(parsed.summary || ''),
        actions: Array.isArray(parsed.actions) ? parsed.actions.map(String) : [],
      });
    } catch (err) {
      sendAIError(res, err, 'تعذّر توليد توصيات التحليلات');
    }
  });

  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        ws: { server: httpServer },
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const portArgIdx = process.argv.indexOf('--port');
  const cliPort = portArgIdx >= 0 ? Number(process.argv[portArgIdx + 1]) : 0;
  const envPort = Number(process.env.PORT);
  const nginxPort = Number(process.env.NGINX_PORT);
  const defaultPort = Number(process.env.DEFAULT_APP_PORT) || 3000;
  const port =
    (cliPort > 0 ? cliPort : 0) ||
    (envPort > 0 && envPort !== nginxPort ? envPort : 0) ||
    defaultPort;

  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`[NEMVIA] Server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch(err => {
  console.error('[NEMVIA] Server failed to start:', err);
  process.exit(1);
});
