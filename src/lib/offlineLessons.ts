import { Lesson } from '../types';

export interface OfflineSavedLesson {
  id: string;
  class_id: string;
  title: string;
  content: string;
  teacher_name: string;
  duration?: string;
  video_url?: string;
  attachment_url?: string;
  attachment_name?: string;
  saved_at: string;
}

const keyFor = (uid: string) => `nemvia-offline-lessons-${uid}`;

export function loadOfflineLessons(uid: string): OfflineSavedLesson[] {
  if (!uid || typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(keyFor(uid));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOfflineLesson(uid: string, lesson: Lesson): OfflineSavedLesson[] {
  const existing = loadOfflineLessons(uid);
  const entry: OfflineSavedLesson = {
    id: lesson.id,
    class_id: lesson.class_id,
    title: lesson.title,
    content: lesson.content,
    teacher_name: lesson.teacher_name,
    duration: lesson.duration,
    video_url: lesson.video_url,
    attachment_url: lesson.attachment_url,
    attachment_name: lesson.attachment_name,
    saved_at: new Date().toISOString(),
  };
  const next = [entry, ...existing.filter(item => item.id !== lesson.id)].slice(0, 60);
  try {
    localStorage.setItem(keyFor(uid), JSON.stringify(next));
  } catch {
    /* ignore storage quota errors */
  }
  return next;
}

export function removeOfflineLesson(uid: string, lessonId: string): OfflineSavedLesson[] {
  const existing = loadOfflineLessons(uid);
  const next = existing.filter(item => item.id !== lessonId);
  try {
    localStorage.setItem(keyFor(uid), JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}
