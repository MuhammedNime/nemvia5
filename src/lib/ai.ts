import { QuizQuestion, QuizQuestionType } from '../types';
import { auth } from './firebase';
import { resolveApiUrl } from './native';

export type TutorMode = 'explain' | 'solve' | 'summarize' | 'practice';

export interface TutorMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface GeneratedFlashcard {
  subject: string;
  front: string;
  back: string;
  hint: string;
  category: 'math' | 'physics' | 'cs' | 'english';
}

export interface LessonSummaryResult {
  summary: string;
  keyPoints: string[];
  checkQuestions: Array<{ question: string; answer: string }>;
}

export interface StudyPlanResult {
  planSummary: string;
  steps: Array<{ title: string; action: string; duration: string }>;
}

async function postAI<T>(path: string, payload: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = await auth.currentUser?.getIdToken().catch(() => '');
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(resolveApiUrl(path), {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string })?.error || 'تعذّر تنفيذ طلب الذكاء الاصطناعي');
  }
  return data as T;
}

export async function askTutor(
  messages: TutorMessage[],
  mode: TutorMode = 'explain',
  context?: string,
): Promise<string> {
  const res = await postAI<{ reply: string }>('/api/ai/tutor', { messages, mode, context });
  return res.reply;
}

export interface GeneratedQuizHeader {
  institution?: string;
  subject?: string;
  gradeLevel?: string;
  instructions?: string;
}

