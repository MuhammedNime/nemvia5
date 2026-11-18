import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck,
  Check,
  Clock,
  Download,
  Loader2,
  UserCheck,
  UserMinus,
  UserX,
} from 'lucide-react';
import {
  AppRole,
  ClassAttendanceRecord,
  ClassAttendanceStatus,
  ClassItem,
  ClassMemberInfo,
} from '../../types';
import * as api from '../../lib/api';
import { saveOrShareBlobFile } from '../../lib/native';

interface ClassAttendanceTabProps {
  cls: ClassItem;
  currentUserId: string;
  currentRole: AppRole;
  members: ClassMemberInfo[];
}

const STATUS_META: Record<
  ClassAttendanceStatus,
  { label: string; cls: string; activeCls: string }
> = {
  present: {
    label: 'حاضر',
    cls: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    activeCls: 'bg-emerald-600 text-white border-emerald-600',
  },
  late: {
    label: 'متأخر',
    cls: 'text-amber-800 bg-amber-50 border-amber-200',
    activeCls: 'bg-amber-500 text-white border-amber-500',
  },
  excused: {
    label: 'بعذر',
    cls: 'text-sky-700 bg-sky-50 border-sky-200',
    activeCls: 'bg-[#1677c7] text-white border-[#1677c7]',
  },
  absent: {
    label: 'غائب',
    cls: 'text-rose-700 bg-rose-50 border-rose-200',
    activeCls: 'bg-rose-600 text-white border-rose-600',
  },
};

