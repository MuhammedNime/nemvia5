import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  BookOpen,
  Calculator,
  FileText,
  HelpCircle,
  Trash2,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  BookmarkPlus,
  Mic,
  Square,
  Volume2,
  VolumeX,
  Camera,
  ScanLine,
  Upload,
  X,
} from 'lucide-react';
import { Lesson, Quiz, Profile } from '../../types';
import {
  askTutor,
  generateQuizQuestionsAI,
  PaperScanResult,
  scanPaperAI,
  TutorMessage,
  TutorMode,
} from '../../lib/ai';
import { saveQuestionsToBank } from '../../lib/questionBank';

interface AIStudioViewProps {
  currentProfile: Profile;
  lessons: Lesson[];
  quizzes: Quiz[];
  onRewardXP?: (xp: number) => void;
}

const MODES: Array<{ id: TutorMode; label: string; desc: string; icon: React.FC<{ className?: string }> }> = [
  { id: 'explain', label: 'شرح مبسّط', desc: 'تبسيط المفاهيم خطوة بخطوة مع أمثلة', icon: BookOpen },
  { id: 'solve', label: 'حل مسألة', desc: 'تفصيل خطوات الحل الرياضي أو العلمي', icon: Calculator },
  { id: 'summarize', label: 'تلخيص مركز', desc: 'نقاط رئيسية مركّزة للمراجعة السريعة', icon: FileText },
  { id: 'practice', label: 'تدريب فوري', desc: 'أسئلة تدريبية مع إجابات للتحقق', icon: HelpCircle },
];

const QUICK_PROMPTS = [
  'اشرح لي مفهوم التكامل في الرياضيات بمثال بسيط من الحياة اليومية',
  'لخّص لي أهم النقاط في الدرس المحدد على شكل خطوات مراجعة',
  'أعطني 3 أسئلة تدريبية قصيرة لاختبار فهمي مع الإجابة النموذجية',
  'حل هذه المسألة خطوة بخطوة: 2x² - 5x - 3 = 0',
];

async function imageFileToCompressedBase64(file: File): Promise<{ base64: string; mimeType: string; previewUrl: string }> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('تعذّر قراءة الصورة'));
    reader.onload = () => resolve(String(reader.result || ''));
    reader.readAsDataURL(file);
  });

  // Resize large photos on-device so camera shots upload quickly
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('invalid image'));
      el.src = dataUrl;
    });
    const maxDim = 1400;
    const scale = Math.min(1, maxDim / Math.max(img.width || maxDim, img.height || maxDim));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, w, h);
      const compressed = canvas.toDataURL('image/jpeg', 0.85);
      return {
        base64: compressed.split(',')[1] || '',
        mimeType: 'image/jpeg',
        previewUrl: compressed,
      };
    }
  } catch {
    /* fallback to raw dataUrl */
  }

  return {
    base64: dataUrl.split(',')[1] || '',
    mimeType: file.type || 'image/jpeg',
    previewUrl: dataUrl,
  };
}

