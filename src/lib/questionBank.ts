import { QuizQuestion } from '../types';
import {
  deleteCloudQuestionBankItem,
  listCloudQuestionBank,
  saveQuestionsToCloudBank,
} from './api';

export interface BankQuestionItem {
  id: string;
  subject: string;
  savedAt: string;
  question: QuizQuestion;
  cloudId?: string;
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
    localStorage.setItem(keyFor(userId), JSON.stringify(items.slice(0, 250)));
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

  if (userId && toAdd.length > 0) {
    void saveQuestionsToCloudBank(
      userId,
      cleanSubject,
      toAdd.map(item => item.question),
    ).then(cloudCreated => {
      if (!cloudCreated.length) return;
      const cur = loadQuestionBank(userId);
      const byQ = new Map(cloudCreated.map(c => [`${c.q_type}::${c.question.question.trim()}`, c.id]));
      const updated = cur.map(item => {
        const sig = `${item.question.type || 'mcq'}::${item.question.question.trim()}`;
        const cid = byQ.get(sig);
        return cid ? { ...item, cloudId: cid } : item;
      });
      persistQuestionBank(userId, updated);
    });
  }

  return next;
}

export async function syncQuestionBankWithCloud(userId: string): Promise<BankQuestionItem[]> {
  const local = loadQuestionBank(userId);
  if (!userId) return local;
  try {
    const cloud = await listCloudQuestionBank(userId);
    const mergedMap = new Map<string, BankQuestionItem>();

    cloud.forEach(c => {
      const sig = `${c.q_type}::${String(c.question?.question || '').trim()}`;
      if (!c.question?.question) return;
      mergedMap.set(sig, {
        id: `cloud-${c.id}`,
        cloudId: c.id,
        subject: c.subject || 'عام',
        savedAt: c.created_at,
        question: c.question,
      });
    });

    const unsynced: BankQuestionItem[] = [];
    local.forEach(item => {
      const sig = `${item.question.type || 'mcq'}::${item.question.question.trim()}`;
      if (!mergedMap.has(sig)) {
        mergedMap.set(sig, item);
        if (!item.cloudId) unsynced.push(item);
      }
    });

    if (unsynced.length > 0) {
      void saveQuestionsToCloudBank(
        userId,
        unsynced[0]?.subject || 'عام',
        unsynced.map(u => u.question),
      );
    }

    const merged = [...mergedMap.values()].sort((a, b) => b.savedAt.localeCompare(a.savedAt));
    persistQuestionBank(userId, merged);
    return merged;
  } catch {
    return local;
  }
}

export function removeQuestionFromBank(userId: string, bankId: string): BankQuestionItem[] {
  const current = loadQuestionBank(userId);
  const target = current.find(item => item.id === bankId);
  const next = current.filter(item => item.id !== bankId);
  persistQuestionBank(userId, next);
  const cloudId = target?.cloudId || (bankId.startsWith('cloud-') ? bankId.slice(6) : undefined);
  if (cloudId) {
    void deleteCloudQuestionBankItem(cloudId);
  }
  return next;
}
