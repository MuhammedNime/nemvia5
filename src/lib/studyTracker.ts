export interface StudyLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  subject: string;
  minutes: number;
  source: 'pomodoro' | 'manual';
  created_at: string;
}

export interface StudyTrackerState {
  dailyGoalMinutes: number;
  logs: StudyLogEntry[];
}

const keyFor = (uid: string) => `nemvia-study-tracker-${uid}`;

export function todayIsoDate(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function loadStudyTracker(uid: string): StudyTrackerState {
  if (!uid || typeof window === 'undefined') {
    return { dailyGoalMinutes: 60, logs: [] };
  }
  try {
    const raw = localStorage.getItem(keyFor(uid));
    if (!raw) return { dailyGoalMinutes: 60, logs: [] };
    const parsed = JSON.parse(raw) as Partial<StudyTrackerState>;
    return {
      dailyGoalMinutes: Math.max(15, Math.min(480, Number(parsed.dailyGoalMinutes) || 60)),
      logs: Array.isArray(parsed.logs) ? parsed.logs : [],
    };
  } catch {
    return { dailyGoalMinutes: 60, logs: [] };
  }
}

function persistStudyTracker(uid: string, state: StudyTrackerState) {
  if (!uid || typeof window === 'undefined') return;
  try {
    localStorage.setItem(keyFor(uid), JSON.stringify(state));
  } catch {
    /* ignore storage quota */
  }
}

export function setDailyStudyGoal(uid: string, minutes: number): StudyTrackerState {
  const curr = loadStudyTracker(uid);
  const next: StudyTrackerState = {
    ...curr,
    dailyGoalMinutes: Math.max(15, Math.min(480, Math.round(minutes) || 60)),
  };
  persistStudyTracker(uid, next);
  return next;
}

export function logStudySession(
  uid: string,
  subject: string,
  minutes: number,
  source: 'pomodoro' | 'manual' = 'manual',
): StudyTrackerState {
  const curr = loadStudyTracker(uid);
  const entry: StudyLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    date: todayIsoDate(),
    subject: (subject || 'مذاكرة عامة').trim().slice(0, 60),
    minutes: Math.max(1, Math.min(360, Math.round(minutes))),
    source,
    created_at: new Date().toISOString(),
  };
  const next: StudyTrackerState = {
    ...curr,
    logs: [entry, ...curr.logs].slice(0, 300),
  };
  persistStudyTracker(uid, next);
  return next;
}

export function removeStudyLog(uid: string, logId: string): StudyTrackerState {
  const curr = loadStudyTracker(uid);
  const next: StudyTrackerState = {
    ...curr,
    logs: curr.logs.filter(l => l.id !== logId),
  };
  persistStudyTracker(uid, next);
  return next;
}

export function buildWeeklySummary(state: StudyTrackerState): {
  days: Array<{ date: string; label: string; minutes: number }>;
  todayMinutes: number;
  weeklyMinutes: number;
  bySubject: Array<{ subject: string; minutes: number }>;
} {
  const dayNames = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  const days: Array<{ date: string; label: string; minutes: number }> = [];
  const todayStr = todayIsoDate();

  for (let offset = 6; offset >= 0; offset--) {
    const d = new Date();
    d.setDate(d.getDate() - offset);
    const dateStr = todayIsoDate(d);
    const total = state.logs
      .filter(l => l.date === dateStr)
      .reduce((acc, l) => acc + l.minutes, 0);
    days.push({
      date: dateStr,
      label: offset === 0 ? 'اليوم' : dayNames[d.getDay()],
      minutes: total,
    });
  }

  const weekDates = new Set(days.map(d => d.date));
  const weekLogs = state.logs.filter(l => weekDates.has(l.date));
  const subjectTotals = new Map<string, number>();
  weekLogs.forEach(l => {
    subjectTotals.set(l.subject, (subjectTotals.get(l.subject) || 0) + l.minutes);
  });

  const bySubject = Array.from(subjectTotals.entries())
    .map(([subject, minutes]) => ({ subject, minutes }))
    .sort((a, b) => b.minutes - a.minutes);

  return {
    days,
    todayMinutes: state.logs.filter(l => l.date === todayStr).reduce((acc, l) => acc + l.minutes, 0),
    weeklyMinutes: days.reduce((acc, d) => acc + d.minutes, 0),
    bySubject,
  };
}
