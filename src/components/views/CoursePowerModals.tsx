import React, { useMemo, useState, useEffect } from 'react';
import {
  X,
  Flame,
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
  Printer,
  Library,
  Trash2,
  Plus,
  Search,
  BarChart3,
  AlertTriangle,
  Users,
  TrendingUp,
  Award,
  CheckSquare,
  Square,
  RefreshCw,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { downloadQuizAsWordDoc } from '../../lib/wordExport';
import {
  Assignment,
  ClassItem,
  Quiz,
  QuizAnswerValue,
  QuizQuestion,
  QuizQuestionType,
  Submission,
} from '../../types';
import { buildQuizPerformanceReport } from '../../lib/api';
import {
  ClassInsightsResult,
  generateClassInsightsAI,
  generateMistakeDrillAI,
} from '../../lib/ai';
import {
  BankQuestionItem,
  loadQuestionBank,
  removeQuestionFromBank,
  saveQuestionsToBank,
} from '../../lib/questionBank';

const TYPE_LABELS: Record<QuizQuestionType, string> = {
  mcq: 'اختيار من متعدد',
  true_false: 'صح وخطأ',
  multi_select: 'تحديد متعدد',
  short_answer: 'إجابة قصيرة',
  fill_blank: 'أكمل الفراغ',
  essay: 'سؤال مقالي',
};

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

function checkChallengeAnswer(q: QuizQuestion, val: QuizAnswerValue | undefined): boolean {
  const t = q.type || 'mcq';
  if (t === 'mcq' || t === 'true_false') {
    return typeof val === 'number' && val === q.correctOptionIndex;
  }
  if (t === 'multi_select') {
    const picked = Array.isArray(val) ? [...val].sort((a, b) => a - b) : [];
    const expected = [...(q.correctOptionIndices || [])].sort((a, b) => a - b);
    return expected.length > 0 && picked.length === expected.length && picked.every((v, i) => v === expected[i]);
  }
  if (t === 'short_answer' || t === 'fill_blank') {
    if (typeof val !== 'string' || !val.trim()) return false;
    const ans = q.caseSensitive ? val.trim() : norm(val);
    return (q.acceptedAnswers || []).some(acc => (q.caseSensitive ? acc.trim() : norm(acc)) === ans);
  }
  return typeof val === 'string' && val.trim().length > 8;
}

/* ============================================================================
   1. MISTAKE CHALLENGE & DRILL MODAL (وضع التحدي التفاعلي ومراجعة الأخطاء)
   ============================================================================ */
export const MistakeChallengeModal: React.FC<{
  title: string;
  mistakes: QuizQuestion[];
  onClose: () => void;
  onRewardPoints: (pts: number) => void;
}> = ({ title, mistakes, onClose, onRewardPoints }) => {
  const [queue, setQueue] = useState<QuizQuestion[]>(mistakes);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizAnswerValue>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [correctMap, setCorrectMap] = useState<Record<string, boolean>>({});
  const [earnedXP, setEarnedXP] = useState(0);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiGeneratedCount, setAiGeneratedCount] = useState(0);

  const cur = queue[idx];
  const curVal = cur ? answers[cur.id] : undefined;
  const isChecked = cur ? Boolean(checked[cur.id]) : false;
  const isRight = cur ? Boolean(correctMap[cur.id]) : false;
  const masteredCount = Object.values(correctMap).filter(Boolean).length;

  const setVal = (qId: string, val: QuizAnswerValue) => {
    if (checked[qId]) return;
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const toggleMulti = (qId: string, optIdx: number) => {
    if (checked[qId]) return;
    const prev = Array.isArray(answers[qId]) ? (answers[qId] as number[]) : [];
    const next = prev.includes(optIdx) ? prev.filter(x => x !== optIdx) : [...prev, optIdx];
    setVal(qId, next);
  };

  const handleCheck = () => {
    if (!cur || isChecked) return;
    const ok = checkChallengeAnswer(cur, curVal);
    setChecked(prev => ({ ...prev, [cur.id]: true }));
    setCorrectMap(prev => ({ ...prev, [cur.id]: ok }));
    if (ok) {
      setEarnedXP(x => x + 15);
      onRewardPoints(15);
    }
  };

  const handleGenerateAiDrill = async () => {
    if (aiBusy) return;
    setAiBusy(true);
    setAiError(null);
    try {
      const drillQs = await generateMistakeDrillAI(
        title,
        mistakes.slice(0, 5).map(m => ({
          question: m.question,
          topic: m.topic,
          explanation: m.explanation,
        })),
      );
      if (drillQs.length === 0) {
        setAiError('تعذّر توليد أسئلة إضافية الآن. حاول مرة أخرى.');
        return;
      }
      const nextStart = queue.length;
      setQueue(prev => [...prev, ...drillQs]);
      setAiGeneratedCount(c => c + drillQs.length);
      setIdx(nextStart);
    } catch (err: any) {
      setAiError(err?.message || 'تعذّر توليد جولة التحدي بالذكاء الاصطناعي.');
    } finally {
      setAiBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200" onClick={e => e.stopPropagation()}>
        <div className="p-5 bg-white border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-600">
              <Flame className="w-4 h-4" />
              <span>وضع التحدي وتصحيح الأخطاء</span>
            </div>
            <h3 className="font-black text-slate-900 text-base">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-black text-xs tabular-nums">
              +{earnedXP} XP مكتسبة
            </span>
            <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Progress strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              {queue.map((item, i) => {
                const done = checked[item.id];
                const ok = correctMap[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIdx(i)}
                    className={`w-7 h-7 rounded-lg font-black text-[11px] cursor-pointer transition-all ${
                      i === idx
                        ? 'bg-[#1677c7] text-white ring-2 ring-[#1677c7]/30'
                        : done
                          ? ok
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                            : 'bg-rose-100 text-rose-700 border border-rose-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <span className="font-bold text-slate-500 tabular-nums">
              أُتقن {masteredCount} من {queue.length}
            </span>
          </div>

          {cur && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>
                  السؤال {idx + 1} من {queue.length} · {TYPE_LABELS[cur.type || 'mcq']}
                </span>
                {cur.topic && (
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[#1677c7]">
                    {cur.topic}
                  </span>
                )}
              </div>

              <h4 className="font-black text-slate-900 text-base leading-relaxed whitespace-pre-line">
                {cur.question}
              </h4>

              {(cur.type === 'mcq' || cur.type === 'true_false' || !cur.type) && (
                <div className={cur.type === 'true_false' ? 'grid grid-cols-2 gap-2.5' : 'space-y-2'}>
                  {(cur.options.length ? cur.options : ['صح', 'خطأ']).map((opt, oIdx) => {
                    const selected = curVal === oIdx;
                    const showCorrect = isChecked && oIdx === cur.correctOptionIndex;
                    const showWrong = isChecked && selected && oIdx !== cur.correctOptionIndex;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => setVal(cur.id, oIdx)}
                        className={`w-full p-3.5 rounded-xl border text-right text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          showCorrect
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                            : showWrong
                              ? 'bg-rose-50 border-rose-500 text-rose-800'
                              : selected
                                ? 'bg-sky-50 border-[#1677c7] text-slate-900'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {cur.type === 'multi_select' && (
                <div className="space-y-2">
                  {cur.options.map((opt, oIdx) => {
                    const list = Array.isArray(curVal) ? curVal : [];
                    const selected = list.includes(oIdx);
                    const isExpected = (cur.correctOptionIndices || []).includes(oIdx);
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => toggleMulti(cur.id, oIdx)}
                        className={`w-full p-3.5 rounded-xl border text-right text-xs sm:text-sm font-bold flex items-center gap-2.5 cursor-pointer ${
                          isChecked && isExpected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                            : selected
                              ? 'bg-sky-50 border-[#1677c7] text-slate-900'
                              : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {selected ? <CheckSquare className="w-4 h-4 text-[#1677c7]" /> : <Square className="w-4 h-4 text-slate-300" />}
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {(cur.type === 'short_answer' || cur.type === 'fill_blank') && (
                <input
                  type="text"
                  dir="auto"
                  disabled={isChecked}
                  value={typeof curVal === 'string' ? curVal : ''}
                  onChange={e => setVal(cur.id, e.target.value)}
                  placeholder="اكتب الإجابة الصحيحة هنا..."
                  className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-sm font-bold outline-none focus:border-[#1677c7]"
                />
              )}

              {cur.type === 'essay' && (
                <textarea
                  rows={3}
                  dir="auto"
                  disabled={isChecked}
                  value={typeof curVal === 'string' ? curVal : ''}
                  onChange={e => setVal(cur.id, e.target.value)}
                  placeholder="أعد صياغة الإجابة النموذجية للتمرّن..."
                  className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-xs leading-relaxed outline-none focus:border-[#1677c7]"
                />
              )}

              {!isChecked ? (
                <button
                  type="button"
                  disabled={curVal === undefined || curVal === '' || (Array.isArray(curVal) && curVal.length === 0)}
                  onClick={handleCheck}
                  className="w-full py-2.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-40 text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  تحقق من الإجابة الآن
                </button>
              ) : (
                <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                  isRight ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <div className="font-black flex items-center gap-1.5">
                    {isRight ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                    <span>{isRight ? 'ممتاز! إجابة صحيحة (+15 XP)' : 'تحتاج لمراجعة هذه النقطة'}</span>
                  </div>
                  {(cur.type === 'short_answer' || cur.type === 'fill_blank') && cur.acceptedAnswers?.length ? (
                    <p><strong>الإجابة المقبولة:</strong> {cur.acceptedAnswers.join(' / ')}</p>
                  ) : null}
                  {cur.type === 'essay' && cur.modelAnswer && (
                    <p><strong>الإجابة النموذجية:</strong> {cur.modelAnswer}</p>
                  )}
                  {cur.explanation && (
                    <p className="leading-relaxed"><strong>التفسير:</strong> {cur.explanation}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* AI Bonus Drill Section */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5 text-xs">
              <span className="font-black text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#1677c7]" />
                <span>تحدي إضافي بالذكاء الاصطناعي {aiGeneratedCount > 0 ? `(أُضيف ${aiGeneratedCount})` : ''}</span>
              </span>
              <p className="text-slate-600 text-[11px]">
                ولّد أسئلة جديدة مشابهة للأخطاء التي واجهتك للتأكد من إتقانها تماماً.
              </p>
              {aiError && <p className="text-rose-600 font-bold text-[11px]">{aiError}</p>}
            </div>
            <button
              type="button"
              disabled={aiBusy}
              onClick={handleGenerateAiDrill}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              {aiBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{aiBusy ? 'جاري التوليد...' : 'توليد جولة تدريب (AI)'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={idx === 0}
              onClick={() => setIdx(i => Math.max(0, i - 1))}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              السابق
            </button>
            <button
              type="button"
              disabled={idx >= queue.length - 1}
              onClick={() => setIdx(i => Math.min(queue.length - 1, i + 1))}
              className="px-4 py-2 bg-[#1677c7] text-white rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              التالي
            </button>
          </div>
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer">
            إنهاء التحدي
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   2. PRINTABLE PDF EXAM MODAL (تصدير وطباعة الاختبار PDF)
   ============================================================================ */
export const PrintableExamModal: React.FC<{
  title: string;
  classTitle?: string;
  defaultMinistryName?: string;
  defaultSchoolName?: string;
  timeLimitMinutes?: number;
  questions: QuizQuestion[];
  onClose: () => void;
}> = ({
  title,
  classTitle,
  defaultMinistryName,
  defaultSchoolName,
  timeLimitMinutes = 20,
  questions,
  onClose,
}) => {
  const [withAnswers, setWithAnswers] = useState(false);
  const [showHeaderEditor, setShowHeaderEditor] = useState(false);
  const [ministryName, setMinistryName] = useState(defaultMinistryName || 'وزارة التربية والتعليم / المجمع التعليمي');
  const [schoolName, setSchoolName] = useState(defaultSchoolName || 'منصة NEMVIA التعليمية');
  const [instructions, setInstructions] = useState('اقرأ كل سؤال بعناية ثم أجب في المكان المخصص.');

  useEffect(() => {
    const cleanup = () => document.body.classList.remove('nemvia-printing-exam');
    window.addEventListener('afterprint', cleanup);
    return () => {
      cleanup();
      window.removeEventListener('afterprint', cleanup);
    };
  }, []);

  const handlePrint = () => {
    document.body.classList.add('nemvia-printing-exam');
    window.print();
    setTimeout(() => document.body.classList.remove('nemvia-printing-exam'), 800);
  };

  const handleDownloadWord = () => {
    downloadQuizAsWordDoc({
      title,
      classTitle,
      ministryName,
      schoolName,
      instructions,
      timeLimitMinutes,
      questions,
      withAnswers,
    });
  };

  const totalPoints = questions.reduce((s, q) => s + (q.points || 1), 0);
  const letters = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl" onClick={onClose}>
      <div
        id="nemvia-printable-exam"
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="no-print p-4 sm:p-5 bg-white border-b border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-slate-900 text-base">معاينة وتصدير ورقة الاختبار (Word / PDF)</h3>
              <p className="text-[11px] text-slate-500">اختر نسخة الطالب أو نموذج المعلم المحلول ثم صدّر كملف Word أو اطبع PDF</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setWithAnswers(false)}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer ${!withAnswers ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                >
                  نسخة الطالب
                </button>
                <button
                  type="button"
                  onClick={() => setWithAnswers(true)}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer ${withAnswers ? 'bg-white text-[#1677c7] shadow-xs' : 'text-slate-600'}`}
                >
                  نموذج المعلم المحلول
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowHeaderEditor(v => !v)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                title="تخصيص ترويسة الوزارة والمدرسة والتعليمات"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>الترويسة</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadWord}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>تصدير Word (.doc)</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة / PDF</span>
              </button>
              <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showHeaderEditor && (
            <div className="grid sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">اسم الوزارة / المجمع:</label>
                <input
                  value={ministryName}
                  onChange={e => setMinistryName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">اسم المدرسة / المعهد:</label>
                <input
                  value={schoolName}
                  onChange={e => setSchoolName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">تعليمات الورقة:</label>
                <input
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-5 bg-white text-slate-900">
          {/* Official 3-Column Ministry/School Paper Header */}
          <div className="border-2 border-slate-900 grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-300">
            <div className="p-3 space-y-1 text-xs">
              <p className="font-black text-slate-900">{ministryName}</p>
              <p className="font-bold text-[#1677c7]">{schoolName}</p>
              {classTitle && <p className="text-slate-600 font-bold">المادة / الصف: {classTitle}</p>}
            </div>
            <div className="p-3 bg-slate-50 flex flex-col items-center justify-center text-center">
              <h2 className="text-base font-black text-slate-900">{title}</h2>
              <span className="text-[11px] font-bold text-slate-500 mt-0.5">
                {withAnswers ? 'نموذج الإجابة المعتمد للمعلم' : 'ورقة أسئلة الطالب'}
              </span>
            </div>
            <div className="p-3 text-xs space-y-1">
              <p className="font-bold">الزمن المحدد: <span className="tabular-nums">{timeLimitMinutes}</span> دقيقة</p>
              <p className="font-bold">الدرجة الكاملة: <span className="tabular-nums">{totalPoints}</span> درجة</p>
              <p className="text-slate-500">التاريخ: {new Date().toLocaleDateString('ar')}</p>
            </div>
          </div>

          {!withAnswers && (
            <div className="grid sm:grid-cols-3 gap-3 p-3 border border-slate-300 bg-slate-50/70 rounded-xl text-xs font-bold">
              <div>اسم الطالب/ـة: .................................</div>
              <div>الشعبة / الرقم: ........................</div>
              <div>الدرجة المستحقة: ...... / {totalPoints}</div>
            </div>
          )}

          {instructions && (
            <div className="p-2.5 bg-sky-50 border-r-4 border-[#1677c7] text-xs font-bold text-slate-800">
              تعليمات الاختبار: <span className="font-normal">{instructions}</span>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-5">
            {questions.map((q, i) => {
              const qType = q.type || 'mcq';
              return (
                <div key={q.id || i} className="space-y-2 pb-4 border-b border-slate-200 last:border-none">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-bold text-sm leading-relaxed whitespace-pre-line">
                      {i + 1}. {q.question}
                    </p>
                    <span className="text-[11px] font-bold text-slate-500 shrink-0 tabular-nums">
                      ({q.points} {q.points === 1 ? 'درجة' : 'درجات'})
                    </span>
                  </div>

                  {(qType === 'mcq' || qType === 'multi_select' || qType === 'true_false') && (
                    <div className="grid sm:grid-cols-2 gap-2 pr-4 text-xs">
                      {(qType === 'true_false' ? ['صح', 'خطأ'] : q.options).map((opt, j) => {
                        const isAns =
                          withAnswers &&
                          (qType === 'multi_select'
                            ? (q.correctOptionIndices || []).includes(j)
                            : q.correctOptionIndex === j);
                        return (
                          <div
                            key={j}
                            className={`p-2 rounded-lg border ${
                              isAns ? 'border-emerald-500 bg-emerald-50 font-black text-emerald-900' : 'border-slate-200 text-slate-800'
                            }`}
                          >
                            {qType === 'true_false' ? '○' : `${letters[j] || j + 1})`} {opt} {isAns ? '✓' : ''}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {(qType === 'short_answer' || qType === 'fill_blank') && (
                    <div className="pr-4 text-xs">
                      {withAnswers ? (
                        <p className="text-emerald-800 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                          الإجابة المقبولة: {(q.acceptedAnswers || []).join(' / ') || '—'}
                        </p>
                      ) : (
                        <div className="h-8 border-b border-dashed border-slate-400" />
                      )}
                    </div>
                  )}

                  {qType === 'essay' && (
                    <div className="pr-4 text-xs">
                      {withAnswers ? (
                        <p className="text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 whitespace-pre-line">
                          <strong>الإجابة النموذجية:</strong> {q.modelAnswer || 'تُقدّر حسب إجابة الطالب'}
                        </p>
                      ) : (
                        <div className="space-y-3 pt-2">
                          <div className="h-5 border-b border-dashed border-slate-300" />
                          <div className="h-5 border-b border-dashed border-slate-300" />
                          <div className="h-5 border-b border-dashed border-slate-300" />
                        </div>
                      )}
                    </div>
                  )}

                  {withAnswers && q.explanation && (
                    <p className="pr-4 text-[11px] text-slate-600">
                      <strong>التفسير:</strong> {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   3. REUSABLE QUESTION BANK MODAL (بنك الأسئلة القابل لإعادة الاستخدام)
   ============================================================================ */
export const QuestionBankModal: React.FC<{
  userId: string;
  quizzes: Quiz[];
  onClose: () => void;
  onCreateQuizFromBank: (questions: QuizQuestion[], suggestedTitle: string) => void;
  onPrintQuestions: (title: string, questions: QuizQuestion[]) => void;
}> = ({ userId, quizzes, onClose, onCreateQuizFromBank, onPrintQuestions }) => {
  const [items, setItems] = useState<BankQuestionItem[]>(() => loadQuestionBank(userId));
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const subjects = useMemo(() => {
    const s = new Set(items.map(i => i.subject).filter(Boolean));
    return ['all', ...Array.from(s)];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter(it => {
      if (subjectFilter !== 'all' && it.subject !== subjectFilter) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        return it.question.question.toLowerCase().includes(q) || it.subject.toLowerCase().includes(q);
      }
      return true;
    });
  }, [items, subjectFilter, query]);

  const handleSyncFromQuizzes = () => {
    let next = items;
    let added = 0;
    const before = items.length;
    quizzes.forEach(qz => {
      if (qz.questions.length > 0) {
        next = saveQuestionsToBank(userId, qz.class_title || qz.title, qz.questions);
      }
    });
    added = next.length - before;
    setItems(next);
    setSyncNotice(added > 0 ? `تم استيراد ${added} سؤالاً جديداً من اختباراتك الحالية.` : 'كل أسئلة اختباراتك محفوظة مسبقاً في البنك.');
  };

  const toggle = (id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const handleDelete = (id: string) => {
    setItems(removeQuestionFromBank(userId, id));
    setSelectedIds(prev => prev.filter(x => x !== id));
  };

  const selectedQuestions = items.filter(i => selectedIds.includes(i.id)).map(i => i.question);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200" onClick={e => e.stopPropagation()}>
        <div className="p-5 bg-white border-b border-slate-200 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-[#1677c7]">
              <Library className="w-4 h-4" />
              <span>بنك الأسئلة القابل لإعادة الاستخدام</span>
            </div>
            <h3 className="font-black text-slate-900 text-base">مكتبة الأسئلة المصنفة ({items.length} سؤال)</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="ابحث في نص السؤال أو المادة..."
                  className="w-full pr-8 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
                />
              </div>
              <select
                value={subjectFilter}
                onChange={e => setSubjectFilter(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
              >
                {subjects.map(s => (
                  <option key={s} value={s}>{s === 'all' ? 'كل المواد والمواضيع' : s}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleSyncFromQuizzes}
              className="px-3 py-2 bg-sky-50 hover:bg-sky-100 text-[#1677c7] border border-sky-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>استيراد من الاختبارات الحالية</span>
            </button>
          </div>

          {syncNotice && (
            <p className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
              {syncNotice}
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="p-10 text-center border border-dashed border-slate-300 rounded-2xl text-xs text-slate-500 space-y-2">
              <p className="font-bold text-slate-700">لا توجد أسئلة مطابقة في البنك حالياً.</p>
              <p>اضغط على «استيراد من الاختبارات الحالية» أعلاه أو احفظ أسئلة جديدة من منشئ الاختبار.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(item => {
                const picked = selectedIds.includes(item.id);
                const qType = item.question.type || 'mcq';
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border transition-colors flex items-start gap-3 text-xs ${
                      picked ? 'bg-sky-50 border-[#1677c7]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={picked}
                      onChange={() => toggle(item.id)}
                      className="mt-1 accent-[#1677c7] cursor-pointer"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="font-bold text-slate-900 leading-relaxed">{item.question.question}</p>
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                        <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700">
                          {item.subject}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[#1677c7] font-bold">
                          {TYPE_LABELS[qType]}
                        </span>
                        <span>{item.question.points} نقطة</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer shrink-0"
                      title="حذف من البنك"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-600">
            تم تحديد {selectedQuestions.length} سؤال
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={selectedQuestions.length === 0}
              onClick={() => onPrintQuestions('اختبار مختار من بنك الأسئلة', selectedQuestions)}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-40 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة المحدد PDF</span>
            </button>
            <button
              type="button"
              disabled={selectedQuestions.length === 0}
              onClick={() => onCreateQuizFromBank(selectedQuestions, subjectFilter !== 'all' ? `اختبار ${subjectFilter}` : 'اختبار من بنك الأسئلة')}
              className="px-4 py-2 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إنشاء اختبار من المحدد</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   4. TEACHER ANALYTICS DASHBOARD (لوحة تحليلات متقدمة للمعلم)
   ============================================================================ */
export const TeacherAnalyticsPanel: React.FC<{
  quizzes: Quiz[];
  classes: ClassItem[];
  assignments: Assignment[];
  submissions: Submission[];
  currentUserId: string;
}> = ({ quizzes, classes, assignments, submissions, currentUserId }) => {
  const [insights, setInsights] = useState<ClassInsightsResult | null>(null);
  const [insightsBusy, setInsightsBusy] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  const analytics = useMemo(() => {
    const teacherClasses = classes.filter(c => c.teacher_id === currentUserId);
    const activeClasses = teacherClasses.length > 0 ? teacherClasses : classes;

    let totalAttempts = 0;
    let pendingManual = 0;
    let sumPercentages = 0;

    const quizBars: Array<{ id: string; title: string; classTitle: string; attempts: number; avgPct: number }> = [];
    const questionStats: Array<{ id: string; question: string; quizTitle: string; topic?: string; accuracy: number; attempts: number }> = [];

    quizzes.forEach(qz => {
      const atts = qz.attempts || [];
      if (atts.length === 0) {
        quizBars.push({ id: qz.id, title: qz.title, classTitle: qz.class_title, attempts: 0, avgPct: 0 });
        return;
      }

      const maxTotal = qz.questions.reduce((s, q) => s + (q.points || 1), 0) || 1;
      let qzPctSum = 0;

      const perQuestionTotals: Record<string, { ok: number; total: number }> = {};
      qz.questions.forEach(qq => {
        perQuestionTotals[qq.id] = { ok: 0, total: 0 };
      });

      atts.forEach(att => {
        totalAttempts += 1;
        if (att.needsManualGrading) pendingManual += 1;
        const pct = Math.min(100, Math.round(((att.score || 0) / maxTotal) * 100));
        sumPercentages += pct;
        qzPctSum += pct;

        const rep = buildQuizPerformanceReport(qz, att.answers || {}, null, att.questionFeedback);
        rep.items.forEach(item => {
          const stat = perQuestionTotals[item.question.id];
          if (!stat) return;
          if (item.status !== 'pending') {
            stat.total += 1;
            if (item.status === 'correct') stat.ok += 1;
          }
        });
      });

      quizBars.push({
        id: qz.id,
        title: qz.title,
        classTitle: qz.class_title,
        attempts: atts.length,
        avgPct: Math.round(qzPctSum / atts.length),
      });

      qz.questions.forEach(qq => {
        const st = perQuestionTotals[qq.id];
        if (st && st.total > 0) {
          questionStats.push({
            id: `${qz.id}-${qq.id}`,
            question: qq.question,
            quizTitle: qz.title,
            topic: qq.topic,
            accuracy: Math.round((st.ok / st.total) * 100),
            attempts: st.total,
          });
        }
      });
    });

    const trickyQuestions = [...questionStats].sort((a, b) => a.accuracy - b.accuracy).slice(0, 5);

    const classSummaries = activeClasses.map(cls => {
      const clsQuizzes = quizzes.filter(q => q.class_id === cls.id);
      const clsBars = quizBars.filter(b => clsQuizzes.some(q => q.id === b.id) && b.attempts > 0);
      const clsAttempts = clsBars.reduce((s, b) => s + b.attempts, 0);
      const avgScore = clsBars.length > 0 ? Math.round(clsBars.reduce((s, b) => s + b.avgPct, 0) / clsBars.length) : 0;
      const clsAssignments = assignments.filter(a => a.class_id === cls.id);
      const clsSubs = submissions.filter(s => clsAssignments.some(a => a.id === s.assignment_id));
      return {
        id: cls.id,
        title: cls.title,
        membersCount: cls.members_count,
        avgScore,
        totalAttempts: clsAttempts,
        submissionsCount: clsSubs.length,
      };
    });

    const avgOverall = totalAttempts > 0 ? Math.round(sumPercentages / totalAttempts) : 0;
    const totalAssignmentsSubs = submissions.length;

    return {
      totalAttempts,
      pendingManual,
      avgOverall,
      totalAssignmentsSubs,
      quizBars,
      trickyQuestions,
      classSummaries,
    };
  }, [quizzes, classes, assignments, submissions, currentUserId]);

  const handleGenerateInsights = async () => {
    if (insightsBusy) return;
    setInsightsBusy(true);
    setInsightsError(null);
    try {
      const res = await generateClassInsightsAI({
        classSummaries: analytics.classSummaries.map(c => ({
          title: c.title,
          avgScore: c.avgScore,
          totalAttempts: c.totalAttempts,
        })),
        trickyQuestions: analytics.trickyQuestions.map(q => ({
          question: q.question,
          accuracy: q.accuracy,
          topic: q.topic,
        })),
      });
      setInsights(res);
    } catch (err: any) {
      setInsightsError(err?.message || 'تعذّر توليد توصيات التحليلات.');
    } finally {
      setInsightsBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>متوسط الدرجات العام</span>
            <TrendingUp className="w-4 h-4 text-[#1677c7]" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">{analytics.avgOverall}%</div>
          <span className="text-[11px] text-slate-400">عبر جميع الاختبارات</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>محاولات الاختبارات</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">{analytics.totalAttempts}</div>
          <span className="text-[11px] text-slate-400">تسليم مكتمل</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>بانتظار التصحيح اليدوي</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">{analytics.pendingManual}</div>
          <span className="text-[11px] text-slate-400">محاولة مقالية</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>تسليمات الواجبات</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">{analytics.totalAssignmentsSubs}</div>
          <span className="text-[11px] text-slate-400">إجمالي الواجبات المستلمة</span>
        </div>
      </div>

      {/* AI Teaching Advisor */}
      <div className="bg-white border border-sky-200 rounded-2xl p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h4 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#1677c7]" />
              <span>توصيات ذكية للمعلم بناءً على أداء الطلاب (AI)</span>
            </h4>
            <p className="text-xs text-slate-500">
              يحلّل أكثر الأسئلة صعوبة ومتوسط الصفوف ليقترح عليك محاور المراجعة للحصة القادمة.
            </p>
          </div>
          <button
            type="button"
            disabled={insightsBusy}
            onClick={handleGenerateInsights}
            className="px-4 py-2 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            {insightsBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{insights ? 'تحديث التحليل الذكي' : 'تحليل أداء الصفوف الآن'}</span>
          </button>
        </div>
        {insightsError && <p className="text-xs text-rose-600 font-bold">{insightsError}</p>}
        {insights && (
          <div className="space-y-2.5 pt-1 text-xs">
            <p className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl text-slate-800 leading-relaxed">
              {insights.summary}
            </p>
            {insights.actions.length > 0 && (
              <ul className="space-y-1.5 list-disc list-inside text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {insights.actions.map((act, i) => (
                  <li key={i} className="leading-relaxed">{act}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Quiz performance comparison */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 font-black text-sm text-slate-900">
            <BarChart3 className="w-4 h-4 text-[#1677c7]" />
            <span>متوسط الدرجات حسب الاختبار</span>
          </div>
          {analytics.quizBars.length === 0 ? (
            <p className="text-xs text-slate-500">لا توجد اختبارات منشورة بعد.</p>
          ) : (
            <div className="space-y-3">
              {analytics.quizBars.map(bar => (
                <div key={bar.id} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between gap-2 font-bold">
                    <span className="text-slate-800 truncate">{bar.title}</span>
                    <span className="text-slate-600 tabular-nums shrink-0">
                      {bar.attempts > 0 ? `${bar.avgPct}% (${bar.attempts} محاولة)` : 'بلا محاولات'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        bar.avgPct >= 75 ? 'bg-emerald-500' : bar.avgPct >= 50 ? 'bg-[#1677c7]' : 'bg-amber-500'
                      }`}
                      style={{ width: `${bar.attempts > 0 ? bar.avgPct : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Most confusing questions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 font-black text-sm text-slate-900">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>أكثر الأسئلة إرباكاً وصعوبة للطلاب</span>
          </div>
          {analytics.trickyQuestions.length === 0 ? (
            <p className="text-xs text-slate-500">ستظهر إحصائيات صعوبة الأسئلة بمجرد حل الطلاب للاختبارات.</p>
          ) : (
            <div className="space-y-2.5">
              {analytics.trickyQuestions.map(q => (
                <div key={q.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-start justify-between gap-2 font-bold">
                    <span className="text-slate-900 line-clamp-2">{q.question}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-black shrink-0 tabular-nums ${
                      q.accuracy < 50 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      صواب {q.accuracy}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {q.quizTitle}{q.topic ? ` · ${q.topic}` : ''} · {q.attempts} إجابة مقيمة
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Per-class progress */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
        <h4 className="font-black text-sm text-slate-900">مقارنة تقدم الصفوف الدراسية</h4>
        {analytics.classSummaries.length === 0 ? (
          <p className="text-xs text-slate-500">لا توجد صفوف مسجلة لعرض تقدمها.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {analytics.classSummaries.map(cls => (
              <div key={cls.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-black text-slate-900">
                  <span className="truncate">{cls.title}</span>
                  <span className="text-[#1677c7] tabular-nums">{cls.avgScore}%</span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between tabular-nums">
                  <span>{cls.membersCount} طالب</span>
                  <span>{cls.totalAttempts} اختبار · {cls.submissionsCount} واجب</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
