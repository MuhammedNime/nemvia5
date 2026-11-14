import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Play, 
  FileText, 
  CheckCircle, 
  Award, 
  Clock, 
  HelpCircle, 
  Plus, 
  ChevronRight, 
  Sparkles,
  Download,
  AlertCircle,
  Users,
  X,
  CheckSquare,
  Square,
  PenLine,
  Mic,
  Trash2,
  Upload,
  Volume2,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Loader2,
  MessageSquare,
  Printer,
  Library,
  Flame,
} from 'lucide-react';
import { AppRole, Assignment, Course, Lesson, MinistryItem, Quiz, QuizQuestion, QuizQuestionType, QuizAnswerValue, QuizAttempt, QuestionFeedbackItem, SchoolItem, Submission, ClassItem } from '../../types';
import { downloadQuizAsWordDoc } from '../../lib/wordExport';

import { LessonBuilderModal, QuizBuilderModal, QUIZ_TYPE_META } from '../ContentBuilder';
import {
  QuizResult,
  UploadedFile,
  uploadQuizAudioFeedback,
  buildQuizPerformanceReport,
  QuizPerformanceReport,
} from '../../lib/api';
import {
  summarizeLessonAI,
  draftQuestionFeedbackAI,
  generateStudyPlanAI,
  transcribeAudioAI,
  LessonSummaryResult,
  StudyPlanResult,
} from '../../lib/ai';
import {
  MistakeChallengeModal,
  PrintableExamModal,
  QuestionBankModal,
  TeacherAnalyticsPanel,
} from './CoursePowerModals';
import { loadQuestionBank } from '../../lib/questionBank';

interface CoursesViewProps {
  currentRole: AppRole;
  currentUserName: string;
  courses: Course[];
  lessons: Lesson[];
  quizzes: Quiz[];
  currentUserId: string;
  classes: ClassItem[];
  schools?: SchoolItem[];
  ministries?: MinistryItem[];
  assignments?: Assignment[];
  submissions?: Submission[];
  onSubmitQuiz: (quizId: string, answers: Record<string, QuizAnswerValue>, questions: QuizQuestion[]) => Promise<QuizResult>;
  onGradeQuizAttempt: (
    attemptId: string,
    score: number,
    feedback: string,
    questionFeedback?: Record<string, QuestionFeedbackItem>,
  ) => Promise<boolean>;
  onUpload: (f: File, folder: string) => Promise<UploadedFile>;
  onDeleteLesson: (id: string) => void;
  onDeleteQuiz: (id: string) => void;
  onAddQuiz: (quiz: Quiz) => void;
  onAddLesson: (lesson: Lesson) => void;
  onRewardPoints: (points: number) => void;
}

const formatQuestionAnswerText = (q: QuizQuestion, val: QuizAnswerValue | undefined): string => {
  if (val === undefined || val === null || val === -1) return 'لم يُجب';
  if (typeof val === 'number') return q.options[val] ?? String(val);
  if (Array.isArray(val)) return val.length ? val.map(idx => q.options[idx] ?? idx).join('، ') : 'لم يُجب';
  if (typeof val === 'string') return val.trim() ? val : 'لم يُجب';
  return 'لم يُجب';
};

