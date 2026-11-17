import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, Flame, Loader2, RefreshCw, ShieldCheck, Star, BookOpen, X } from 'lucide-react';
import { GuardianReport } from '../../types';
import { fetchGuardianReportByCode } from '../../lib/api';

interface GuardianPortalModalProps {
  initialCode?: string;
  onClose: () => void;
}

export const GuardianPortalModal: React.FC<GuardianPortalModalProps> = ({ initialCode = '', onClose }) => {
  const [code, setCode] = useState(initialCode.toUpperCase());
  const [loading, setLoading] = useState(Boolean(initialCode));
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<GuardianReport | null>(null);

  const lookup = async (targetCode: string) => {
    const clean = targetCode.trim().toUpperCase();
    if (clean.length < 8) {
      setError('أدخل رمز متابعة صحيحاً (8 أحرف على الأقل، مثال: GRD7X9K2M4).');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchGuardianReportByCode(clean);
      if (!res) {
        setReport(null);
        setError('لم يتم العثور على تقرير مطابق لهذا الرمز. تأكد من الرمز مع الطالب.');
      } else {
        setReport(res);
      }
    } catch {
      setError('تعذّر تحميل التقرير حالياً، حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode.trim().length >= 8) {
      void lookup(initialCode);
    }
  }, [initialCode]);

  return (
    <div
      className="fixed inset-0 z-[75] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 font-['Cairo',sans-serif]"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 bg-[#0f233a] text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base">بوابة ولي الأمر للمتابعة الأكاديمية</h3>
              <p className="text-[11px] text-slate-300">عرض آمن للقراءة فقط لدرجات وتقدّم الطالب دون بيانات حساسة</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-white/70 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          <form
            onSubmit={e => {
              e.preventDefault();
              void lookup(code);
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="text"
              dir="ltr"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="مثال: GRD8X9K2M4"
              maxLength={16}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-black text-sm tracking-widest text-center uppercase outline-none focus:border-[#1677c7]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span>عرض التقرير</span>
            </button>
          </form>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-bold">
              {error}
            </div>
          )}

          {report && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#1677c7] block">بطاقة متابعة الطالب</span>
                  <h4 className="text-lg font-black text-slate-900">{report.student_name}</h4>
                  <span className="text-[11px] text-slate-500">
                    آخر تحديث: {new Date(report.updated_at).toLocaleString('ar')}
                  </span>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-white border border-sky-200 text-center">
                  <span className="text-[10px] font-bold text-slate-500 block">المعدل العام</span>
                  <strong className="text-xl font-black text-[#1677c7] tabular-nums">{report.avg_quiz_score}%</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 tabular-nums">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                  <span className="text-[10px] font-bold text-slate-500 block">الاختبارات المنجزة</span>
                  <strong className="text-base font-black text-slate-900 block">{report.completed_quizzes}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
                  <Award className="w-4 h-4 text-[#1677c7] mx-auto" />
                  <span className="text-[10px] font-bold text-slate-500 block">الواجبات المسلّمة</span>
                  <strong className="text-base font-black text-slate-900 block">{report.submitted_assignments}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
                  <Star className="w-4 h-4 text-amber-500 mx-auto" />
                  <span className="text-[10px] font-bold text-slate-500 block">نقاط التفاعل</span>
                  <strong className="text-base font-black text-slate-900 block">{report.points}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
                  <Flame className="w-4 h-4 text-orange-500 mx-auto" />
                  <span className="text-[10px] font-bold text-slate-500 block">سلسلة المواظبة</span>
                  <strong className="text-base font-black text-slate-900 block">{report.streak_days} يوم</strong>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-black text-slate-800 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#1677c7]" />
                    <span>سجل أحدث الدرجات والأنشطة ({report.classes_count} صف مسجّل)</span>
                  </h5>
                </div>

                {report.recent_grades.length === 0 ? (
                  <p className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-slate-500">
                    لم تُسجّل اختبارات أو واجبات مقيّمة بعد.
                  </p>
                ) : (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-[11px] text-start">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <tr>
                          <th className="py-2.5 px-3 text-start">النشاط</th>
                          <th className="py-2.5 px-3 text-start">النوع</th>
                          <th className="py-2.5 px-3 text-start">الدرجة</th>
                          <th className="py-2.5 px-3 text-start">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {report.recent_grades.map((g, i) => (
                          <tr key={i}>
                            <td className="py-2 px-3 font-bold text-slate-900">{g.title}</td>
                            <td className="py-2 px-3 text-slate-600">{g.kind}</td>
                            <td className="py-2 px-3 font-black tabular-nums text-[#1677c7]">
                              {g.score} / {g.max_score}
                            </td>
                            <td className="py-2 px-3 text-slate-700">{g.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
