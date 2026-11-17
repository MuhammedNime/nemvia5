import React, { useEffect, useMemo, useState } from 'react';
import { Award, CheckCircle2, ClipboardList, Download, FileCheck, Filter, Printer } from 'lucide-react';
import { AppRole, Assignment, ClassItem, ClassMemberInfo, Quiz, Submission } from '../../types';
import { useAppSettings } from '../../lib/settings';
import { saveOrShareBlobFile } from '../../lib/native';

interface GradebookViewProps {
  currentRole: AppRole;
  currentUserId: string;
  currentUserName: string;
  classes: ClassItem[];
  classMembers: ClassMemberInfo[];
  quizzes: Quiz[];
  assignments: Assignment[];
  submissions: Submission[];
  onNavigate: (section: string) => void;
}

interface GradeRow {
  id: string;
  studentName: string;
  className: string;
  itemType: 'اختبار' | 'واجب';
  title: string;
  score: number | null;
  maxScore: number;
  status: 'graded' | 'submitted' | 'pending';
  feedback?: string;
}

export const GradebookView: React.FC<GradebookViewProps> = ({
  currentRole,
  currentUserId,
  currentUserName,
  classes,
  quizzes,
  assignments,
  submissions,
  onNavigate,
}) => {
  const { settings } = useAppSettings();
  const isTeacherOrAdmin = currentRole === 'teacher' || currentRole === 'admin';
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'اختبار' | 'واجب'>('all');

  const classMap = useMemo(() => new Map(classes.map(c => [c.id, c.title])), [classes]);

  const rows = useMemo<GradeRow[]>(() => {
    const out: GradeRow[] = [];

    if (isTeacherOrAdmin) {
      quizzes.forEach(q => {
        if (selectedClass !== 'all' && q.class_id !== selectedClass) return;
        const max = q.questions.reduce((s, qq) => s + qq.points, 0) || 1;
        (q.attempts || []).forEach(att => {
          out.push({
            id: `qz-${q.id}-${att.id}`,
            studentName: att.student_name,
            className: q.class_title || classMap.get(q.class_id) || 'صف',
            itemType: 'اختبار',
            title: q.title,
            score: att.score,
            maxScore: att.totalPoints || max,
            status: att.needsManualGrading ? 'submitted' : 'graded',
            feedback: att.teacherFeedback,
          });
        });
      });

      assignments.forEach(a => {
        if (selectedClass !== 'all' && a.class_id !== selectedClass) return;
        const subs = submissions.filter(s => s.assignment_id === a.id);
        subs.forEach(sub => {
          out.push({
            id: `asg-${a.id}-${sub.id}`,
            studentName: sub.student_name,
            className: a.class_title || classMap.get(a.class_id) || 'صف',
            itemType: 'واجب',
            title: a.title,
            score: sub.grade ?? null,
            maxScore: a.total_points,
            status: sub.grade !== undefined ? 'graded' : 'submitted',
            feedback: sub.teacher_feedback,
          });
        });
      });
    } else {
      quizzes.forEach(q => {
        if (selectedClass !== 'all' && q.class_id !== selectedClass) return;
        const max = q.questions.reduce((s, qq) => s + qq.points, 0) || 1;
        out.push({
          id: `st-qz-${q.id}`,
          studentName: currentUserName,
          className: q.class_title || classMap.get(q.class_id) || 'صف',
          itemType: 'اختبار',
          title: q.title,
          score: q.attempted ? (q.myScore ?? 0) : null,
          maxScore: max,
          status: !q.attempted ? 'pending' : q.needsManualGrading ? 'submitted' : 'graded',
          feedback: q.teacherFeedback,
        });
      });

      assignments.forEach(a => {
        if (selectedClass !== 'all' && a.class_id !== selectedClass) return;
        const sub = submissions.find(s => s.assignment_id === a.id && s.student_id === currentUserId);
        out.push({
          id: `st-asg-${a.id}`,
          studentName: currentUserName,
          className: a.class_title || classMap.get(a.class_id) || 'صف',
          itemType: 'واجب',
          title: a.title,
          score: sub?.grade ?? null,
          maxScore: a.total_points,
          status: !sub ? 'pending' : sub.grade !== undefined ? 'graded' : 'submitted',
          feedback: sub?.teacher_feedback,
        });
      });
    }

    return out.filter(r => (typeFilter === 'all' ? true : r.itemType === typeFilter));
  }, [isTeacherOrAdmin, quizzes, assignments, submissions, selectedClass, typeFilter, currentUserId, currentUserName, classMap]);

  const gradedRows = rows.filter(r => r.score !== null && r.maxScore > 0);
  const avgPercent = gradedRows.length > 0
    ? Math.round(
        gradedRows.reduce((sum, r) => sum + ((r.score ?? 0) / r.maxScore) * 100, 0) / gradedRows.length,
      )
    : 0;
  const pendingReviewCount = rows.filter(r => r.status === 'submitted').length;

  const exportCsv = () => {
    const header = ['الطالب', 'الصف', 'النوع', 'العنوان', 'الدرجة', 'الدرجة العظمى', 'النسبة %', 'الحالة', 'ملاحظة المعلم'];
    const escapeCell = (v: string | number) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [
      header.map(escapeCell).join(','),
      ...rows.map(r => {
        const pct = r.score !== null && r.maxScore > 0 ? Math.round((r.score / r.maxScore) * 100) : '-';
        const st = r.status === 'graded' ? 'مرصود' : r.status === 'submitted' ? 'بانتظار التصحيح' : 'لم يُسلّم';
        return [
          r.studentName,
          r.className,
          r.itemType,
          r.title,
          r.score ?? '-',
          r.maxScore,
          pct,
          st,
          r.feedback || '',
        ].map(escapeCell).join(',');
      }),
    ];
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    void saveOrShareBlobFile(blob, `nemvia-grades-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  useEffect(() => {
    const cleanup = () => document.body.classList.remove('nemvia-printing-gradebook');
    window.addEventListener('afterprint', cleanup);
    return () => {
      cleanup();
      window.removeEventListener('afterprint', cleanup);
    };
  }, []);

  const handlePrintPdf = () => {
    document.body.classList.add('nemvia-printing-gradebook');
    window.print();
    window.setTimeout(() => document.body.classList.remove('nemvia-printing-gradebook'), 800);
  };

  const heading = settings.lang === 'en'
    ? 'Comprehensive Gradebook'
    : settings.lang === 'fr'
      ? 'Relevé de notes'
      : 'سجل الدرجات الشامل';

  const selectedClassName = selectedClass === 'all' ? 'جميع الصفوف' : (classMap.get(selectedClass) || 'صف محدد');

  return (
    <div id="nemvia-printable-gradebook" className="space-y-6 animate-in fade-in">
      {/* Official RTL Header shown in PDF print mode */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-4 space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">منصة NEMVIA التعليمية — كشف الدرجات والتقويم</h2>
            <p className="text-xs font-bold text-slate-700">
              {isTeacherOrAdmin ? `إعداد المعلم/المشرف: ${currentUserName}` : `الطالب/ـة: ${currentUserName}`} · الصف: {selectedClassName}
            </p>
          </div>
          <div className="text-left text-xs text-slate-600">
            <p>تاريخ الطباعة: {new Date().toLocaleDateString('ar')}</p>
            <p className="font-bold">المعدل العام: {avgPercent}%</p>
          </div>
        </div>
      </div>

      <div className="no-print bg-white rounded-3xl border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1677c7] text-white flex items-center justify-center shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">{heading}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isTeacherOrAdmin
                ? 'استعراض جميع درجات الاختبارات والواجبات للطلاب وتصدير كشف CSV أو طباعة PDF.'
                : 'متابعة درجاتك في كل الاختبارات والواجبات وملاحظات المعلم وتصدير شهادة درجات.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrintPdf}
            disabled={rows.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-50 text-white text-xs font-bold cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{settings.lang === 'en' ? 'Print / PDF' : 'تصدير / طباعة PDF'}</span>
          </button>

          <button
            type="button"
            onClick={exportCsv}
            disabled={rows.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{settings.lang === 'en' ? 'Export CSV / Excel' : 'تصدير CSV'}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 tabular-nums">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
          <span className="text-xs font-bold text-slate-500 block">إجمالي السجلات</span>
          <span className="text-2xl font-black text-slate-900 block">{rows.length}</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
          <span className="text-xs font-bold text-slate-500 block">المعدل العام</span>
          <span className="text-2xl font-black text-[#1677c7] block">{avgPercent}%</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
          <span className="text-xs font-bold text-slate-500 block">مرصود الدرجة</span>
          <span className="text-2xl font-black text-emerald-600 block">{gradedRows.length}</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1">
          <span className="text-xs font-bold text-slate-500 block">بانتظار المراجعة</span>
          <span className="text-2xl font-black text-amber-600 block">{pendingReviewCount}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold outline-none"
          >
            <option value="all">كل الصفوف</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl font-bold">
            {([
              ['all', 'الكل'],
              ['اختبار', 'الاختبارات'],
              ['واجب', 'الواجبات'],
            ] as const).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setTypeFilter(val)}
                className={`px-3 py-1 rounded-lg cursor-pointer ${
                  typeFilter === val ? 'bg-white text-[#1677c7] shadow-xs' : 'text-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-10 text-center space-y-2 text-xs text-slate-500">
            <p className="font-bold text-slate-700">لا توجد درجات أو محاولات مسجلة ضمن هذا التصنيف بعد.</p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('courses')}
                className="px-4 py-2 rounded-xl bg-[#1677c7] text-white font-bold cursor-pointer"
              >
                فتح الاختبارات
              </button>
              <button
                type="button"
                onClick={() => onNavigate('assignments')}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
              >
                فتح الواجبات
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  {isTeacherOrAdmin && <th className="py-3 px-4 text-start">الطالب</th>}
                  <th className="py-3 px-4 text-start">العنوان</th>
                  <th className="py-3 px-4 text-start">النوع</th>
                  <th className="py-3 px-4 text-start">الصف</th>
                  <th className="py-3 px-4 text-start">الدرجة</th>
                  <th className="py-3 px-4 text-start">الحالة</th>
                  <th className="py-3 px-4 text-start">ملاحظات المعلم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map(r => {
                  const pct = r.score !== null && r.maxScore > 0 ? Math.round((r.score / r.maxScore) * 100) : null;
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/70">
                      {isTeacherOrAdmin && (
                        <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">{r.studentName}</td>
                      )}
                      <td className="py-3 px-4 font-bold text-slate-900">{r.title}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-bold ${
                          r.itemType === 'اختبار' ? 'bg-sky-50 text-[#1677c7]' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {r.itemType === 'اختبار' ? <Award className="w-3 h-3" /> : <FileCheck className="w-3 h-3" />}
                          {r.itemType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{r.className}</td>
                      <td className="py-3 px-4 font-black tabular-nums">
                        {r.score !== null ? (
                          <span className={pct !== null && pct >= 60 ? 'text-emerald-700' : 'text-rose-600'}>
                            {r.score} / {r.maxScore} ({pct}%)
                          </span>
                        ) : (
                          <span className="text-slate-400">— / {r.maxScore}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {r.status === 'graded' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            <CheckCircle2 className="w-3 h-3" /> مرصود
                          </span>
                        ) : r.status === 'submitted' ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                            بانتظار التصحيح
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                            لم يُسلّم بعد
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {r.feedback || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
