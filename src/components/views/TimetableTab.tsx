import React, { useEffect, useMemo, useState } from 'react';
import {
  Clock,
  Download,
  Loader2,
  MapPin,
  Plus,
  Printer,
  Trash2,
  X,
} from 'lucide-react';
import { AppRole, ClassItem, TimetableSlot } from '../../types';
import * as api from '../../lib/api';
import { saveOrShareBlobFile } from '../../lib/native';

interface TimetableTabProps {
  currentRole: AppRole;
  currentUserId: string;
  classes: ClassItem[];
}

const WEEK_DAYS: Array<{ day: number; label: string }> = [
  { day: 6, label: 'السبت' },
  { day: 0, label: 'الأحد' },
  { day: 1, label: 'الإثنين' },
  { day: 2, label: 'الثلاثاء' },
  { day: 3, label: 'الأربعاء' },
  { day: 4, label: 'الخميس' },
  { day: 5, label: 'الجمعة' },
];

export const TimetableTab: React.FC<TimetableTabProps> = ({
  currentRole,
  currentUserId,
  classes,
}) => {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const myTaughtClasses = useMemo(
    () => (currentRole === 'admin' ? classes : classes.filter(c => c.teacher_id === currentUserId)),
    [classes, currentRole, currentUserId],
  );
  const canCreate = (currentRole === 'teacher' || currentRole === 'admin') && myTaughtClasses.length > 0;

  const [classId, setClassId] = useState('');
  const [subject, setSubject] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<number>(0);
  const [startTime, setStartTime] = useState('08:30');
  const [endTime, setEndTime] = useState('09:15');
  const [room, setRoom] = useState('');
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsub = api.subscribeTimetableSlots(items => {
      setSlots(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const relevantClassIds = useMemo(() => new Set(classes.map(c => c.id)), [classes]);
  const visibleSlots = useMemo(() => {
    if (currentRole === 'admin' || relevantClassIds.size === 0) return slots;
    return slots.filter(s => relevantClassIds.has(s.class_id) || s.teacher_id === currentUserId);
  }, [slots, relevantClassIds, currentRole, currentUserId]);

  const todayDow = new Date().getDay();

  const handleOpenAdd = () => {
    const first = myTaughtClasses[0];
    setClassId(first?.id || '');
    setSubject(first?.subject || '');
    setDayOfWeek(todayDow === 5 ? 0 : todayDow);
    setStartTime('08:30');
    setEndTime('09:15');
    setRoom('');
    setFormErr(null);
    setShowAdd(true);
  };

  const handleClassChange = (nextId: string) => {
    setClassId(nextId);
    const found = myTaughtClasses.find(c => c.id === nextId);
    if (found?.subject) setSubject(found.subject);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetClass = myTaughtClasses.find(c => c.id === classId) || myTaughtClasses[0];
    if (!targetClass) {
      setFormErr('أنشئ صفاً أولاً لإضافة حصة إلى الجدول.');
      return;
    }
    if (endTime <= startTime) {
      setFormErr('وقت النهاية يجب أن يكون بعد وقت البداية.');
      return;
    }
    setSaving(true);
    setFormErr(null);
    try {
      await api.createTimetableSlot({
        classId: targetClass.id,
        teacherId: currentUserId,
        classTitle: targetClass.title,
        subject: subject.trim() || targetClass.subject || targetClass.title,
        dayOfWeek,
        startTime,
        endTime,
        room,
      });
      setShowAdd(false);
    } catch (err: any) {
      setFormErr(err?.message || 'تعذّر إضافة الحصة إلى الجدول.');
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = () => {
    const dayLabel = (d: number) => WEEK_DAYS.find(w => w.day === d)?.label || '';
    const header = ['اليوم', 'من', 'إلى', 'المادة', 'الصف', 'القاعة / الرابط'];
    const esc = (v: string) => `"${String(v || '').replace(/"/g, '""')}"`;
    const lines = [
      header.map(esc).join(','),
      ...visibleSlots.map(s =>
        [dayLabel(s.day_of_week), s.start_time, s.end_time, s.subject, s.class_title, s.room || ''].map(esc).join(','),
      ),
    ];
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    void saveOrShareBlobFile(blob, `nemvia-timetable-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const daysToDisplay = useMemo(() => {
    const hasFriday = visibleSlots.some(s => s.day_of_week === 5);
    return hasFriday ? WEEK_DAYS : WEEK_DAYS.filter(w => w.day !== 5);
  }, [visibleSlots]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-3 no-print">
        <div>
          <h2 className="font-black text-slate-900 text-base">جدول الحصص الأسبوعي</h2>
          <p className="text-xs text-slate-500">مواعيد الحصص المتكررة أسبوعياً لجميع صفوفك وموادك</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {visibleSlots.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الجدول</span>
              </button>
              <button
                type="button"
                onClick={exportCsv}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>تصدير CSV</span>
              </button>
            </>
          )}

          {canCreate && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حصة للجدول</span>
            </button>
          )}
        </div>
      </div>

      {showAdd && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 text-xs animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-sm">إضافة حصة أسبوعية متكررة</h3>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">الصف الدراسي:</label>
              <select
                value={classId}
                onChange={e => handleClassChange(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] font-bold"
              >
                {myTaughtClasses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">المادة / عنوان الحصة:</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="مثال: الرياضيات — الجبر"
                maxLength={120}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">اليوم:</label>
              <select
                value={dayOfWeek}
                onChange={e => setDayOfWeek(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] font-bold"
              >
                {WEEK_DAYS.map(w => (
                  <option key={w.day} value={w.day}>{w.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">وقت البداية:</label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] tabular-nums"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">وقت النهاية:</label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">القاعة أو الملاحظة (اختياري):</label>
            <input
              type="text"
              value={room}
              onChange={e => setRoom(e.target.value)}
              placeholder="مثال: قاعة 204 أو بث مباشر"
              maxLength={120}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
            />
          </div>

          {formErr && (
            <p className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold">{formErr}</p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white font-bold rounded-xl cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>حفظ في الجدول الأسبوعي</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 flex items-center justify-center gap-2 text-slate-400 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-[#1677c7]" />
          <span>جاري تحميل جدول الحصص...</span>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {daysToDisplay.map(w => {
            const daySlots = visibleSlots.filter(s => s.day_of_week === w.day);
            const isToday = todayDow === w.day;
            return (
              <div
                key={w.day}
                className={`rounded-3xl border overflow-hidden bg-white ${
                  isToday ? 'border-[#1677c7] shadow-xs' : 'border-slate-200'
                }`}
              >
                <div
                  className={`px-4 py-3 border-b flex items-center justify-between ${
                    isToday ? 'bg-sky-50 border-sky-200 text-[#0f233a]' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <span className="font-black text-sm">{w.label}</span>
                  <span className="text-[11px] font-bold text-slate-500 tabular-nums">
                    {isToday ? 'اليوم · ' : ''}{daySlots.length} حصص
                  </span>
                </div>

                <div className="p-3.5 space-y-2.5">
                  {daySlots.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">لا توجد حصص مجدولة</p>
                  ) : (
                    daySlots.map(slot => {
                      const canDelete = slot.teacher_id === currentUserId || currentRole === 'admin';
                      return (
                        <div
                          key={slot.id}
                          className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-black text-slate-900 text-xs truncate">{slot.subject}</h4>
                              <p className="text-[11px] text-slate-500 truncate">{slot.class_title}</p>
                            </div>
                            {canDelete && (
                              <button
                                type="button"
                                onClick={() => void api.deleteTimetableSlot(slot.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer shrink-0 no-print"
                                title="حذف من الجدول"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-slate-600 pt-1">
                            <span className="inline-flex items-center gap-1 text-[#1677c7] tabular-nums">
                              <Clock className="w-3 h-3" />
                              {slot.start_time} – {slot.end_time}
                            </span>
                            {slot.room && (
                              <span className="inline-flex items-center gap-1 text-slate-500 truncate max-w-[140px]">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="truncate">{slot.room}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
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
