import React, { useState } from 'react';
import {
  Clock,
  Radio,
  ExternalLink,
  Plus,
  X,
  CheckCircle2,
  ClipboardCheck,
  Download,
} from 'lucide-react';
import { AppRole, ClassItem, ClassMemberInfo, LiveSession } from '../../types';
import { saveOrShareBlobFile } from '../../lib/native';

interface LiveClassroomViewProps {
  currentRole: AppRole;
  currentUserId: string;
  currentUserName: string;
  sessions: LiveSession[];
  classes: ClassItem[];
  classMembers?: ClassMemberInfo[];
  onScheduleSession: (l: { title: string; description: string; class_id?: string; meeting_url: string; starts_at: string }) => Promise<boolean>;
  onSetStatus: (id: string, status: 'live' | 'ended' | 'cancelled') => Promise<boolean>;
}

type AttendanceStatus = 'present' | 'late' | 'absent';
interface AttendanceRecord {
  userId: string;
  name: string;
  status: AttendanceStatus;
  checkedAt?: string;
}

const attKey = (sessionId: string) => `nemvia-attendance-${sessionId}`;

function loadAttendance(sessionId: string): Record<string, AttendanceRecord> {
  try {
    const raw = localStorage.getItem(attKey(sessionId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAttendance(sessionId: string, records: Record<string, AttendanceRecord>) {
  try {
    localStorage.setItem(attKey(sessionId), JSON.stringify(records));
  } catch {
    /* ignore */
  }
}

export const LiveClassroomView: React.FC<LiveClassroomViewProps> = ({
  currentRole,
  currentUserId,
  currentUserName,
  sessions,
  classes,
  classMembers = [],
  onScheduleSession,
  onSetStatus,
}) => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [sTitle, setSTitle] = useState('');
  const [sDesc, setSDesc] = useState('');
  const [sClass, setSClass] = useState('');
  const [sWhen, setSWhen] = useState('');
  const [sProvider, setSProvider] = useState<'jitsi' | 'custom'>('jitsi');
  const [sLink, setSLink] = useState('');
  const [formErr, setFormErr] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const [attendanceModalSession, setAttendanceModalSession] = useState<LiveSession | null>(null);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceRecord>>({});

  const myClasses = classes.filter(c => c.teacher_id === currentUserId);
  const canHost = currentRole === 'teacher' || currentRole === 'admin';

  const submitSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr(null);
    let url = sLink.trim();
    if (sProvider === 'jitsi') {
      const room = 'nemvia-' + Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 8);
      url = `https://meet.jit.si/${room}`;
    } else if (!/^https:\/\//i.test(url)) {
      setFormErr('الصق رابط الاجتماع كاملاً (يبدأ بـ https://)');
      return;
    }
    const ok = await onScheduleSession({
      title: sTitle.trim(),
      description: sDesc.trim(),
      class_id: sClass || undefined,
      meeting_url: url,
      starts_at: sWhen ? new Date(sWhen).toISOString() : new Date().toISOString(),
    });
    if (ok) {
      setShowSchedule(false);
      setSTitle('');
      setSDesc('');
      setSLink('');
      setSWhen('');
    }
  };

  const recordCheckIn = (session: LiveSession, userId = currentUserId, userName = currentUserName) => {
    const prev = loadAttendance(session.id);
    const next: Record<string, AttendanceRecord> = {
      ...prev,
      [userId]: {
        userId,
        name: userName,
        status: prev[userId]?.status || 'present',
        checkedAt: prev[userId]?.checkedAt || new Date().toISOString(),
      },
    };
    saveAttendance(session.id, next);
    if (attendanceModalSession?.id === session.id) setAttendanceMap(next);
  };

  const openAttendanceSheet = (session: LiveSession) => {
    const existing = loadAttendance(session.id);
    const merged: Record<string, AttendanceRecord> = { ...existing };
    if (session.class_id) {
      classMembers
        .filter(m => m.class_id === session.class_id)
        .forEach(m => {
          if (!merged[m.user_id]) {
            merged[m.user_id] = { userId: m.user_id, name: m.name, status: 'absent' };
          }
        });
    }
    saveAttendance(session.id, merged);
    setAttendanceMap(merged);
    setAttendanceModalSession(session);
  };

  const updateAttendanceStatus = (userId: string, status: AttendanceStatus) => {
    if (!attendanceModalSession) return;
    const prev = attendanceMap[userId];
    if (!prev) return;
    const next = {
      ...attendanceMap,
      [userId]: {
        ...prev,
        status,
        checkedAt: status !== 'absent' ? prev.checkedAt || new Date().toISOString() : undefined,
      },
    };
    setAttendanceMap(next);
    saveAttendance(attendanceModalSession.id, next);
  };

  const exportAttendanceCsv = () => {
    if (!attendanceModalSession) return;
    const list = Object.values(attendanceMap);
    const statusLabel = (s: AttendanceStatus) => (s === 'present' ? 'حاضر' : s === 'late' ? 'متأخر' : 'غائب');
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const lines = [
      ['الاسم', 'الحالة', 'وقت الحضور'].map(esc).join(','),
      ...list.map(r => [
        r.name,
        statusLabel(r.status),
        r.checkedAt ? new Date(r.checkedAt).toLocaleString('ar') : '—',
      ].map(esc).join(',')),
    ];
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    void saveOrShareBlobFile(blob, `attendance-${attendanceModalSession.title.slice(0, 20)}-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Clean Architectural Header */}
      <div className="bg-white border border-slate-200 p-6 sm:p-7 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="text-xs font-bold text-[#1677c7] inline-flex items-center gap-1.5">
            <Radio className="w-4 h-4" />
            <span>الحصص المباشرة والمجدولة</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            قاعات البث المباشر والاجتماعات الأكاديمية
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            انضم مباشرة إلى حصص المعلمين عبر Jitsi أو Google Meet مع تسجيل الحضور التلقائي وتصدير الكشوف.
          </p>
        </div>

        {canHost && (
          <div className="flex shrink-0">
            <button
              type="button"
              onClick={() => setShowSchedule(true)}
              className="min-h-[44px] px-5 py-2.5 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>جدولة حصة جديدة</span>
            </button>
          </div>
        )}
      </div>

      {showSchedule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowSchedule(false)}>
          <form onSubmit={submitSchedule} onClick={e => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-lg p-6 space-y-3.5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base">جدولة حصة مباشرة</h3>
              <button type="button" onClick={() => setShowSchedule(false)} className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <input value={sTitle} onChange={e => setSTitle(e.target.value)} placeholder="عنوان الحصة" required maxLength={120} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]" />
            <textarea value={sDesc} onChange={e => setSDesc(e.target.value)} placeholder="وصف مختصر" rows={2} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select value={sClass} onChange={e => setSClass(e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]">
                <option value="">حصة عامة (للجميع)</option>
                {myClasses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <input type="datetime-local" value={sWhen} onChange={e => setSWhen(e.target.value)} required className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button type="button" onClick={() => setSProvider('jitsi')} className={`min-h-[44px] py-2 rounded-xl border cursor-pointer ${sProvider === 'jitsi' ? 'border-[#1677c7] bg-sky-50 text-[#1677c7]' : 'border-slate-200 text-slate-500'}`}>Jitsi (تلقائي ومجاني)</button>
              <button type="button" onClick={() => setSProvider('custom')} className={`min-h-[44px] py-2 rounded-xl border cursor-pointer ${sProvider === 'custom' ? 'border-[#1677c7] bg-sky-50 text-[#1677c7]' : 'border-slate-200 text-slate-500'}`}>رابط Google Meet / غيره</button>
            </div>
            {sProvider === 'custom' && (
              <input value={sLink} onChange={e => setSLink(e.target.value)} placeholder="https://meet.google.com/xxx-xxxx-xxx" dir="ltr" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]" />
            )}
            {formErr && <p className="text-xs font-bold text-rose-600">{formErr}</p>}
            <button type="submit" className="w-full min-h-[44px] py-3 bg-[#1677c7] hover:bg-[#125fa0] text-white font-black rounded-xl text-sm cursor-pointer transition-colors">جدولة الحصة</button>
          </form>
        </div>
      )}

      {/* Sessions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-900 text-lg">الحصص المجدولة والمباشرة</h3>
          <span className="text-xs text-slate-500 tabular-nums">{sessions.length} حصص متاحة</span>
        </div>

        {sessions.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
            لا توجد حصص مجدولة حالياً.{canHost ? ' اضغط «جدولة حصة جديدة» لإنشاء أول حصة.' : ''}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#1677c7] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className={`font-bold inline-flex items-center gap-1.5 ${
                    s.status === 'live' ? 'text-rose-600' : s.status === 'ended' ? 'text-slate-500' : 'text-[#1677c7]'
                  }`}>
                    <Radio className="w-3.5 h-3.5" />
                    <span>{s.status === 'live' ? 'بث حي الآن' : s.status === 'ended' ? 'انتهت' : 'مجدولة'}</span>
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono tabular-nums">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(s.starts_at).toLocaleString('ar', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-900 text-base leading-snug">{s.title}</h4>
                {s.description && <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>}
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-[#1677c7] flex items-center justify-center font-bold text-xs shrink-0">
                    {s.host_name.slice(0, 1)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">{s.host_name}</span>
                    <span className="text-[11px] text-slate-400">{s.class_title || 'حصة عامة'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {canHost && (
                    <button
                      type="button"
                      onClick={() => openAttendanceSheet(s)}
                      className="min-h-[40px] px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      <span>الحضور</span>
                    </button>
                  )}
                  {s.host_id === currentUserId && s.status !== 'ended' && (
                    <>
                      {s.status === 'scheduled' && (
                        <button type="button" onClick={() => onSetStatus(s.id, 'live')} className="min-h-[40px] px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer whitespace-nowrap">ابدأ</button>
                      )}
                      {s.status === 'live' && (
                        <button type="button" onClick={() => onSetStatus(s.id, 'ended')} className="min-h-[40px] px-3 py-2 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer whitespace-nowrap">إنهاء</button>
                      )}
                      {confirmCancelId === s.id ? (
                        <span className="inline-flex items-center gap-1">
                          <button type="button" onClick={() => { setConfirmCancelId(null); onSetStatus(s.id, 'cancelled'); }} className="min-h-[40px] px-3 py-2 bg-rose-600 text-white font-bold rounded-xl cursor-pointer whitespace-nowrap">تأكيد الإلغاء</button>
                          <button type="button" onClick={() => setConfirmCancelId(null)} className="min-h-[40px] px-2.5 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl cursor-pointer whitespace-nowrap">تراجع</button>
                        </span>
                      ) : (
                        <button type="button" onClick={() => setConfirmCancelId(s.id)} className="min-h-[40px] px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl cursor-pointer whitespace-nowrap">إلغاء</button>
                      )}
                    </>
                  )}
                  {s.meeting_url && s.status !== 'ended' && (
                    <a
                      href={s.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => recordCheckIn(s)}
                      className="min-h-[40px] px-4 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>انضم للحصة</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Modal */}
      {attendanceModalSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setAttendanceModalSession(null)}>
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-xl p-6 space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="font-black text-slate-900 text-base">سجل حضور الحصة: {attendanceModalSession.title}</h3>
                <p className="text-[11px] text-slate-500">يتم تسجيل حضور الطلاب تلقائياً عند الانضمام أو يدوياً من هنا.</p>
              </div>
              <button type="button" onClick={() => setAttendanceModalSession(null)} className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-2xl">
              {Object.values(attendanceMap).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">لم يسجّل أحد حضوره لهذه الحصة بعد.</p>
              ) : (
                Object.values(attendanceMap).map(rec => (
                  <div key={rec.userId} className="p-3 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{rec.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {rec.checkedAt ? `سجّل ${new Date(rec.checkedAt).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}` : 'لم يحضر بعد'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-bold">
                      {([
                        ['present', 'حاضر', 'bg-emerald-100 text-emerald-800 border-emerald-300'],
                        ['late', 'متأخر', 'bg-amber-100 text-amber-800 border-amber-300'],
                        ['absent', 'غائب', 'bg-rose-100 text-rose-700 border-rose-300'],
                      ] as const).map(([st, lbl, activeCls]) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => updateAttendanceStatus(rec.userId, st)}
                          className={`min-h-[36px] px-2.5 py-1 rounded-lg border text-[11px] cursor-pointer ${
                            rec.status === st ? activeCls : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 tabular-nums">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  الحاضرون: {Object.values(attendanceMap).filter(r => r.status === 'present').length} / {Object.values(attendanceMap).length}
                </span>
              </span>
              <button
                type="button"
                onClick={exportAttendanceCsv}
                disabled={Object.values(attendanceMap).length === 0}
                className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تصدير CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