export async function generateQuizQuestionsAI(
  topic: string,
  count: number,
  types: QuizQuestionType[],
  options?: {
    mode?: 'standard' | 'from_media' | 'word_template';
    sourceFile?: { base64: string; mimeType: string; name: string } | null;
    templateFile?: { base64: string; mimeType: string; name: string } | null;
  },
): Promise<{ title: string; description: string; examHeader?: GeneratedQuizHeader; questions: QuizQuestion[] }> {
  const raw = await postAI<{
    title?: string;
    description?: string;
    examHeader?: GeneratedQuizHeader;
    questions?: any[];
  }>('/api/ai/generate-quiz', {
    topic,
    count,
    types,
    mode: options?.mode || 'standard',
    sourceFile: options?.sourceFile || null,
    templateFile: options?.templateFile || null,
  });
  const validTypes = new Set<QuizQuestionType>(['mcq', 'true_false', 'multi_select', 'short_answer', 'fill_blank', 'essay']);
  const questions: QuizQuestion[] = (raw.questions || []).map((q, idx) => {
    const qType: QuizQuestionType = validTypes.has(q?.type) ? q.type : 'mcq';
    const opts = Array.isArray(q?.options) ? q.options.map(String) : [];
    const safeOpts =
      qType === 'true_false'
        ? ['صح', 'خطأ']
        : qType === 'mcq' || qType === 'multi_select'
          ? (opts.length >= 2 ? opts : ['الخيار أ', 'الخيار ب', 'الخيار ج', 'الخيار د'])
          : opts;
    return {
      id: `ai-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
      type: qType,
      question: String(q?.question || ''),
      topic: String(q?.topic || '').trim(),
      options: safeOpts,
      correctOptionIndex: Math.min(Math.max(0, Number(q?.correctOptionIndex) || 0), Math.max(0, safeOpts.length - 1)),
      correctOptionIndices: Array.isArray(q?.correctOptionIndices)
        ? q.correctOptionIndices.map((n: unknown) => Number(n)).filter((n: number) => !Number.isNaN(n))
        : qType === 'multi_select' ? [0] : undefined,
      acceptedAnswers: Array.isArray(q?.acceptedAnswers)
        ? q.acceptedAnswers.map(String).filter(Boolean)
        : (qType === 'short_answer' || qType === 'fill_blank' ? [''] : undefined),
      modelAnswer: String(q?.modelAnswer || ''),
      caseSensitive: false,
      explanation: String(q?.explanation || ''),
      points: Math.max(1, Number(q?.points) || (qType === 'essay' ? 5 : 1)),
    };
  }).filter(q => q.question.trim().length > 0);

  return {
    title: String(raw.title || ''),
    description: String(raw.description || ''),
    examHeader: raw.examHeader,
    questions,
  };
}

export async function generateFlashcardsAI(
  topic: string,
  count = 5,
  category: 'math' | 'physics' | 'cs' | 'english' = 'math',
): Promise<GeneratedFlashcard[]> {
  const res = await postAI<{ cards?: any[] }>('/api/ai/generate-flashcards', { topic, count, category });
  const allowedCats = new Set(['math', 'physics', 'cs', 'english']);
  return (res.cards || []).map(c => ({
    subject: String(c?.subject || topic),
    front: String(c?.front || ''),
    back: String(c?.back || ''),
    hint: String(c?.hint || ''),
    category: allowedCats.has(c?.category) ? c.category : category,
  })).filter(c => c.front && c.back);
}

export async function summarizeLessonAI(title: string, content: string): Promise<LessonSummaryResult> {
  return postAI<LessonSummaryResult>('/api/ai/lesson-summary', { title, content });
}

export async function draftQuestionFeedbackAI(params: {
  question: string;
  studentAnswer: string;
  modelAnswer?: string;
  maxPoints: number;
}): Promise<{ feedbackText: string; suggestedPoints: number }> {
  return postAI<{ feedbackText: string; suggestedPoints: number }>('/api/ai/draft-feedback', params);
}

export async function generateStudyPlanAI(params: {
  quizTitle: string;
  percentage: number;
  strengths: string[];
  weaknesses: string[];
}): Promise<StudyPlanResult> {
  return postAI<StudyPlanResult>('/api/ai/study-plan', params);
}

export interface AssignmentReviewResult {
  suggestedGrade: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export async function reviewAssignmentAI(params: {
  assignmentTitle: string;
  instructions: string;
  totalPoints: number;
  studentAnswer: string;
  attachmentUrl?: string;
}): Promise<AssignmentReviewResult> {
  return postAI<AssignmentReviewResult>('/api/ai/review-assignment', params);
}

export async function transcribeAudioAI(params: {
  audioBase64?: string;
  mimeType?: string;
  audioUrl?: string;
}): Promise<string> {
  const res = await postAI<{ transcript?: string }>('/api/ai/transcribe-audio', params);
  return String(res.transcript || '').trim();
}

export async function generateMistakeDrillAI(
  quizTitle: string,
  mistakes: Array<{ question: string; topic?: string; explanation?: string }>,
): Promise<QuizQuestion[]> {
  const raw = await postAI<{ questions?: any[] }>('/api/ai/mistake-drill', { quizTitle, mistakes });
  return (raw.questions || []).map((q, idx) => {
    const qType: QuizQuestionType = q?.type === 'true_false' ? 'true_false' : 'mcq';
    return {
      id: `drill-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
      type: qType,
      question: String(q?.question || ''),
      topic: String(q?.topic || '').trim() || undefined,
      options: qType === 'true_false' ? ['صح', 'خطأ'] : Array.isArray(q?.options) ? q.options.map(String) : [],
      correctOptionIndex: Math.max(0, Number(q?.correctOptionIndex) || 0),
      explanation: String(q?.explanation || ''),
      points: 1,
    };
  }).filter(q => q.question && q.options.length >= 2);
}

export interface ClassInsightsResult {
  summary: string;
  actions: string[];
}

export async function generateClassInsightsAI(params: {
  classSummaries: Array<{ title: string; avgScore: number; totalAttempts: number }>;
  trickyQuestions: Array<{ question: string; accuracy: number; topic?: string }>;
}): Promise<ClassInsightsResult> {
  return postAI<ClassInsightsResult>('/api/ai/class-insights', params);
}
