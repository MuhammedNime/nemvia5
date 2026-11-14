import React, { useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  FileCheck,
  Radio,
} from 'lucide-react';
import { AppRole, Assignment, LiveSession, Submission } from '../../types';
import { useAppSettings } from '../../lib/settings';

interface CalendarViewProps {
  currentRole: AppRole;
  currentUserId: string;
  assignments: Assignment[];
  submissions: Submission[];
  liveSessions: LiveSession[];
  onNavigate: (section: string) => void;
}

interface CalendarEvent {
  id: string;
  dateKey: string;
  iso: string;
  type: 'assignment' | 'live';
  title: string;
  meta: string;
  statusLabel: string;
  statusTone: 'emerald' | 'amber' | 'rose' | 'sky';
  meetingUrl?: string;
}

const toDateKey = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentRole,
  currentUserId,
  assignments,
  submissions,
  liveSessions,
  onNavigate,
}) => {
  const { settings } = useAppSettings();
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDayKey, setSelectedDayKey] = useState<string>(toDateKey(now.toISOString()));

  const locale = settings.lang === 'en' ? 'en-US' : settings.lang === 'fr' ? 'fr-FR' : 'ar';

  const events = useMemo<CalendarEvent[]>(() => {
    const out: CalendarEvent[] = [];
    const nowMs = Date.now();

    assignments.forEach(a => {
      const key = toDateKey(a.due_at);
      if (!key) return;
      const mySub = submissions.find(s => s.assignment_id === a.id && s.student_id === currentUserId);
      const dueMs = new Date(a.due_at).getTime();
      const overdue = !mySub && dueMs < nowMs;
      let statusLabel = `${a.total_points} درجة`;
      let statusTone: CalendarEvent['statusTone'] = 'amber';
      if (currentRole === 'student') {
        if (mySub?.grade !== undefined) {
          statusLabel = `مُصحح (${mySub.grade}/${a.total_points})`;
          statusTone = 'emerald';
        } else if (mySub) {
          statusLabel = 'تم التسليم ✓';
          statusTone = 'emerald';
        } else if (overdue) {
          statusLabel = 'متأخر';
          statusTone = 'rose';
        } else {
          statusLabel = 'مطلوب التسليم';
          statusTone = 'amber';
        }
      } else {
        statusLabel = `${a.submissions_count} تسليم`;
        statusTone = 'sky';
      }

      out.push({
        id: `asg-${a.id}`,
        dateKey: key,
        iso: a.due_at,
        type: 'assignment',
        title: a.title,
        meta: a.class_title || a.teacher_name,
        statusLabel,
        statusTone,
      });
    });

    liveSessions.forEach(ls => {
      const key = toDateKey(ls.starts_at);
      if (!key) return;
      out.push({
        id: `live-${ls.id}`,
        dateKey: key,
        iso: ls.starts_at,
        type: 'live',
        title: ls.title,
        meta: ls.class_title || ls.host_name,
        statusLabel: ls.status === 'live' ? 'بث مباشر الآن' : ls.status === 'ended' ? 'انتهت' : 'مجدولة',
        statusTone: ls.status === 'live' ? 'rose' : ls.status === 'ended' ? 'sky' : 'emerald',
        meetingUrl: ls.meeting_url,
      });
    });

    return out.sort((a, b) => a.iso.localeCompare(b.iso));
  }, [assignments, submissions, liveSessions, currentUserId, currentRole]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach(ev => {
      const list = map.get(ev.dateKey) || [];
      list.push(ev);
      map.set(ev.dateKey, list);
    });
    return map;
  }, [events]);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDayOffset = new Date(year, month, 1).getDay(); // 0=Sun..6=Sat
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ day: number | null; key: string }> = [];
  for (let i = 0; i < firstDayOffset; i++) cells.push({ day: null, key: `pad-${i}` });
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ day: d, key });
  }

  const todayKey = toDateKey(now.toISOString());
  const selectedEvents = eventsByDay.get(selectedDayKey) || [];
  const upcomingEvents = events.filter(ev => ev.dateKey >= todayKey).slice(0, 12);

  const dayNames = settings.lang === 'en'
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : settings.lang === 'fr'
      ? ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
      : ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const titleText = settings.lang === 'en'
    ? 'Academic Calendar & Schedule'
    : settings.lang === 'fr'
      ? 'Calendrier & Échéances'
      : 'التقويم الدراسي والمواعيد';

  const subtitleText = settings.lang === 'en'
    ? 'All assignment deadlines and scheduled live sessions in one place.'
    : settings.lang === 'fr'
      ? 'Suivez les dates limites des devoirs et les sessions en direct.'
      : 'تابع مواعيد تسليم الواجبات والحصص المباشرة المجدولة في تقويم واحد.';

  const badgeToneClass = (tone: CalendarEvent['statusTone']) =>
    tone === 'emerald'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : tone === 'rose'
        ? 'bg-rose-50 text-rose-700 border-rose-200'
        : tone === 'amber'
          ? 'bg-amber-50 text-amber-800 border-amber-200'
          : 'bg-sky-50 text-[#1677c7] border-sky-200';

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1677c7] text-white flex items-center justify-center shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">{titleText}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{subtitleText}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
            {assignments.length} {settings.lang === 'en' ? 'Tasks' : 'واجبات'}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
            {liveSessions.length} {settings.lang === 'en' ? 'Live' : 'حصص'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Grid */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-slate-900 text-base">
              {viewMonth.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setViewMonth(new Date(year, month - 1, 1))}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMonth(new Date(now.getFullYear(), now.getMonth(), 1));
                  setSelectedDayKey(todayKey);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                {settings.lang === 'en' ? 'Today' : settings.lang === 'fr' ? 'Aujourd’hui' : 'اليوم'}
              </button>
              <button
                type="button"
                onClick={() => setViewMonth(new Date(year, month + 1, 1))}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-slate-500">
            {dayNames.map(d => (
              <div key={d} className="py-1.5">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {cells.map(c => {
              if (!c.day) return <div key={c.key} className="h-14 sm:h-16 rounded-xl bg-slate-50/40" />;
              const dayEvents = eventsByDay.get(c.key) || [];
              const isToday = c.key === todayKey;
              const isSelected = c.key === selectedDayKey;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setSelectedDayKey(c.key)}
                  className={`h-14 sm:h-16 rounded-xl border p-1.5 flex flex-col justify-between text-start transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#1677c7] bg-sky-50'
                      : isToday
                        ? 'border-slate-400 bg-slate-50'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-xs font-black tabular-nums ${isToday ? 'text-[#1677c7]' : 'text-slate-800'}`}>
                    {c.day}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      {dayEvents.slice(0, 3).map(ev => (
                        <span
                          key={ev.id}
                          className={`w-2 h-2 rounded-full ${ev.type === 'live' ? 'bg-rose-500' : 'bg-amber-500'}`}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[9px] font-bold text-slate-500">+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day + Upcoming Agenda */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected Day Details */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-900">
                {new Date(`${selectedDayKey}T12:00:00`).toLocaleDateString(locale, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </h3>
              <span className="text-[11px] font-bold text-slate-500">{selectedEvents.length}</span>
            </div>

            {selectedEvents.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                {settings.lang === 'en' ? 'No events scheduled on this day.' : 'لا توجد مواعيد في هذا اليوم.'}
              </p>
            ) : (
              <div className="space-y-2.5">
                {selectedEvents.map(ev => (
                  <div key={ev.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        {ev.type === 'live' ? (
                          <Radio className="w-3.5 h-3.5 text-rose-600" />
                        ) : (
                          <FileCheck className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        <span>{ev.title}</span>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeToneClass(ev.statusTone)}`}>
                        {ev.statusLabel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(ev.iso).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })} · {ev.meta}
                      </span>
                      <div className="flex items-center gap-2">
                        {ev.meetingUrl && (
                          <a
                            href={ev.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#1677c7] font-bold inline-flex items-center gap-1 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>دخول</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => onNavigate(ev.type === 'live' ? 'live' : 'assignments')}
                          className="font-bold text-slate-700 hover:underline cursor-pointer"
                        >
                          {settings.lang === 'en' ? 'Open' : 'فتح'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Agenda */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3">
            <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{settings.lang === 'en' ? 'Upcoming Agenda' : 'الأجندة القادمة'}</span>
            </h3>
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                {settings.lang === 'en' ? 'All caught up!' : 'لا توجد مواعيد قادمة حالياً.'}
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {upcomingEvents.map(ev => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => {
                      setSelectedDayKey(ev.dateKey);
                      const d = new Date(ev.iso);
                      setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between gap-2 text-start cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{ev.title}</p>
                      <p className="text-[10px] text-slate-500">
                        {new Date(ev.iso).toLocaleDateString(locale, { day: 'numeric', month: 'short' })} · {ev.meta}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border shrink-0 ${badgeToneClass(ev.statusTone)}`}>
                      {ev.statusLabel}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