export const AIStudioView: React.FC<AIStudioViewProps> = ({
  currentProfile,
  lessons,
  quizzes,
  onRewardXP,
}) => {
  const [mode, setMode] = useState<TutorMode>('explain');
  const [selectedContextId, setSelectedContextId] = useState<string>('');
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      role: 'assistant',
      text: `أهلاً ${currentProfile.display_name}! أنا المعلّم الذكي في NEMVIA. اختر وضع المساعدة أو ارفق درساً من صفوفك، واكتب سؤالك أو التقط صورة لمسألتك وسأساعدك فوراً.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [savingToBankIdx, setSavingToBankIdx] = useState<number | null>(null);
  const [savedBankMsg, setSavedBankMsg] = useState<Record<number, string>>({});
  const [listeningVoice, setListeningVoice] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const listEndRef = useRef<HTMLDivElement | null>(null);

  // Camera Scanner & Paper Grader state
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanMode, setScanMode] = useState<'solve' | 'grade' | 'notes'>('solve');
  const [scanExtraPrompt, setScanExtraPrompt] = useState('');
  const [scanImage, setScanImage] = useState<{ base64: string; mimeType: string; previewUrl: string } | null>(null);
  const [scanBusy, setScanBusy] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<PaperScanResult | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, busy]);

  useEffect(() => {
    return () => {
      try { recognitionRef.current?.stop?.(); } catch { /* ignore */ }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const resolvedContext = (() => {
    if (!selectedContextId) return '';
    if (selectedContextId.startsWith('lesson:')) {
      const l = lessons.find(x => `lesson:${x.id}` === selectedContextId);
      return l ? `الدرس: ${l.title}\n${l.content}` : '';
    }
    if (selectedContextId.startsWith('quiz:')) {
      const q = quizzes.find(x => `quiz:${x.id}` === selectedContextId);
      return q
        ? `الاختبار: ${q.title}\n${q.description}\nالأسئلة:\n${q.questions.map((qq, i) => `${i + 1}. ${qq.question}`).join('\n')}`
        : '';
    }
    return '';
  })();

  const sendMessage = async (textOverride?: string) => {
    const content = (textOverride ?? input).trim();
    if (!content || busy) return;
    setError(null);
    const nextHistory: TutorMessage[] = [...messages, { role: 'user', text: content }];
    setMessages(nextHistory);
    if (!textOverride) setInput('');
    setBusy(true);
    try {
      const reply = await askTutor(nextHistory, mode, resolvedContext);
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      onRewardXP?.(5);
    } catch (err: any) {
      setError(err?.message || 'تعذّر الاتصال بالمعلم الذكي');
    } finally {
      setBusy(false);
    }
  };

  const handleScanImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setScanError(null);
    setScanResult(null);
    setScannerOpen(true);
    try {
      const prepared = await imageFileToCompressedBase64(file);
      setScanImage(prepared);
    } catch (err: any) {
      setScanError(err?.message || 'تعذّر تجهيز الصورة');
    }
  };

  const runPaperScan = async () => {
    if (!scanImage || scanBusy) return;
    setScanBusy(true);
    setScanError(null);
    try {
      const result = await scanPaperAI({
        imageBase64: scanImage.base64,
        mimeType: scanImage.mimeType,
        mode: scanMode,
        extraPrompt: scanExtraPrompt.trim() || undefined,
      });
      setScanResult(result);
      onRewardXP?.(10);
    } catch (err: any) {
      setScanError(err?.message || 'تعذّر تحليل الورقة بالذكاء الاصطناعي.');
    } finally {
      setScanBusy(false);
    }
  };

  const appendScanToChat = () => {
    if (!scanResult) return;
    const summaryText = [
      scanResult.extractedText ? `📄 النص المستخرج:\n${scanResult.extractedText}` : '',
      scanResult.analysis ? `🔍 التحليل:\n${scanResult.analysis}` : '',
      scanResult.steps.length ? `📝 الخطوات:\n${scanResult.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}` : '',
      scanResult.finalAnswer ? `✅ الخلاصة / النتيجة:\n${scanResult.finalAnswer}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    setMessages(prev => [
      ...prev,
      { role: 'user', text: `📷 مسح ورقة (${scanMode === 'solve' ? 'حل مسألة' : scanMode === 'grade' ? 'تصحيح إجابة' : 'تلخيص ملاحظات'})` },
      { role: 'assistant', text: summaryText },
    ]);
    setScannerOpen(false);
  };

  const copyMessage = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch { /* ignore */ }
  };

  const handleSaveReplyToQuestionBank = async (text: string, idx: number) => {
    if (savingToBankIdx !== null) return;
    setSavingToBankIdx(idx);
    setError(null);
    try {
      const topicPrompt = `استخرج وحوّل هذا المحتوى التعليمي إلى 3 أسئلة تقييمية منظمة:\n${text.slice(0, 3500)}`;
      const res = await generateQuizQuestionsAI(topicPrompt, 3, ['mcq', 'true_false', 'short_answer']);
      if (res.questions.length > 0) {
        const subject = res.title || 'من المعلم الذكي';
        saveQuestionsToBank(currentProfile.id, subject, res.questions);
        setSavedBankMsg(prev => ({ ...prev, [idx]: `تم حفظ ${res.questions.length} أسئلة في بنك الأسئلة ✓` }));
      } else {
        setError('لم يتم العثور على أسئلة قابلة للحفظ من هذا الرد.');
      }
    } catch (err: any) {
      setError(err?.message || 'تعذّر توليد وحفظ الأسئلة في بنك الأسئلة.');
    } finally {
      setSavingToBankIdx(null);
    }
  };

  const toggleSpeakMessage = (text: string, idx: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setError('قراءة النصوص صوتياً غير مدعومة في هذا المتصفح.');
      return;
    }
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text.replace(/[#*`>_~]/g, ' '));
    const hasArabic = /[\u0600-\u06FF]/.test(text);
    utter.lang = hasArabic ? 'ar-SA' : 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.toLowerCase().startsWith(hasArabic ? 'ar' : 'en'));
    if (match) utter.voice = match;
    utter.rate = 0.98;
    utter.onend = () => setSpeakingIdx(null);
    utter.onerror = () => setSpeakingIdx(null);
    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utter);
  };

  const toggleVoiceInput = () => {
    if (listeningVoice) {
      try { recognitionRef.current?.stop?.(); } catch { /* ignore */ }
      setListeningVoice(false);
      return;
    }
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setError('الإملاء الصوتي غير مدعوم في هذا المتصفح (جرّب متصفح Chrome أو تطبيق الأندرويد).');
      return;
    }
    setError(null);
    const rec = new SpeechRec();
    rec.lang = 'ar-SA';
    rec.interimResults = true;
    rec.continuous = false;
    const baseText = input.trim();
    rec.onresult = (ev: any) => {
      let transcript = '';
      for (let k = 0; k < ev.results.length; k++) {
        transcript += ev.results[k][0]?.transcript || '';
      }
      setInput(baseText ? `${baseText} ${transcript}`.trim() : transcript.trim());
    };
    rec.onerror = () => {
      setListeningVoice(false);
    };
    rec.onend = () => {
      setListeningVoice(false);
    };
    recognitionRef.current = rec;
    setListeningVoice(true);
    try {
      rec.start();
    } catch {
      setListeningVoice(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in">
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleScanImagePick}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleScanImagePick}
        className="hidden"
      />

      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
            <Sparkles className="w-4 h-4" />
            <span>استوديو NEMVIA للذكاء الاصطناعي</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">المعلّم الذكي التفاعلي وماسح الكاميرا</h2>
          <p className="text-xs text-slate-500">
            اسأل عن أي مفهوم، التقط صورة لأي ورقة أو مسألة لحلّها وتصحيحها، أو أرفق درساً من صفوفك.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setScannerOpen(v => !v)}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
              scannerOpen
                ? 'bg-[#1677c7] text-white'
                : 'bg-sky-50 hover:bg-sky-100 text-[#1677c7] border border-sky-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>ماسح الكاميرا والورق</span>
          </button>

          <select
            value={selectedContextId}
            onChange={e => setSelectedContextId(e.target.value)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-slate-900 max-w-[210px]"
            aria-label="إرفاق سياق من دروسك أو اختباراتك"
          >
            <option value="">بدون سياق مرفق (سؤال عام)</option>
            {lessons.map(l => (
              <option key={l.id} value={`lesson:${l.id}`}>درس: {l.title}</option>
            ))}
            {quizzes.map(q => (
              <option key={q.id} value={`quiz:${q.id}`}>اختبار: {q.title}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() =>
              setMessages([
                {
                  role: 'assistant',
                  text: `محادثة جديدة جاهزة يا ${currentProfile.display_name}. كيف أساعدك الآن؟`,
                },
              ])
            }
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl cursor-pointer"
            title="محادثة جديدة"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Camera Scanner & Paper Grader Panel */}
      {scannerOpen && (
        <div className="bg-white border-2 border-sky-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs animate-in fade-in">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#1677c7] flex items-center justify-center">
                <ScanLine className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900">ماسح الكاميرا والواجبات الورقية</h3>
                <p className="text-[11px] text-slate-500">صوّر مسألة رياضيات، صفحة دفتر، أو إجابة امتحان ليحلّلها الذكاء الاصطناعي بدقة</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setScannerOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            {/* Left/Right: Controls & Image Preview */}
            <div className="md:col-span-5 space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl font-bold">
                {[
                  { id: 'solve', label: 'حل مسألة' },
                  { id: 'grade', label: 'تصحيح إجابة' },
                  { id: 'notes', label: 'تلخيص سبورة' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setScanMode(item.id as any)}
                    className={`py-2 rounded-lg transition-colors cursor-pointer ${
                      scanMode === item.id ? 'bg-white text-[#1677c7] shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="py-2.5 px-3 rounded-xl bg-[#0f233a] hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>التقاط بالكاميرا</span>
                </button>
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>اختيار صورة</span>
                </button>
              </div>

              <input
                type="text"
                value={scanExtraPrompt}
                onChange={e => setScanExtraPrompt(e.target.value)}
                placeholder="ملاحظة اختيارية (مثال: ركّز على السؤال رقم ٢)..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
              />

              {scanImage && (
                <div className="space-y-2">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-h-56 flex items-center justify-center">
                    <img src={scanImage.previewUrl} alt="معاينة الورقة" className="max-h-56 w-auto object-contain" />
                  </div>
                  <button
                    type="button"
                    disabled={scanBusy}
                    onClick={() => void runPaperScan()}
                    className="w-full py-2.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white font-black rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {scanBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{scanBusy ? 'جاري مسح وتحليل الصورة...' : 'بدء التحليل بالذكاء الاصطناعي (+10 XP)'}</span>
                  </button>
                </div>
              )}

              {scanError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-bold">
                  {scanError}
                </div>
              )}
            </div>

            {/* Results Column */}
            <div className="md:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[210px] space-y-3 text-xs">
              {!scanResult ? (
                <div className="h-44 flex flex-col items-center justify-center text-center text-slate-400 space-y-1.5">
                  <ScanLine className="w-8 h-8 text-slate-300" />
                  <p className="font-bold text-slate-600">التقط أو ارفع صورة المسألة أو الورقة</p>
                  <p className="text-[11px] max-w-xs">
                    سيقوم الذكاء الاصطناعي بقراءة النص المكتوب يدوياً أو المطبوع واستخراج الحل والخطوات فوراً.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in">
                  {scanResult.extractedText && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-black text-slate-500 block">النص المستخرج من الورقة:</span>
                      <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{scanResult.extractedText}</p>
                    </div>
                  )}

                  {scanResult.analysis && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-black text-[#1677c7] block">التحليل والشرح:</span>
                      <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{scanResult.analysis}</p>
                    </div>
                  )}

                  {scanResult.steps.length > 0 && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-black text-slate-600 block">الخطوات التفصيلية:</span>
                      <ol className="list-decimal pr-4 space-y-1 text-slate-800 leading-relaxed">
                        {scanResult.steps.map((st, idx) => (
                          <li key={idx}>{st}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {scanResult.finalAnswer && (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl space-y-1">
                      <span className="text-[10px] font-black text-emerald-800 block">النتيجة النهائية:</span>
                      <p className="font-black text-emerald-950 whitespace-pre-wrap">{scanResult.finalAnswer}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={appendScanToChat}
                      className="px-4 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl cursor-pointer"
                    >
                      إدراج في المحادثة لمتابعة الأسئلة ←
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {MODES.map(m => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer space-y-1 ${
                active
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-black">
                <Icon className={`w-4 h-4 ${active ? 'text-amber-300' : 'text-slate-600'}`} />
                <span>{m.label}</span>
              </div>
              <p className={`text-[11px] leading-snug ${active ? 'text-slate-300' : 'text-slate-500'}`}>
                {m.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Chat Workspace */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50/40">
          {messages.map((m, i) => {
            const isUser = m.role === 'user';
            return (
              <div key={i} className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[78%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-1.5 ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-br-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                  }`}
                >
                  <p>{m.text}</p>
                  {!isUser && (
                    <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
                      {(currentProfile.role === 'teacher' || currentProfile.role === 'admin') && i > 0 && (
                        <button
                          type="button"
                          disabled={savingToBankIdx === i}
                          onClick={() => void handleSaveReplyToQuestionBank(m.text, i)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1677c7] hover:text-[#125fa0] disabled:opacity-50 cursor-pointer"
                        >
                          {savingToBankIdx === i ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <BookmarkPlus className="w-3 h-3" />
                          )}
                          <span>{savedBankMsg[i] || 'استخراج وحفظ في بنك الأسئلة'}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleSpeakMessage(m.text, i)}
                        className={`inline-flex items-center gap-1 text-[10px] font-bold cursor-pointer ${
                          speakingIdx === i ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-700'
                        }`}
                        title="استماع للرد صوتياً"
                      >
                        {speakingIdx === i ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        <span>{speakingIdx === i ? 'إيقاف الصوت' : 'استماع'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => copyMessage(m.text, i)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {copiedIdx === i ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIdx === i ? 'تم النسخ' : 'نسخ'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {busy && (
            <div className="flex justify-end">
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl text-xs text-slate-600 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>المعلّم الذكي يجهز الإجابة...</span>
              </div>
            </div>
          )}
          <div ref={listEndRef} />
        </div>

        {error && (
          <div className="px-4 py-2.5 bg-rose-50 border-t border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick prompts */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          {QUICK_PROMPTS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              disabled={busy}
              onClick={() => void sendMessage(q)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={e => {
            e.preventDefault();
            void sendMessage();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <button
            type="button"
            disabled={busy}
            onClick={toggleVoiceInput}
            className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
              listeningVoice
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title={listeningVoice ? 'إيقاف الإملاء الصوتي' : 'اسأل بالصوت'}
          >
            {listeningVoice ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
          </button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={listeningVoice ? 'تحدث الآن... جاري الاستماع لصوتك' : 'اكتب سؤالك، معادلتك، أو نص الدرس هنا...'}
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-slate-900 focus:bg-white"
            disabled={busy}
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="px-4 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            <span>إرسال</span>
          </button>
        </form>
      </div>
    </div>
  );
};