const QuizPerformanceReportPanel: React.FC<{
  quiz: Quiz;
  report: QuizPerformanceReport;
  teacherFeedback?: string;
  onStartChallenge?: (questions: QuizQuestion[]) => void;
}> = ({ quiz, report, teacherFeedback, onStartChallenge }) => {
  const [aiPlan, setAiPlan] = useState<StudyPlanResult | null>(null);
  const [aiPlanLoading, setAiPlanLoading] = useState(false);
  const [aiPlanError, setAiPlanError] = useState<string | null>(null);
  const [studentTranscripts, setStudentTranscripts] = useState<Record<string, string>>({});
  const [transcribingQId, setTranscribingQId] = useState<string | null>(null);

  const mistakeQuestions = report.items
    .filter(it => it.status === 'incorrect' || it.status === 'unanswered')
    .map(it => it.question);

  const handleStudentTranscribe = async (qId: string, audioUrl: string) => {
    if (transcribingQId === qId) return;
    setTranscribingQId(qId);
    try {
      const text = await transcribeAudioAI({ audioUrl });
      setStudentTranscripts(prev => ({ ...prev, [qId]: text }));
    } catch {
      setStudentTranscripts(prev => ({ ...prev, [qId]: 'تعذّر استخراج النص من التسجيل حالياً.' }));
    } finally {
      setTranscribingQId(null);
    }
  };

  const handleBuildStudyPlan = async () => {
    if (aiPlanLoading) return;
    setAiPlanLoading(true);
    setAiPlanError(null);
    try {
      const plan = await generateStudyPlanAI({
        quizTitle: quiz.title,
        percentage: report.percentage,
        strengths: report.strengths,
        weaknesses: report.weaknesses,
      });
      setAiPlan(plan);
    } catch (err: any) {
      setAiPlanError(err?.message || 'تعذّر توليد الخطة العلاجية الآن.');
    } finally {
      setAiPlanLoading(false);
    }
  };

  const gradeTone =
    report.percentage >= 85
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : report.percentage >= 65
        ? 'bg-sky-100 text-sky-800 border-sky-200'
        : report.percentage >= 50
          ? 'bg-amber-100 text-amber-800 border-amber-200'
          : 'bg-rose-100 text-rose-800 border-rose-200';

  return (
    <div className="space-y-5 text-right">
      {/* ملخص الأداء العام */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#1677c7]" />
            <h4 className="font-black text-sm text-slate-900">تقرير الأداء التفصيلي</h4>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-black border ${gradeTone}`}>
            {report.gradeLabel} · {report.percentage}%
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              report.percentage >= 80 ? 'bg-emerald-500' : report.percentage >= 55 ? 'bg-[#1677c7]' : 'bg-rose-500'
            }`}
            style={{ width: `${report.percentage}%` }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold">إجابات صحيحة</span>
            <strong className="text-base font-black text-emerald-600">{report.correctCount}</strong>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold">إجابات خاطئة</span>
            <strong className="text-base font-black text-rose-600">{report.incorrectCount}</strong>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold">قيد المراجعة</span>
            <strong className="text-base font-black text-amber-600">{report.pendingCount}</strong>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold">غير مجاب</span>
            <strong className="text-base font-black text-slate-600">{report.unansweredCount}</strong>
          </div>
        </div>

        {mistakeQuestions.length > 0 && onStartChallenge && (
          <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-600">
              لديك {mistakeQuestions.length} {mistakeQuestions.length === 1 ? 'سؤال يحتاج' : 'أسئلة تحتاج'} لمراجعة وتحدٍ سريع
            </span>
            <button
              type="button"
              onClick={() => onStartChallenge(mistakeQuestions)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-[11px] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>ابدأ تحدي تصحيح الأخطاء</span>
            </button>
          </div>
        )}
      </div>

      {/* ملاحظة المعلم العامة */}
      {teacherFeedback && (
        <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-[#0f233a] space-y-1">
          <div className="font-black flex items-center gap-1.5 text-[#1677c7]">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>ملاحظة المعلم العامة على المحاولة:</span>
          </div>
          <p className="leading-relaxed whitespace-pre-line">{teacherFeedback}</p>
        </div>
      )}

      {/* نقاط القوة ونقاط الضعف */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-800 font-black text-xs">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>نقاط القوة</span>
          </div>
          {report.strengths.length > 0 ? (
            <ul className="space-y-1.5 text-[11px] text-emerald-950 list-disc list-inside">
              {report.strengths.map((s, i) => (
                <li key={i} className="leading-relaxed">{s}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[11px] text-emerald-800/80">ستظهر نقاط قوتك المميزة مع إكمال المزيد من الأسئلة المصحّحة.</p>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
          <div className="flex items-center gap-1.5 text-rose-800 font-black text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>نقاط الضعف وتحتاج لتحسين</span>
          </div>
          {report.weaknesses.length > 0 ? (
            <ul className="space-y-1.5 text-[11px] text-rose-950 list-disc list-inside">
              {report.weaknesses.map((w, i) => (
                <li key={i} className="leading-relaxed">{w}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[11px] text-emerald-700 font-bold">ممتاز! لم تُسجّل نقاط ضعف واضحة في هذا الاختبار.</p>
          )}
        </div>
      </div>

      {/* توصيات التحسين */}
      {report.recommendations.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-900 font-black text-xs">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>توصيات مخصصة لرفع مستواك</span>
          </div>
          <ul className="space-y-1 text-[11px] text-amber-950 list-disc list-inside">
            {report.recommendations.map((rec, i) => (
              <li key={i} className="leading-relaxed">{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* خطة علاجية ذكية لنقاط الضعف بالذكاء الاصطناعي */}
      <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-900 font-black text-xs">
            <Sparkles className="w-4 h-4 text-[#1677c7]" />
            <span>خطة علاجية ذكية مبنية على نتيجتك (AI)</span>
          </div>
          <button
            type="button"
            disabled={aiPlanLoading}
            onClick={handleBuildStudyPlan}
            className="px-3 py-1.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-50 text-white font-bold text-[11px] rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            {aiPlanLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{aiPlan ? 'إعادة توليد الخطة' : 'إنشاء خطة دراسة مخصصة'}</span>
          </button>
        </div>

        {aiPlanError && (
          <p className="text-[11px] text-rose-600 font-bold">{aiPlanError}</p>
        )}

        {aiPlan && (
          <div className="space-y-2 pt-1 text-xs">
            {aiPlan.planSummary && (
              <p className="text-slate-700 leading-relaxed bg-white p-2.5 rounded-xl border border-sky-100">
                {aiPlan.planSummary}
              </p>
            )}
            <div className="grid sm:grid-cols-2 gap-2">
              {aiPlan.steps.map((st, idx) => (
                <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black text-slate-900 text-[11px]">{idx + 1}. {st.title}</span>
                    {st.duration && (
                      <span className="text-[10px] font-bold text-[#1677c7] bg-sky-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                        {st.duration}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{st.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* تحليل الدقة حسب الموضوع ونوع السؤال */}
      {(report.byTopic.length > 0 || report.byType.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-3">
          {report.byType.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5">
              <h5 className="font-black text-xs text-slate-800">الأداء حسب نوع السؤال</h5>
              <div className="space-y-2">
                {report.byType.map(bt => (
                  <div key={bt.key} className="space-y-1 text-[11px]">
                    <div className="flex items-center justify-between font-bold text-slate-700">
                      <span>{bt.label} ({bt.correctQuestions}/{bt.totalQuestions})</span>
                      <span className={bt.accuracy >= 75 ? 'text-emerald-600' : bt.accuracy < 60 ? 'text-rose-600' : 'text-[#1677c7]'}>
                        {bt.accuracy}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${bt.accuracy >= 75 ? 'bg-emerald-500' : bt.accuracy < 60 ? 'bg-rose-500' : 'bg-[#1677c7]'}`}
                        style={{ width: `${bt.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.byTopic.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5">
              <h5 className="font-black text-xs text-slate-800">الأداء حسب الموضوع / المهارة</h5>
              <div className="space-y-2">
                {report.byTopic.map(tp => (
                  <div key={tp.key} className="space-y-1 text-[11px]">
                    <div className="flex items-center justify-between font-bold text-slate-700">
                      <span>{tp.label} ({tp.correctQuestions}/{tp.totalQuestions})</span>
                      <span className={tp.accuracy >= 75 ? 'text-emerald-600' : tp.accuracy < 60 ? 'text-rose-600' : 'text-[#1677c7]'}>
                        {tp.accuracy}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${tp.accuracy >= 75 ? 'bg-emerald-500' : tp.accuracy < 60 ? 'bg-rose-500' : 'bg-[#1677c7]'}`}
                        style={{ width: `${tp.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* مراجعة تفصيلية لكل سؤال وتغذية المعلم */}
      <div className="space-y-3 pt-1">
        <h5 className="font-black text-xs text-slate-800">مراجعة الأسئلة وتغذية المعلم ({quiz.questions.length})</h5>
        {report.items.map(item => {
          const { question: q, index, type: qType, userAnswer, status, earnedPoints, maxPoints, keyEntry, teacherFeedback: qFb } = item;
          const statusMeta =
            status === 'correct'
              ? { label: '✓ إجابة صحيحة', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
              : status === 'pending'
                ? { label: '⏳ بانتظار تصحيح المعلم', cls: 'text-amber-700 bg-amber-50 border-amber-200' }
                : status === 'unanswered'
                  ? { label: '— لم يُجب', cls: 'text-slate-600 bg-slate-100 border-slate-200' }
                  : { label: '✗ إجابة خاطئة', cls: 'text-rose-700 bg-rose-50 border-rose-200' };

          return (
            <div key={q.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 text-xs space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-2 font-bold">
                <div className="space-y-1 flex-1 min-w-0">
                  <span className="text-slate-900 leading-relaxed block">{index + 1}. {q.question}</span>
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                      {QUIZ_TYPE_META[qType]?.badge || qType}
                    </span>
                    {q.topic && (
                      <span className="px-2 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-[#1677c7]">
                        {q.topic}
                      </span>
                    )}
                    <span className="text-slate-500">
                      الدرجة: {status === 'pending' ? `— / ${maxPoints}` : `${earnedPoints} / ${maxPoints}`}
                    </span>
                  </div>
                </div>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full border shrink-0 ${statusMeta.cls}`}>
                  {statusMeta.label}
                </span>
              </div>

              {(qType === 'mcq' || qType === 'true_false') && (
                <p className="text-[11px] text-slate-600">
                  <strong>إجابتك:</strong> {formatQuestionAnswerText(q, userAnswer)} ·{' '}
                  <strong className="text-emerald-700">
                    الصحيحة:
                  </strong>{' '}
                  {keyEntry?.correct !== undefined
                    ? (q.options[keyEntry.correct] ?? '—')
                    : (q.correctOptionIndex >= 0 ? (q.options[q.correctOptionIndex] ?? '—') : 'متاحة بعد التصحيح')}
                </p>
              )}

              {qType === 'multi_select' && (
                <p className="text-[11px] text-slate-600">
                  <strong>إجابتك:</strong> {formatQuestionAnswerText(q, userAnswer)} ·{' '}
                  <strong className="text-emerald-700">الصحيحة:</strong>{' '}
                  {((keyEntry?.correctIndices || q.correctOptionIndices || []).map(idx => q.options[idx]).join('، ')) || '—'}
                </p>
              )}

              {(qType === 'short_answer' || qType === 'fill_blank') && (
                <p className="text-[11px] text-slate-600">
                  <strong>إجابتك:</strong> {formatQuestionAnswerText(q, userAnswer)} ·{' '}
                  <strong className="text-emerald-700">الإجابات المقبولة:</strong>{' '}
                  {(keyEntry?.acceptedAnswers || q.acceptedAnswers || []).join(' / ') || '—'}
                </p>
              )}

              {qType === 'essay' && (
                <div className="space-y-1 text-[11px] text-slate-600">
                  <p className="whitespace-pre-line">
                    <strong>إجابتك:</strong> {formatQuestionAnswerText(q, userAnswer)}
                  </p>
                  {(keyEntry?.modelAnswer || q.modelAnswer) && (
                    <p className="text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                      <strong>الإجابة النموذجية:</strong> {keyEntry?.modelAnswer || q.modelAnswer}
                    </p>
                  )}
                </div>
              )}

              {(keyEntry?.explanation || q.explanation) && (
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>التفسير العلمي:</strong> {keyEntry?.explanation || q.explanation}
                </p>
              )}

              {(qFb?.text || qFb?.audio_url || qFb?.points_awarded !== undefined) && (
                <div className="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200 space-y-1.5 text-[11px] text-indigo-950">
                  <div className="flex items-center justify-between font-black text-indigo-800">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>تغذية المعلم لهذا السؤال</span>
                    </span>
                    {qFb.points_awarded !== undefined && (
                      <span className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-700">
                        {qFb.points_awarded} / {q.points} نقطة
                      </span>
                    )}
                  </div>
                  {qFb.text && <p className="leading-relaxed whitespace-pre-line">{qFb.text}</p>}
                  {qFb.audio_url && (
                    <div className="space-y-1.5 pt-0.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700">
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>تعليق صوتي من المعلم:</span>
                        </span>
                        {!qFb.transcript && !studentTranscripts[q.id] && (
                          <button
                            type="button"
                            disabled={transcribingQId === q.id}
                            onClick={() => handleStudentTranscribe(q.id, qFb.audio_url!)}
                            className="px-2 py-0.5 bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            {transcribingQId === q.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            <span>{transcribingQId === q.id ? 'جاري التفريغ...' : 'عرض النص المكتوب (AI)'}</span>
                          </button>
                        )}
                      </div>
                      <audio controls preload="metadata" src={qFb.audio_url} className="w-full h-9" />
                      {(qFb.transcript || studentTranscripts[q.id]) && (
                        <div className="p-2 rounded-lg bg-white border border-indigo-100 text-[11px] text-slate-700 leading-relaxed">
                          <span className="font-bold text-indigo-700 block text-[10px] mb-0.5">النص المفرّغ من التسجيل:</span>
                          <p className="whitespace-pre-line">{qFb.transcript || studentTranscripts[q.id]}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CoursesView: React.FC<CoursesViewProps> = ({
  currentRole,
  currentUserName,
  courses,
  lessons,
  quizzes,
  currentUserId,
  classes,
  schools = [],
  ministries = [],
  assignments = [],
  submissions = [],
  onSubmitQuiz,
  onGradeQuizAttempt,
  onUpload,
  onDeleteLesson,
  onDeleteQuiz,
  onAddQuiz,
  onAddLesson,
  onRewardPoints,
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'lessons' | 'quizzes' | 'analytics'>('quizzes');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Active Quiz Taking Mode State
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, QuizAnswerValue>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  // Teacher builders, grading modal, bank, printable PDF & challenge modals
  const [showQuizBuilder, setShowQuizBuilder] = useState(false);
  const [quizBuilderPreset, setQuizBuilderPreset] = useState<{ title: string; questions: QuizQuestion[] } | null>(null);
  const [showLessonBuilder, setShowLessonBuilder] = useState(false);
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [printExam, setPrintExam] = useState<{
    title: string;
    classTitle?: string;
    defaultMinistryName?: string;
    defaultSchoolName?: string;
    timeLimitMinutes?: number;
    questions: QuizQuestion[];
  } | null>(null);
  const [challengeData, setChallengeData] = useState<{ title: string; questions: QuizQuestion[] } | null>(null);
  const [gradingQuizId, setGradingQuizId] = useState<string | null>(null);
  const [reportQuizId, setReportQuizId] = useState<string | null>(null);
  const [attemptEdits, setAttemptEdits] = useState<
    Record<string, { score: string; feedback: string; questionFeedback: Record<string, QuestionFeedbackItem> }>
  >({});
  const [savingAttemptId, setSavingAttemptId] = useState<string | null>(null);

  // Audio feedback recording / upload / transcription state inside teacher grading modal
  const [recordingTarget, setRecordingTarget] = useState<{ attemptId: string; questionId: string } | null>(null);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [uploadingAudioKey, setUploadingAudioKey] = useState<string | null>(null);
  const [transcribingKey, setTranscribingKey] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [aiDraftKey, setAiDraftKey] = useState<string | null>(null);
  const [lessonSummaries, setLessonSummaries] = useState<Record<string, LessonSummaryResult>>({});
  const [lessonAiLoadingId, setLessonAiLoadingId] = useState<string | null>(null);
  const [lessonAiError, setLessonAiError] = useState<Record<string, string>>({});
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<number | null>(null);

  const myClasses = classes.filter(c => c.teacher_id === currentUserId);
  const canBuild = (currentRole === 'teacher' || currentRole === 'admin') && myClasses.length > 0;

  // Server-side grading result
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const answersRef = useRef<Record<string, QuizAnswerValue>>({});
  const finishingRef = useRef(false);

  const cleanupRecording = () => {
    if (recordTimerRef.current) {
      window.clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch { /* ignore */ }
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    mediaRecorderRef.current = null;
    setRecordingTarget(null);
    setRecordSeconds(0);
  };

  useEffect(() => () => cleanupRecording(), []);

  // Quiz Timer
  useEffect(() => {
    if (!activeQuiz || quizSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeQuiz, quizSubmitted]);

  const handleStartQuiz = (q: Quiz) => {
    setActiveQuiz(q);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    answersRef.current = {};
    finishingRef.current = false;
    setQuizResult(null);
    setQuizSubmitted(false);
    setTimeLeft(q.timeLimitMinutes * 60);
  };

  const setQuestionAnswer = (questionId: string, val: QuizAnswerValue) => {
    if (quizSubmitted) return;
    answersRef.current = { ...answersRef.current, [questionId]: val };
    setSelectedAnswers(prev => ({ ...prev, [questionId]: val }));
  };

  const toggleMultiOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    const cur = Array.isArray(answersRef.current[questionId]) ? (answersRef.current[questionId] as number[]) : [];
    const next = cur.includes(optionIndex)
      ? cur.filter(i => i !== optionIndex)
      : [...cur, optionIndex].sort((a, b) => a - b);
    setQuestionAnswer(questionId, next);
  };

  const isQuestionAnswered = (q: QuizQuestion) => {
    const val = selectedAnswers[q.id];
    if (val === undefined || val === null) return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'string') return val.trim().length > 0;
    return true;
  };

  const handleFinishQuiz = async () => {
    if (!activeQuiz || finishingRef.current) return;
    finishingRef.current = true;
    try {
      const res = await onSubmitQuiz(activeQuiz.id, answersRef.current, activeQuiz.questions);
      setQuizResult(res);
      setQuizScore(res.score);
      setQuizSubmitted(true);
      onRewardPoints(res.score * 10);
    } catch {
      finishingRef.current = false;
      setActiveQuiz(null);
    }
  };

  const gradingQuiz = gradingQuizId ? quizzes.find(q => q.id === gradingQuizId) || null : null;
  const reportQuiz = reportQuizId ? quizzes.find(q => q.id === reportQuizId) || null : null;

  const openGradingModal = (q: Quiz) => {
    cleanupRecording();
    setAudioError(null);
    const initial: Record<string, { score: string; feedback: string; questionFeedback: Record<string, QuestionFeedbackItem> }> = {};
    (q.attempts || []).forEach(a => {
      initial[a.id] = {
        score: String(a.score),
        feedback: a.teacherFeedback || '',
        questionFeedback: { ...(a.questionFeedback || {}) },
      };
    });
    setAttemptEdits(initial);
    setGradingQuizId(q.id);
  };

  const closeGradingModal = () => {
    cleanupRecording();
    setAudioError(null);
    setGradingQuizId(null);
  };

  const updateQuestionFeedback = (attemptId: string, questionId: string, patch: Partial<QuestionFeedbackItem>) => {
    setAttemptEdits(prev => {
      const cur = prev[attemptId] || { score: '0', feedback: '', questionFeedback: {} };
      const existingQ = cur.questionFeedback[questionId] || {};
      const nextQ: QuestionFeedbackItem = { ...existingQ, ...patch };
      if (!nextQ.text?.trim()) delete nextQ.text;
      if (!nextQ.audio_url) delete nextQ.audio_url;
      if (!nextQ.transcript?.trim()) delete nextQ.transcript;
      if (nextQ.points_awarded === undefined || Number.isNaN(nextQ.points_awarded)) delete nextQ.points_awarded;

      const nextMap = { ...cur.questionFeedback };
      if (Object.keys(nextQ).length === 0) delete nextMap[questionId];
      else nextMap[questionId] = nextQ;

      return {
        ...prev,
        [attemptId]: {
          ...cur,
          questionFeedback: nextMap,
        },
      };
    });
  };

  const sumAttemptPointsFromQuestions = (quiz: Quiz, att: QuizAttempt) => {
    const cur = attemptEdits[att.id];
    const qMap = cur?.questionFeedback || {};
    let sum = 0;
    quiz.questions.forEach(qq => {
      const manual = qMap[qq.id]?.points_awarded;
      if (manual !== undefined) {
        sum += manual;
      } else {
        const rep = buildQuizPerformanceReport(
          { ...quiz, questions: [qq] },
          att.answers || {},
          null,
          {},
        );
        sum += rep.items[0]?.earnedPoints || 0;
      }
    });
    setAttemptEdits(prev => ({
      ...prev,
      [att.id]: {
        ...(prev[att.id] || { score: String(att.score), feedback: att.teacherFeedback || '', questionFeedback: {} }),
        score: String(Number(sum.toFixed(2))),
      },
    }));
  };

  const handleAiDraftFeedback = async (att: QuizAttempt, qq: QuizQuestion) => {
    const key = `${att.id}:${qq.id}`;
    if (aiDraftKey === key) return;
    setAiDraftKey(key);
    setAudioError(null);
    try {
      const qType = qq.type || 'mcq';
      const studentAnswer = formatQuestionAnswerText(qq, att.answers?.[qq.id]);
      let modelAnswer = qq.modelAnswer || '';
      if (!modelAnswer && (qType === 'mcq' || qType === 'true_false') && qq.correctOptionIndex >= 0) {
        modelAnswer = qq.options[qq.correctOptionIndex] || '';
      } else if (!modelAnswer && qType === 'multi_select' && qq.correctOptionIndices?.length) {
        modelAnswer = qq.correctOptionIndices.map(i => qq.options[i]).join('، ');
      } else if (!modelAnswer && (qType === 'short_answer' || qType === 'fill_blank') && qq.acceptedAnswers?.length) {
        modelAnswer = qq.acceptedAnswers.join(' / ');
      }
      const res = await draftQuestionFeedbackAI({
        question: qq.question,
        studentAnswer,
        modelAnswer,
        maxPoints: qq.points,
      });
      updateQuestionFeedback(att.id, qq.id, {
        text: res.feedbackText,
        points_awarded: res.suggestedPoints,
      });
    } catch (err: any) {
      setAudioError(err?.message || 'تعذّر صياغة التغذية الراجعة بالذكاء الاصطناعي.');
    } finally {
      setAiDraftKey(null);
    }
  };

  const handleSummarizeLesson = async (ls: Lesson) => {
    if (lessonAiLoadingId === ls.id) return;
    setLessonAiLoadingId(ls.id);
    setLessonAiError(prev => {
      const next = { ...prev };
      delete next[ls.id];
      return next;
    });
    try {
      const result = await summarizeLessonAI(ls.title, ls.content);
      setLessonSummaries(prev => ({ ...prev, [ls.id]: result }));
    } catch (err: any) {
      setLessonAiError(prev => ({ ...prev, [ls.id]: err?.message || 'تعذّر تلخيص الدرس بالذكاء الاصطناعي.' }));
    } finally {
      setLessonAiLoadingId(null);
    }
  };

  const startAudioRecording = async (attemptId: string, questionId: string) => {
    setAudioError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setAudioError('متصفحك لا يدعم التسجيل الصوتي المباشر. يمكنك رفع ملف صوتي جاهز بدلاً من ذلك.');
      return;
    }
    cleanupRecording();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
      const chosenMime = candidates.find(m => MediaRecorder.isTypeSupported(m)) || '';
      const recorder = chosenMime ? new MediaRecorder(stream, { mimeType: chosenMime }) : new MediaRecorder(stream);

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      setRecordingTarget({ attemptId, questionId });
      setRecordSeconds(0);

      recordTimerRef.current = window.setInterval(() => {
        setRecordSeconds(s => s + 1);
      }, 1000);

      recorder.ondataavailable = (ev: BlobEvent) => {
        if (ev.data && ev.data.size > 0) audioChunksRef.current.push(ev.data);
      };

      recorder.onstop = async () => {
        if (recordTimerRef.current) {
          window.clearInterval(recordTimerRef.current);
          recordTimerRef.current = null;
        }
        stream.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
        mediaRecorderRef.current = null;
        setRecordingTarget(null);
        setRecordSeconds(0);

        const mime = recorder.mimeType || chosenMime || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mime });
        audioChunksRef.current = [];
        if (blob.size < 200) return;

        const key = `${attemptId}:${questionId}`;
        setUploadingAudioKey(key);
        try {
          const ext = mime.includes('mp4') ? 'm4a' : mime.includes('ogg') ? 'ogg' : 'webm';
          const url = await uploadQuizAudioFeedback(currentUserId, blob, ext);
          updateQuestionFeedback(attemptId, questionId, { audio_url: url });
          if (blob.size < 4_500_000) {
            void transcribeAudioBlob(attemptId, questionId, blob, mime);
          }
        } catch (err: any) {
          setAudioError(err?.message || 'تعذّر رفع التسجيل الصوتي');
        } finally {
          setUploadingAudioKey(null);
        }
      };

      recorder.start();
    } catch {
      cleanupRecording();
      setAudioError('تعذّر الوصول إلى الميكروفون. تحقق من أذونات المتصفح أو ارفع ملفاً صوتياً.');
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      cleanupRecording();
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = String(reader.result || '');
        const idx = res.indexOf(',');
        resolve(idx >= 0 ? res.slice(idx + 1) : res);
      };
      reader.onerror = () => reject(new Error('تعذّر قراءة الملف الصوتي'));
      reader.readAsDataURL(blob);
    });

  const transcribeAudioBlob = async (attemptId: string, questionId: string, blob: Blob, mimeType: string) => {
    const key = `${attemptId}:${questionId}`;
    setTranscribingKey(key);
    try {
      const base64 = await blobToBase64(blob);
      const text = await transcribeAudioAI({ audioBase64: base64, mimeType });
      if (text) updateQuestionFeedback(attemptId, questionId, { transcript: text });
    } catch {
      /* المستخدم يستطيع المحاولة يدوياً أو تعديل النص */
    } finally {
      setTranscribingKey(null);
    }
  };

  const handleManualTranscribeUrl = async (attemptId: string, questionId: string, audioUrl: string) => {
    const key = `${attemptId}:${questionId}`;
    if (transcribingKey === key) return;
    setTranscribingKey(key);
    setAudioError(null);
    try {
      const text = await transcribeAudioAI({ audioUrl });
      updateQuestionFeedback(attemptId, questionId, { transcript: text });
    } catch (err: any) {
      setAudioError(err?.message || 'تعذّر تفريغ الصوت إلى نص.');
    } finally {
      setTranscribingKey(null);
    }
  };

  const handleAudioFilePick = async (attemptId: string, questionId: string, file?: File) => {
    if (!file) return;
    setAudioError(null);
    const key = `${attemptId}:${questionId}`;
    setUploadingAudioKey(key);
    try {
      const url = await uploadQuizAudioFeedback(currentUserId, file);
      updateQuestionFeedback(attemptId, questionId, { audio_url: url });
      if (file.size < 4_500_000) {
        void transcribeAudioBlob(attemptId, questionId, file, file.type || 'audio/webm');
      }
    } catch (err: any) {
      setAudioError(err?.message || 'تعذّر رفع الملف الصوتي');
    } finally {
      setUploadingAudioKey(null);
    }
  };

  const saveAttemptGrade = async (a: QuizAttempt) => {
    const edit = attemptEdits[a.id] || { score: String(a.score), feedback: '', questionFeedback: {} };
    const numScore = Math.max(0, Number(edit.score) || 0);
    setSavingAttemptId(a.id);
    await onGradeQuizAttempt(a.id, numScore, edit.feedback, edit.questionFeedback);
    setSavingAttemptId(null);
  };

  const allStudentMistakes = quizzes
    .filter(q => q.attempted && q.myAnswers)
    .flatMap(q => {
      const rep = buildQuizPerformanceReport(q, q.myAnswers || {}, null, q.questionFeedback);
      return rep.items
        .filter(it => it.status === 'incorrect' || it.status === 'unanswered')
        .map(it => it.question);
    });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Quiz Active Taking Modal / Fullscreen Simulator */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Quiz Modal Header */}
            <div className="bg-white border-b border-slate-200 text-slate-900 p-5 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[11px] text-[#1677c7] font-bold block">
                  اختبار تقييم مستوى فوري
                </span>
                <h3 className="font-black text-base sm:text-lg">{activeQuiz.title}</h3>
              </div>

              {!quizSubmitted ? (
                <div className="bg-white/15 px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-300" />
                  <span>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              ) : (
                <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span>اكتمل الاختبار</span>
                </div>
              )}
            </div>

            {/* Quiz Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
              {!quizSubmitted ? (
                // In Progress
                (() => {
                  const curQ = activeQuiz.questions[currentQuestionIndex];
                  const qType: QuizQuestionType = curQ.type || 'mcq';
                  const curVal = selectedAnswers[curQ.id];
                  const letters = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];
                  return (
                    <div className="space-y-5">
                      {/* شريط التنقل بين أرقام الأسئلة */}
                      <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-100">
                        {activeQuiz.questions.map((item, idx) => {
                          const answered = isQuestionAnswered(item);
                          const isCurrent = idx === currentQuestionIndex;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setCurrentQuestionIndex(idx)}
                              className={`w-7 h-7 rounded-lg text-[11px] font-black cursor-pointer transition-all ${
                                isCurrent
                                  ? 'bg-[#1677c7] text-white ring-2 ring-[#1677c7]/30'
                                  : answered
                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              {idx + 1}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <div className="flex items-center gap-2">
                          <span>السؤال {currentQuestionIndex + 1} من {activeQuiz.questions.length}</span>
                          <span className="px-2 py-0.5 rounded-full bg-sky-50 text-[#1677c7] border border-sky-200 text-[10px]">
                            {QUIZ_TYPE_META[qType].badge}
                          </span>
                        </div>
                        <span>الدرجة: {curQ.points} {curQ.points === 1 ? 'نقطة' : 'نقاط'}</span>
                      </div>

                      <h4 className="font-extrabold text-base sm:text-lg text-slate-900 leading-relaxed whitespace-pre-line">
                        {curQ.question}
                      </h4>

                      {/* صح أم خطأ */}
                      {qType === 'true_false' && (
                        <div className="grid grid-cols-2 gap-3">
                          {(curQ.options.length ? curQ.options : ['صح', 'خطأ']).map((opt, idx) => {
                            const isSelected = curVal === idx;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setQuestionAnswer(curQ.id, idx)}
                                className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer font-black text-base ${
                                  isSelected
                                    ? idx === 0
                                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                                      : 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs'
                                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                }`}
                              >
                                {idx === 0 ? '✓ ' : '✗ '}{opt}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* اختيار من متعدد */}
                      {qType === 'mcq' && (
                        <div className="space-y-2.5">
                          {curQ.options.map((opt, idx) => {
                            const isSelected = curVal === idx;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setQuestionAnswer(curQ.id, idx)}
                                className={`w-full p-4 rounded-2xl border text-right transition-all flex items-center gap-3 cursor-pointer text-sm font-semibold ${
                                  isSelected
                                    ? 'bg-sky-50 border-[#1677c7] text-[#0f233a] shadow-xs'
                                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                }`}
                              >
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                  isSelected ? 'bg-[#1677c7] text-white' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {letters[idx] || idx + 1}
                                </span>
                                <span className="flex-1">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* اختيار أكثر من إجابة */}
                      {qType === 'multi_select' && (
                        <div className="space-y-2.5">
                          <p className="text-[11px] font-bold text-[#1677c7]">يمكنك تحديد أكثر من خيار صحيح:</p>
                          {curQ.options.map((opt, idx) => {
                            const selectedList = Array.isArray(curVal) ? curVal : [];
                            const isSelected = selectedList.includes(idx);
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => toggleMultiOption(curQ.id, idx)}
                                className={`w-full p-4 rounded-2xl border text-right transition-all flex items-center gap-3 cursor-pointer text-sm font-semibold ${
                                  isSelected
                                    ? 'bg-sky-50 border-[#1677c7] text-[#0f233a] shadow-xs'
                                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                }`}
                              >
                                {isSelected
                                  ? <CheckSquare className="w-5 h-5 text-[#1677c7] shrink-0" />
                                  : <Square className="w-5 h-5 text-slate-300 shrink-0" />}
                                <span className="flex-1">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* إجابة قصيرة أو أكمل الفراغ */}
                      {(qType === 'short_answer' || qType === 'fill_blank') && (
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-600">
                            {qType === 'fill_blank' ? 'اكتب الكلمة أو العبارة الناقصة في الفراغ:' : 'اكتب إجابتك المختصرة:'}
                          </label>
                          <input
                            type="text"
                            dir="auto"
                            value={typeof curVal === 'string' ? curVal : ''}
                            onChange={e => setQuestionAnswer(curQ.id, e.target.value)}
                            placeholder="اكتب إجابتك هنا..."
                            className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-[#1677c7] bg-slate-50 focus:bg-white text-sm font-bold outline-none transition-all"
                          />
                        </div>
                      )}

                      {/* سؤال مقالي / كتابي مطول */}
                      {qType === 'essay' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-600">اكتب إجابتك المفصلة:</span>
                            <span className="text-[11px] text-amber-600 font-bold">يراجعه المعلم بعد التسليم</span>
                          </div>
                          <textarea
                            dir="auto"
                            rows={5}
                            value={typeof curVal === 'string' ? curVal : ''}
                            onChange={e => setQuestionAnswer(curQ.id, e.target.value)}
                            placeholder="اشرح إجابتك بوضوح..."
                            className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-[#1677c7] bg-slate-50 focus:bg-white text-sm leading-relaxed outline-none transition-all"
                          />
                          <div className="text-left text-[11px] text-slate-400">
                            {typeof curVal === 'string' && curVal.trim() ? `${curVal.trim().split(/\s+/).length} كلمة` : '0 كلمة'}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                // Quiz Results & Certificate
                <div className="space-y-6 text-center animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
                    🎉
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900">أحسنت عملاً يا {currentUserName}!</h3>
                    <p className="text-xs text-slate-500">
                      {quizResult?.needsManualGrading
                        ? 'تم احتساب درجات الأسئلة الآلية مبدئياً، وبانتظار مراجعة المعلم للأسئلة المقالية'
                        : 'تم تصحيح إجاباتك تلقائياً وحساب نتيجتك'}
                    </p>
                  </div>

                  {/* Score Card */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 max-w-sm mx-auto flex items-center justify-around">
                    <div>
                      <span className="text-xs text-slate-400 block font-bold">
                        {quizResult?.needsManualGrading ? 'الدرجة المبدئية' : 'النتيجة النهائية'}
                      </span>
                      <span className="text-3xl font-black text-emerald-600">
                        {quizScore} <span className="text-sm font-normal text-slate-400">/ {quizResult?.total ?? 0}</span>
                      </span>
                    </div>
                    <div className="h-10 w-px bg-slate-200" />
                    <div>
                      <span className="text-xs text-slate-400 block font-bold">نقاط المكافأة</span>
                      <span className="text-2xl font-black text-amber-500">+{Math.min(quizScore * 10, 100)} XP</span>
                    </div>
                  </div>

                  {/* Generated Certificate Card */}
                  <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl text-amber-950 text-right space-y-2 relative overflow-hidden shadow-xs">
                    <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                      <span className="text-xs font-black uppercase text-amber-800">شهادة إتمام اختبار مصدقة · NEMVIA</span>
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-xs leading-relaxed">
                      تشهد منصة <strong>NEMVIA</strong> بأن الطالب/ـة <strong>{currentUserName}</strong> قد أتمّ اختبار <em>"{activeQuiz.title}"</em>.
                    </p>
                    <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-[11px] text-amber-900">
                      <span>التحقق: NEMVIA-CERT-PASS</span>
                      <span className="font-bold">توقيع المؤسس: محمد جمال نعمه ✍️</span>
                    </div>
                  </div>

                  {/* Detailed Performance Report & Question Review */}
                  <QuizPerformanceReportPanel
                    quiz={activeQuiz}
                    report={buildQuizPerformanceReport(activeQuiz, selectedAnswers, quizResult, activeQuiz.questionFeedback)}
                    teacherFeedback={activeQuiz.teacherFeedback}
                    onStartChallenge={qs => {
                      const title = activeQuiz.title;
                      setActiveQuiz(null);
                      setChallengeData({ title: `تحدي أخطاء: ${title}`, questions: qs });
                    }}
                  />
                </div>
              )}
            </div>

            {/* Quiz Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              {!quizSubmitted ? (
                <>
                  <button
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-xs disabled:opacity-40 cursor-pointer"
                  >
                    السابق
                  </button>

                  {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                      className="px-5 py-2 bg-[#1677c7] text-white font-bold rounded-xl text-xs cursor-pointer"
                    >
                      التالي ←
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishQuiz}
                      className="px-6 py-2 bg-emerald-600 text-white font-black rounded-xl text-xs shadow-md shadow-emerald-700/20 cursor-pointer"
                    >
                      تسليم الإجابات وإنهاء الاختبار ✓
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="w-full py-2.5 bg-[#0f233a] text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  إغلاق ومتابعة الدروس
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">المحتوى الأكاديمي واختبارات المستوى</h2>
          <p className="text-xs text-slate-500">دروس تفاعلية، اختبارات ذكية، بنك أسئلة، وتقارير أداء شاملة</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(currentRole === 'teacher' || currentRole === 'admin') && (
            <button
              type="button"
              onClick={() => setShowQuestionBank(true)}
              className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Library className="w-3.5 h-3.5 text-[#1677c7]" />
              <span>بنك الأسئلة ({loadQuestionBank(currentUserId).length})</span>
            </button>
          )}
          {canBuild && (
            <div className="flex items-center gap-2 text-xs font-bold">
              <button onClick={() => setShowLessonBuilder(true)} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer whitespace-nowrap">+ درس</button>
              <button
                onClick={() => {
                  setQuizBuilderPreset(null);
                  setShowQuizBuilder(true);
                }}
                className="px-3 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white rounded-xl cursor-pointer whitespace-nowrap"
              >
                + اختبار
              </button>
            </div>
          )}

          {/* Tab switch */}
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold flex-wrap">
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'quizzes' ? 'bg-white text-[#1677c7] shadow-xs' : 'text-slate-600'
              }`}
            >
              الاختبارات ({quizzes.length})
            </button>
            <button
              onClick={() => setActiveTab('lessons')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'lessons' ? 'bg-white text-[#1677c7] shadow-xs' : 'text-slate-600'
              }`}
            >
              الدروس ({lessons.length})
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'courses' ? 'bg-white text-[#1677c7] shadow-xs' : 'text-slate-600'
              }`}
            >
              الدورات ({courses.length})
            </button>
            {(currentRole === 'teacher' || currentRole === 'admin') && (
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  activeTab === 'analytics' ? 'bg-white text-[#1677c7] shadow-xs' : 'text-slate-600'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>تحليلات المعلم</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {showLessonBuilder && (
        <LessonBuilderModal classes={myClasses} teacherName={currentUserName} onClose={() => setShowLessonBuilder(false)} onSubmit={onAddLesson} onUpload={onUpload} />
      )}
      {showQuizBuilder && (
        <QuizBuilderModal
          classes={myClasses}
          userId={currentUserId}
          initialTitle={quizBuilderPreset?.title}
          initialQuestions={quizBuilderPreset?.questions}
          onClose={() => {
            setShowQuizBuilder(false);
            setQuizBuilderPreset(null);
          }}
          onSubmit={onAddQuiz}
        />
      )}
      {showQuestionBank && (
        <QuestionBankModal
          userId={currentUserId}
          quizzes={quizzes}
          onClose={() => setShowQuestionBank(false)}
          onCreateQuizFromBank={(qs, suggestedTitle) => {
            setShowQuestionBank(false);
            if (myClasses.length > 0) {
              setQuizBuilderPreset({ title: suggestedTitle, questions: qs });
              setShowQuizBuilder(true);
            }
          }}
          onPrintQuestions={(title, qs) => {
            setShowQuestionBank(false);
            setPrintExam({ title, questions: qs });
          }}
        />
      )}
      {printExam && (
        <PrintableExamModal
          title={printExam.title}
          classTitle={printExam.classTitle}
          defaultMinistryName={printExam.defaultMinistryName}
          defaultSchoolName={printExam.defaultSchoolName}
          timeLimitMinutes={printExam.timeLimitMinutes}
          questions={printExam.questions}
          onClose={() => setPrintExam(null)}
        />
      )}
      {challengeData && (
        <MistakeChallengeModal
          title={challengeData.title}
          mistakes={challengeData.questions}
          onClose={() => setChallengeData(null)}
          onRewardPoints={onRewardPoints}
        />
      )}

      {((activeTab === 'quizzes' && quizzes.length === 0) || (activeTab === 'lessons' && lessons.length === 0) || (activeTab === 'courses' && courses.length === 0)) && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
          لا يوجد محتوى هنا بعد. انضم إلى صف باستخدام رمز الانضمام{canBuild ? '، أو أضف درساً أو اختباراً من الأزرار أعلاه' : ' ليظهر لك محتواه'}.
        </div>
      )}

      {/* TEACHER ANALYTICS TAB */}
      {activeTab === 'analytics' && (currentRole === 'teacher' || currentRole === 'admin') && (
        <TeacherAnalyticsPanel
          quizzes={quizzes}
          classes={classes}
          assignments={assignments}
          submissions={submissions}
          currentUserId={currentUserId}
        />
      )}

      {/* QUIZZES TAB */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          {currentRole === 'student' && allStudentMistakes.length > 0 && (
            <div className="bg-white border border-amber-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5 text-xs">
                <span className="font-black text-slate-900 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>وضع التحدي التفاعلي: حوّل أخطاءك السابقة إلى نقاط قوة</span>
                </span>
                <p className="text-slate-600">
                  لديك <strong className="tabular-nums">{allStudentMistakes.length}</strong> سؤال لم تجب عنه بشكل صحيح في اختباراتك السابقة — أعد حلّها واكسب +15 XP لكل سؤال تتقنه.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setChallengeData({ title: 'تحدي مراجعة الأخطاء الشامل', questions: allStudentMistakes })}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Flame className="w-4 h-4" />
                <span>ابدأ التحدي الآن</span>
              </button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {quizzes.map((q) => {
              const isOwnerOrAdmin = currentRole === 'admin' || classes.find(c => c.id === q.class_id)?.teacher_id === currentUserId;
              const typesInQuiz = [...new Set(q.questions.map(qq => qq.type || 'mcq'))] as QuizQuestionType[];
              const pendingReviewCount = (q.attempts || []).filter(a => a.needsManualGrading).length;
              return (
                <div 
                  key={q.id} 
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-[#1677c7] transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {typesInQuiz.includes('essay') ? 'تصحيح آلي + مراجعة المعلم' : 'تصحيح تلقائي فوري'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {q.timeLimitMinutes} دقائق
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base">{q.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{q.description}</p>

                    {typesInQuiz.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {typesInQuiz.map(t => (
                          <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {QUIZ_TYPE_META[t]?.badge || t}
                          </span>
                        ))}
                      </div>
                    )}

                    {q.teacherFeedback && (
                      <p className="text-[11px] bg-sky-50 text-[#0f233a] p-2 rounded-xl border border-sky-100">
                        <strong>ملاحظة المعلم:</strong> {q.teacherFeedback}
                      </p>
                    )}

                    {q.attempted && q.questionFeedback && Object.keys(q.questionFeedback).length > 0 && (
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-100">
                        {Object.values(q.questionFeedback).some(f => f.audio_url) ? (
                          <Volume2 className="w-3.5 h-3.5" />
                        ) : (
                          <MessageSquare className="w-3.5 h-3.5" />
                        )}
                        <span>
                          أضاف المعلم تغذية راجعة على {Object.keys(q.questionFeedback).length}{' '}
                          {Object.keys(q.questionFeedback).length === 1 ? 'سؤال' : 'أسئلة'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-400">
                      الأسئلة: <strong>{q.questions.length}</strong> · إنجاز: <strong>{q.attemptsCount}</strong>
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {q.questions.length > 0 && (() => {
                        const qCls = classes.find(c => c.id === q.class_id);
                        const qSchool = qCls?.school_id ? schools.find(s => s.id === qCls.school_id) : undefined;
                        const qMinistry = qSchool?.ministry_id ? ministries.find(m => m.id === qSchool.ministry_id) : undefined;
                        return (
                          <>
                            <button
                              type="button"
                              onClick={() => downloadQuizAsWordDoc({
                                title: q.title,
                                classTitle: q.class_title,
                                ministryName: qMinistry?.name || 'وزارة التربية والتعليم / المجمع التعليمي',
                                schoolName: qSchool?.name || 'منصة NEMVIA التعليمية',
                                instructions: q.description || 'اقرأ كل سؤال بعناية ثم أجب في المكان المخصص.',
                                timeLimitMinutes: q.timeLimitMinutes,
                                questions: q.questions,
                                withAnswers: false,
                              })}
                              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold rounded-xl cursor-pointer flex items-center gap-1"
                              title="تنزيل ورقة الاختبار بصيغة Microsoft Word (.doc)"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Word</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setPrintExam({
                                title: q.title,
                                classTitle: q.class_title,
                                defaultMinistryName: qMinistry?.name,
                                defaultSchoolName: qSchool?.name,
                                timeLimitMinutes: q.timeLimitMinutes,
                                questions: q.questions,
                              })}
                              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold rounded-xl cursor-pointer flex items-center gap-1"
                              title="معاينة وطباعة الاختبار أو تعديل الترويسة"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>معاينة / PDF</span>
                            </button>
                          </>
                        );
                      })()}
                      {isOwnerOrAdmin && (
                        <>
                          <button
                            onClick={() => openGradingModal(q)}
                            className="px-3 py-2 bg-sky-50 hover:bg-sky-100 text-[#1677c7] font-bold rounded-xl cursor-pointer flex items-center gap-1"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>الإجابات ({q.attemptsCount})</span>
                            {pendingReviewCount > 0 && (
                              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">{pendingReviewCount}</span>
                            )}
                          </button>
                          <button onClick={() => onDeleteQuiz(q.id)} className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl cursor-pointer">حذف</button>
                        </>
                      )}
                      {q.attempted ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-3 py-2 border font-bold rounded-xl ${
                            q.needsManualGrading
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {q.needsManualGrading ? `بانتظار التصحيح · ${q.myScore}` : `تم الحل ✓ · نتيجتك ${q.myScore}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => setReportQuizId(q.id)}
                            className="px-3.5 py-2 bg-[#0f233a] hover:bg-[#1677c7] text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors"
                          >
                            <BarChart3 className="w-3.5 h-3.5" />
                            <span>تقرير الأداء</span>
                          </button>
                        </div>
                      ) : q.questions.length === 0 ? (
                        <span className="text-slate-400">لا توجد أسئلة</span>
                      ) : (
                        <button
                          onClick={() => handleStartQuiz(q)}
                          className="px-4 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>ابدأ الاختبار الآن</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Student Standalone Performance Report Modal */}
      {reportQuiz && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl" onClick={() => setReportQuizId(null)}>
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-5 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#1677c7] font-bold block">تحليل الأداء ونقاط القوة والضعف</span>
                <h3 className="font-black text-base sm:text-lg">{reportQuiz.title}</h3>
              </div>
              <button type="button" onClick={() => setReportQuizId(null)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto space-y-4">
              <QuizPerformanceReportPanel
                quiz={reportQuiz}
                report={buildQuizPerformanceReport(reportQuiz, reportQuiz.myAnswers || {}, null, reportQuiz.questionFeedback)}
                teacherFeedback={reportQuiz.teacherFeedback}
                onStartChallenge={qs => {
                  const title = reportQuiz.title;
                  setReportQuizId(null);
                  setChallengeData({ title: `تحدي أخطاء: ${title}`, questions: qs });
                }}
              />
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setReportQuizId(null)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                إغلاق التقرير
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Quiz Attempts & Grading Modal */}
      {gradingQuiz && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl" onClick={closeGradingModal}>
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-5 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between">
              <div>
                <h3 className="font-black text-base">إجابات وتصحيح: {gradingQuiz.title}</h3>
                <p className="text-[11px] text-slate-500">
                  {(gradingQuiz.attempts || []).length} محاولة · الدرجة الكاملة: {gradingQuiz.questions.reduce((s, x) => s + x.points, 0)} · يدعم التغذية النصية والصوتية والمساعدة بالذكاء
                </p>
              </div>
              <button type="button" onClick={closeGradingModal} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 overflow-y-auto space-y-4">
              {audioError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-between gap-2">
                  <span>{audioError}</span>
                  <button type="button" onClick={() => setAudioError(null)} className="text-rose-500 hover:text-rose-800 cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
              )}

              {(gradingQuiz.attempts || []).length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-8">لم يحلّ أي طالب هذا الاختبار بعد.</p>
              ) : (
                (gradingQuiz.attempts || []).map(att => {
                  const edit = attemptEdits[att.id] || {
                    score: String(att.score),
                    feedback: att.teacherFeedback || '',
                    questionFeedback: att.questionFeedback || {},
                  };
                  return (
                    <div key={att.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                        <div>
                          <span className="font-black text-slate-900 text-sm">{att.student_name}</span>
                          <span className="text-[11px] text-slate-400 mr-2">{new Date(att.submitted_at).toLocaleString('ar')}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          att.needsManualGrading ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {att.needsManualGrading ? 'بانتظار تصحيح المقالي' : 'مُصحّح'}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {gradingQuiz.questions.map((qq, idx) => {
                          const qType = qq.type || 'mcq';
                          const ans = att.answers?.[qq.id];
                          const displayAns = formatQuestionAnswerText(qq, ans);
                          const qFb = edit.questionFeedback[qq.id] || {};
                          const targetKey = `${att.id}:${qq.id}`;
                          const isRecordingThis = recordingTarget?.attemptId === att.id && recordingTarget?.questionId === qq.id;
                          const isUploadingThis = uploadingAudioKey === targetKey;

                          return (
                            <div key={qq.id} className="p-3 bg-white rounded-2xl border border-slate-200/90 space-y-2.5">
                              <div className="flex items-start justify-between gap-2 font-bold text-slate-800">
                                <span>{idx + 1}. {qq.question}</span>
                                <span className="text-[10px] text-slate-500 shrink-0">
                                  {QUIZ_TYPE_META[qType].badge} ({qq.points} ن)
                                </span>
                              </div>
                              <p className="text-slate-700 whitespace-pre-line">
                                <strong className="text-[#1677c7]">إجابة الطالب:</strong> {displayAns}
                              </p>

                              {/* الإجابة الصحيحة / النموذجية لمساعدة المعلم أثناء التصحيح */}
                              {(qType === 'mcq' || qType === 'true_false') && qq.correctOptionIndex >= 0 && (
                                <p className="text-[11px] text-emerald-700">
                                  <strong>الإجابة الصحيحة:</strong> {qq.options[qq.correctOptionIndex] ?? '—'}
                                </p>
                              )}
                              {qType === 'multi_select' && qq.correctOptionIndices?.length ? (
                                <p className="text-[11px] text-emerald-700">
                                  <strong>الإجابات الصحيحة:</strong> {qq.correctOptionIndices.map(i => qq.options[i]).join('، ')}
                                </p>
                              ) : null}
                              {(qType === 'short_answer' || qType === 'fill_blank') && qq.acceptedAnswers?.length ? (
                                <p className="text-[11px] text-emerald-700">
                                  <strong>الإجابات المقبولة:</strong> {qq.acceptedAnswers.join(' / ')}
                                </p>
                              ) : null}
                              {qType === 'essay' && qq.modelAnswer && (
                                <p className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg">
                                  <strong>الإجابة النموذجية:</strong> {qq.modelAnswer}
                                </p>
                              )}

                              {/* التغذية الراجعة النصية والصوتية ودرجة السؤال */}
                              <div className="pt-2 border-t border-slate-100 space-y-2 bg-slate-50/70 p-2.5 rounded-xl">
                                <div className="grid sm:grid-cols-4 gap-2 items-start">
                                  <div className="relative">
                                    <input
                                      type="number"
                                      min={0}
                                      max={qq.points}
                                      step="0.5"
                                      value={qFb.points_awarded ?? ''}
                                      onChange={e => {
                                        const val = e.target.value;
                                        updateQuestionFeedback(att.id, qq.id, {
                                          points_awarded: val === '' ? undefined : Math.max(0, Math.min(qq.points, Number(val))),
                                        });
                                      }}
                                      placeholder={`من ${qq.points}`}
                                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#1677c7]"
                                      title="درجة هذا السؤال"
                                    />
                                    <span className="absolute left-2 top-2 text-[10px] text-slate-400">/{qq.points}</span>
                                  </div>
                                  <textarea
                                    rows={1}
                                    value={qFb.text || ''}
                                    onChange={e => updateQuestionFeedback(att.id, qq.id, { text: e.target.value })}
                                    placeholder="تغذية راجعة نصية لهذا السؤال (اختياري)..."
                                    className="sm:col-span-3 w-full p-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
                                  />
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  {isRecordingThis ? (
                                    <button
                                      type="button"
                                      onClick={stopAudioRecording}
                                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer animate-pulse"
                                    >
                                      <Square className="w-3 h-3 fill-current" />
                                      <span>إيقاف التسجيل ({Math.floor(recordSeconds / 60)}:{(recordSeconds % 60).toString().padStart(2, '0')})</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      disabled={isUploadingThis}
                                      onClick={() => startAudioRecording(att.id, qq.id)}
                                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                    >
                                      <Mic className="w-3.5 h-3.5" />
                                      <span>تسجيل ملاحظة صوتية</span>
                                    </button>
                                  )}

                                  <label className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>رفع ملف صوتي</span>
                                    <input
                                      type="file"
                                      accept="audio/*"
                                      className="hidden"
                                      onChange={e => {
                                        const f = e.target.files?.[0];
                                        e.target.value = '';
                                        void handleAudioFilePick(att.id, qq.id, f);
                                      }}
                                    />
                                  </label>

                                  <button
                                    type="button"
                                    disabled={aiDraftKey === targetKey}
                                    onClick={() => handleAiDraftFeedback(att, qq)}
                                    className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#1677c7] border border-sky-200 rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                  >
                                    {aiDraftKey === targetKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                    <span>{aiDraftKey === targetKey ? 'جاري الصياغة...' : 'صياغة بالذكاء'}</span>
                                  </button>

                                  {isUploadingThis && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1677c7]">
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      <span>جاري رفع الصوت...</span>
                                    </span>
                                  )}
                                </div>

                                {qFb.audio_url && (
                                  <div className="space-y-2 bg-white p-2.5 rounded-xl border border-indigo-200">
                                    <div className="flex items-center gap-2">
                                      <Volume2 className="w-4 h-4 text-indigo-600 shrink-0" />
                                      <audio controls preload="metadata" src={qFb.audio_url} className="w-full h-8" />
                                      <button
                                        type="button"
                                        disabled={transcribingKey === targetKey}
                                        onClick={() => handleManualTranscribeUrl(att.id, qq.id, qFb.audio_url!)}
                                        className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer shrink-0 disabled:opacity-50"
                                        title="تحويل التسجيل الصوتي إلى نص مكتوب بالذكاء"
                                      >
                                        {transcribingKey === targetKey ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                        <span>{transcribingKey === targetKey ? 'تفريغ...' : 'تفريغ لنص'}</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => updateQuestionFeedback(att.id, qq.id, { audio_url: undefined, transcript: undefined })}
                                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer shrink-0"
                                        title="حذف التسجيل الصوتي"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                    {(qFb.transcript !== undefined || transcribingKey === targetKey) && (
                                      <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-indigo-700 block">
                                          النص المفرّغ من التسجيل الصوتي (يظهر للطالب ويمكنك تعديله):
                                        </span>
                                        <textarea
                                          rows={2}
                                          value={qFb.transcript || ''}
                                          onChange={e => updateQuestionFeedback(att.id, qq.id, { transcript: e.target.value })}
                                          placeholder={transcribingKey === targetKey ? 'جاري تحويل الصوت إلى نص...' : 'النص المكتوب للتسجيل الصوتي...'}
                                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] outline-none focus:border-[#1677c7]"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="grid sm:grid-cols-5 gap-2 pt-2 items-center">
                        <div className="relative sm:col-span-1">
                          <input
                            type="number"
                            min={0}
                            step="0.5"
                            value={edit.score}
                            onChange={e => setAttemptEdits(prev => ({ ...prev, [att.id]: { ...edit, score: e.target.value } }))}
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold outline-none focus:border-[#1677c7]"
                            placeholder="الدرجة"
                          />
                          <span className="absolute left-2.5 top-2.5 text-[10px] text-slate-400">درجة</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => sumAttemptPointsFromQuestions(gradingQuiz, att)}
                          className="py-2.5 px-2.5 bg-sky-50 hover:bg-sky-100 text-[#1677c7] border border-sky-200 font-bold rounded-xl cursor-pointer text-[11px]"
                          title="حساب المجموع الكلي من درجات الأسئلة أعلاه"
                        >
                          جمع نقاط الأسئلة
                        </button>
                        <input
                          value={edit.feedback}
                          onChange={e => setAttemptEdits(prev => ({ ...prev, [att.id]: { ...edit, feedback: e.target.value } }))}
                          placeholder="ملاحظة عامة للطالب (اختياري)"
                          className="sm:col-span-2 p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
                        />
                        <button
                          type="button"
                          disabled={savingAttemptId === att.id || uploadingAudioKey !== null}
                          onClick={() => saveAttemptGrade(att)}
                          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1"
                        >
                          <PenLine className="w-3.5 h-3.5" />
                          <span>{savingAttemptId === att.id ? 'جاري الحفظ...' : 'حفظ الدرجة والتغذية'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* LESSONS TAB */}
      {activeTab === 'lessons' && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {lessons.map((ls) => (
              <div key={ls.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                    درس تفاعلي
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{ls.duration || ''}</span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base">{ls.title}</h3>
                <p className={`text-xs text-slate-600 leading-relaxed whitespace-pre-line ${selectedLesson?.id === ls.id ? '' : 'line-clamp-3'}`}>
                  {ls.content}
                </p>
                {selectedLesson?.id === ls.id && ls.video_url && (
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-900">
                    <iframe src={ls.video_url} title={ls.title} className="w-full h-full" allowFullScreen
                      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" />
                  </div>
                )}
                {selectedLesson?.id === ls.id && ls.attachment_url && (
                  <a href={ls.attachment_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-sky-50 text-[#1677c7] font-bold rounded-xl text-xs">
                    <Download className="w-3.5 h-3.5" /> تحميل المرفق: {ls.attachment_name}
                  </a>
                )}

                {selectedLesson?.id === ls.id && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-black text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#1677c7]" />
                        <span>تلخيص وأسئلة مراجعة بالذكاء الاصطناعي</span>
                      </span>
                      <button
                        type="button"
                        disabled={lessonAiLoadingId === ls.id}
                        onClick={() => handleSummarizeLesson(ls)}
                        className="px-3 py-1.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-50 text-white font-bold rounded-lg text-[11px] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        {lessonAiLoadingId === ls.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>{lessonSummaries[ls.id] ? 'تحديث الملخص' : 'لخّص الدرس الآن'}</span>
                      </button>
                    </div>

                    {lessonAiError[ls.id] && (
                      <p className="text-[11px] text-rose-600 font-bold">{lessonAiError[ls.id]}</p>
                    )}

                    {lessonSummaries[ls.id] && (
                      <div className="space-y-2.5 pt-1">
                        <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                          {lessonSummaries[ls.id].summary}
                        </p>
                        {lessonSummaries[ls.id].keyPoints.length > 0 && (
                          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                            <span className="font-black text-slate-800 block text-[11px]">أهم النقاط الرئيسية:</span>
                            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                              {lessonSummaries[ls.id].keyPoints.map((pt, idx) => (
                                <li key={idx}>{pt}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {lessonSummaries[ls.id].checkQuestions.length > 0 && (
                          <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-200 space-y-2">
                            <span className="font-black text-[#0f233a] block text-[11px]">أسئلة تحقق سريعة مع الحل:</span>
                            {lessonSummaries[ls.id].checkQuestions.map((cq, idx) => (
                              <div key={idx} className="text-[11px] space-y-0.5 border-b last:border-none border-sky-100 pb-1.5 last:pb-0">
                                <p className="font-bold text-slate-900">س{idx + 1}: {cq.question}</p>
                                <p className="text-emerald-800">ج: {cq.answer}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">الأستاذ: {ls.teacher_name}</span>
                  <div className="flex items-center gap-2">
                    {(ls.teacher_id === currentUserId || currentRole === 'admin') && (
                      <button onClick={() => onDeleteLesson(ls.id)} className="text-rose-600 font-bold cursor-pointer">حذف</button>
                    )}
                    <button onClick={() => setSelectedLesson(selectedLesson?.id === ls.id ? null : ls)} className="text-[#1677c7] font-bold cursor-pointer">
                      {selectedLesson?.id === ls.id ? 'إخفاء' : 'فتح الدرس'}
                    </button>
                  </div>
                  {ls.attachment_name && (
                    <span className="text-[11px] text-[#1677c7] font-bold flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {ls.attachment_name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COURSES TAB */}
      {activeTab === 'courses' && (
        <div className="grid md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
              <div className="h-40 relative overflow-hidden bg-slate-100">
                <img src={c.image_url} alt={c.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 bg-[#0f233a]/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  {c.category}
                </span>
              </div>

              <div className="p-5 space-y-2.5">
                <h3 className="font-extrabold text-slate-900 text-base">{c.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{c.lessons_count} دروس · {c.students_count} طالب مسجل</span>
                  <span className="font-bold text-amber-500">★ {c.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
