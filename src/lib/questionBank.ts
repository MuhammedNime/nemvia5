import { QuizQuestion } from '../types';

export interface BankQuestionItem {
  id: string;
  subject: string;
  savedAt: string;
  question: QuizQuestion;
}

const keyFor = (userId: string) => `nemvia-question-bank-${userId || 'guest'}`;

export function loadQuestionBank(userId: string): BankQuestionItem[] {
  try {
    const raw = localStorage.getItem(keyFor(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistQuestionBank(userId: string, items: BankQuestionItem[]): void {
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify(items.slice(0, 200)));
  } catch {
    /* ignore storage quota errors */
  }
}

export function saveQuestionsToBank(
  userId: string,
  subject: string,
  questions: QuizQuestion[],
): BankQuestionItem[] {
  const existing = loadQuestionBank(userId);
  const existingTexts = new Set(existing.map(x => `${x.question.type || 'mcq'}::${x.question.question.trim()}`));
  const cleanSubject = subject.trim() || 'عام';
  const toAdd: BankQuestionItem[] = [];

  for (const q of questions) {
    const text = (q.question || '').trim();
    if (!text) continue;
    const sig = `${q.type || 'mcq'}::${text}`;
    if (existingTexts.has(sig)) continue;
    existingTexts.add(sig);
    toAdd.push({
      id: `bank-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      subject: q.topic?.trim() || cleanSubject,
      savedAt: new Date().toISOString(),
      question: {
        ...q,
        id: `q-${Math.random().toString(36).slice(2, 8)}`,
      },
    });
  }

  const next = [...toAdd, ...existing];
  persistQuestionBank(userId, next);
  return next;
}

export function removeQuestionFromBank(userId: string, bankId: string): BankQuestionItem[] {
  const next = loadQuestionBank(userId).filter(item => item.id !== bankId);
  persistQuestionBank(userId, next);
  return next;
}