const todayDateKey = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const ClassAttendanceTab: React.FC<ClassAttendanceTabProps> = ({
  cls,
  currentUserId,
  currentRole,
  members,
}) => {
  const isTeacherOrAdmin = cls.teacher_id === currentUserId || currentRole === 'admin';
  const mode: 'teacher' | 'student' | 'admin' =
    currentRole === 'admin' && cls.teacher_id !== currentUserId
      ? 'admin'
      : isTeacherOrAdmin
        ? 'teacher'
        : 'student';

  const [records, setRecords] = useState<ClassAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(todayDateKey());
  const [savingId, setSavingId] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    setLoading(true);
    const unsub = api.subscribeClassAttendance(cls.id, currentUserId, mode, items => {
      setRecords(items);
      setLoading(false);
    });
    return () => unsub();
  }, [cls.id, currentUserId, mode]);

  const classStudents = useMemo(() => {
    const map = new Map<string, { user_id: string; name: string }>();
    members
      .filter(m => m.class_id === cls.id && m.user_id !== cls.teacher_id)
      .forEach(m => map.set(m.user_id, { user_id: m.user_id, name: m.name }));
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  }, [members, cls.id, cls.teacher_id]);

  const recordsForDate = useMemo(() => {
    const map = new Map<string, ClassAttendanceRecord>();
    records.filter(r => r.date_key === selectedDate).forEach(r => map.set(r.student_id, r));
    return map;
  }, [records, selectedDate]);

  const studentStats = useMemo(() => {
    const map = new Map<string, { present: number; late: number; absent: number; excused: number; total: number }>();
    records.forEach(r => {
      const cur = map.get(r.student_id) || { present: 0, late: 0, absent: 0, excused: 0, total: 0 };
      cur[r.status] += 1;
      cur.total += 1;
      map.set(r.student_id, cur);
    });
    return map;
  }, [records]);

  const handleMark = async (
    studentId: string,
    studentName: string,
    status: ClassAttendanceStatus,
    explicitNote?: string,
  ) => {
    setSavingId(studentId);
    try {
      await api.upsertClassAttendance({
        classId: cls.id,
        dateKey: selectedDate,
        studentId,
        studentName,
        teacherId: cls.teacher_id,
        status,
        note: explicitNote ?? noteDrafts[studentId] ?? recordsForDate.get(studentId)?.note,
      });
    } finally {
      setSavingId(null);
    }
  };

  const handleMarkAllPresent = async () => {
    if (classStudents.length === 0) return;
    setBulkBusy(true);
    try {
      await Promise.all(
        classStudents.map(st =>
          api.upsertClassAttendance({
            classId: cls.id,
            dateKey: selectedDate,
            studentId: st.user_id,
            studentName: st.name,
            teacherId: cls.teacher_id,
            status: 'present',
            note: noteDrafts[st.user_id] ?? recordsForDate.get(st.user_id)?.note,
          }),
        ),
      );
    } finally {
      setBulkBusy(false);
    }
  };

  const exportAttendanceCsv = () => {
    const header = ['التاريخ', 'الطالب', 'الحالة', 'ملاحظة المعلم'];
    const escapeCell = (v: string) => `"${String(v || '').replace(/"/g, '""')}"`;
    const lines = [
      header.map(escapeCell).join(','),
      ...records.map(r =>
        [r.date_key, r.student_name, STATUS_META[r.status].label, r.note || ''].map(escapeCell).join(','),
      ),
    ];
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    void saveOrShareBlobFile(blob, `nemvia-attendance-${cls.join_code || 'class'}.csv`);
  };

  if (!isTeacherOrAdmin) {
    const myStats = studentStats.get(currentUserId) || { present: 0, late: 0, absent: 0, excused: 0, total: 0 };
    const rate =
      myStats.total > 0
        ? Math.round(((myStats.present + myStats.late * 0.5) / myStats.total) * 100)
        : 100;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-[#1677c7]" />
              <span>سجل حضوري ومشاركتي في الصف</span>
            </h4>
            <p className="text-[11px] text-slate-500">متابعة أيام الحضور والغياب المسجلة من معلم المادة</p>
          </div>
          {records.length > 0 && (
            <button
              type="button"
              onClick={exportAttendanceCsv}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير CSV</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center tabular-nums">
          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200">
            <span className="text-[10px] font-bold text-slate-500 block">نسبة الالتزام</span>
            <span className="text-lg font-black text-[#1677c7]">{rate}%</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] font-bold text-slate-500 block">حاضر</span>
            <span className="text-lg font-black text-emerald-700">{myStats.present}</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="text-[10px] font-bold text-slate-500 block">متأخر / بعذر</span>
            <span className="text-lg font-black text-amber-800">{myStats.late + myStats.excused}</span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
            <span className="text-[10px] font-bold text-slate-500 block">غائب</span>
            <span className="text-lg font-black text-rose-700">{myStats.absent}</span>
          </div>
        </div>

        {loading ? (
          <div className="py-8 flex items-center justify-center text-slate-400 gap-2 text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-[#1677c7]" />
            <span>جاري تحميل سجل الحضور...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-slate-500 text-xs">
            لم يسجل معلم الصف أي جلسة حضور بعد.
          </div>
        ) : (
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {records.map(r => (
              <div
                key={r.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
              >
                <div>
                  <span className="font-bold text-slate-900 block tabular-nums">{r.date_key}</span>
                  {r.note && <span className="text-[11px] text-slate-500">{r.note}</span>}
                </div>
                <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${STATUS_META[r.status].cls}`}>
                  {STATUS_META[r.status].label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
            <CalendarCheck className="w-4 h-4 text-[#1677c7]" />
            <span>دفتر الحضور والغياب اليومي</span>
          </h4>
          <p className="text-[11px] text-slate-500">سجل حضور طلاب الصف لكل يوم واحصل على نسبة الالتزام تلقائياً</p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value || todayDateKey())}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#1677c7]"
          />
          {classStudents.length > 0 && (
            <button
              type="button"
              disabled={bulkBusy}
              onClick={() => void handleMarkAllPresent()}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold rounded-xl text-[11px] inline-flex items-center gap-1 cursor-pointer"
            >
              {bulkBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>تحضير الكل</span>
            </button>
          )}
          {records.length > 0 && (
            <button
              type="button"
              onClick={exportAttendanceCsv}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-[11px] inline-flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-8 flex items-center justify-center text-slate-400 gap-2 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-[#1677c7]" />
          <span>جاري تحميل دفتر الحضور...</span>
        </div>
      ) : classStudents.length === 0 ? (
        <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-slate-500 text-xs">
          لا يوجد طلاب مسجلون في هذا الصف بعد. شارك رمز الانضمام للطلاب لتتمكن من رصد حضورهم.
        </div>
      ) : (
        <div className="space-y-2.5">
          {classStudents.map(st => {
            const rec = recordsForDate.get(st.user_id);
            const curStatus = rec?.status;
            const stStats = studentStats.get(st.user_id);
            const rate =
              stStats && stStats.total > 0
                ? Math.round(((stStats.present + stStats.late * 0.5) / stStats.total) * 100)
                : null;
            const noteVal = noteDrafts[st.user_id] ?? rec?.note ?? '';

            return (
              <div
                key={st.user_id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-black text-slate-900 text-xs">{st.name}</span>
                    {rate !== null && (
                      <span className="text-[10px] text-slate-500 mr-2 tabular-nums">
                        نسبة الالتزام: {rate}% ({stStats?.total} جلسة)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-wrap">
                    {(['present', 'late', 'excused', 'absent'] as ClassAttendanceStatus[]).map(statusKey => {
                      const meta = STATUS_META[statusKey];
                      const active = curStatus === statusKey;
                      return (
                        <button
                          key={statusKey}
                          type="button"
                          disabled={savingId === st.user_id}
                          onClick={() => void handleMark(st.user_id, st.name, statusKey)}
                          className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition-colors inline-flex items-center gap-1 ${
                            active ? meta.activeCls : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {statusKey === 'present' && <UserCheck className="w-3 h-3" />}
                          {statusKey === 'late' && <Clock className="w-3 h-3" />}
                          {statusKey === 'excused' && <UserMinus className="w-3 h-3" />}
                          {statusKey === 'absent' && <UserX className="w-3 h-3" />}
                          <span>{meta.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={noteVal}
                    onChange={e => setNoteDrafts(prev => ({ ...prev, [st.user_id]: e.target.value }))}
                    placeholder="ملاحظة سريعة (اختياري: مشاركة متميزة، عذر طبي...)"
                    maxLength={300}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] outline-none focus:border-[#1677c7]"
                  />
                  {noteVal !== (rec?.note ?? '') && curStatus && (
                    <button
                      type="button"
                      onClick={() => void handleMark(st.user_id, st.name, curStatus, noteVal)}
                      className="px-2.5 py-1.5 bg-[#1677c7] text-white font-bold rounded-xl text-[10px] cursor-pointer"
                    >
                      حفظ الملاحظة
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
