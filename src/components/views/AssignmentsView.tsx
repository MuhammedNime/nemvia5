import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Upload, 
  Send, 
  Award, 
  Check, 
  AlertCircle,
  Sparkles,
  MessageSquare,
  FileUp,
  X,
  ExternalLink,
  Download,
  Loader2,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import { AppRole, Assignment, Submission, ClassItem } from '../../types';
import { UploadedFile } from '../../lib/api';
import { reviewAssignmentAI, AssignmentReviewResult } from '../../lib/ai';

interface AssignmentsViewProps {
  currentRole: AppRole;
  currentUserId: string;
  currentUserName: string;
  assignments: Assignment[];
  submissions: Submission[];
  onSubmitAssignment: (submission: Submission) => void;
  onGradeSubmission: (submissionId: string, grade: number, feedback: string) => void;
  classes: ClassItem[];
  onCreateAssignment: (a: { class_id: string; title: string; instructions: string; due_at: string; total_points: number }) => Promise<boolean>;
  onUpload: (f: File, folder: string) => Promise<UploadedFile>;
  onDeleteAssignment: (id: string) => void;
}

interface AttachedFileInfo {
  name: string;
  size: string;
  type: string;
  url: string;
}

function normalizeForSimilarity(text: string): string {
  return (text || '')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildShingles(text: string): Set<string> {
  const norm = normalizeForSimilarity(text);
  const words = norm.split(' ').filter(w => w.length >= 2);
  const set = new Set<string>();
  for (let i = 0; i < words.length; i++) {
    set.add(words[i]);
    if (i < words.length - 1) set.add(`${words[i]} ${words[i + 1]}`);
  }
  return set;
}

interface SimilarityMatch {
  otherId: string;
  otherName: string;
  percent: number;
  sharedWords: string[];
}

function computeSimilarityMap(subs: Submission[]): {
  bySubId: Record<string, SimilarityMatch | undefined>;
  flaggedPairs: Array<{ aName: string; bName: string; percent: number }>;
} {
  const tokens = subs.map(s => ({ sub: s, shingles: buildShingles(s.answer_text) }));
  const bySubId: Record<string, SimilarityMatch | undefined> = {};
  const flaggedPairs: Array<{ aName: string; bName: string; percent: number }> = [];

  for (let i = 0; i < tokens.length; i++) {
    for (let j = i + 1; j < tokens.length; j++) {
      const a = tokens[i];
      const b = tokens[j];
      if (a.shingles.size < 4 || b.shingles.size < 4) continue;
      const shared: string[] = [];
      a.shingles.forEach(tok => {
        if (b.shingles.has(tok)) shared.push(tok);
      });
      const unionSize = a.shingles.size + b.shingles.size - shared.length;
      if (unionSize <= 0) continue;
      const pct = Math.round((shared.length / unionSize) * 100);
      if (pct >= 35) {
        flaggedPairs.push({
          aName: a.sub.student_name,
          bName: b.sub.student_name,
          percent: pct,
        });
      }
      const prevA = bySubId[a.sub.id];
      if (!prevA || pct > prevA.percent) {
        bySubId[a.sub.id] = {
          otherId: b.sub.id,
          otherName: b.sub.student_name,
          percent: pct,
          sharedWords: shared.filter(w => !w.includes(' ')).slice(0, 5),
        };
      }
      const prevB = bySubId[b.sub.id];
      if (!prevB || pct > prevB.percent) {
        bySubId[b.sub.id] = {
          otherId: a.sub.id,
          otherName: a.sub.student_name,
          percent: pct,
          sharedWords: shared.filter(w => !w.includes(' ')).slice(0, 5),
        };
      }
    }
  }

  flaggedPairs.sort((x, y) => y.percent - x.percent);
  return { bySubId, flaggedPairs };
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  currentRole,
  currentUserId,
  currentUserName,
  assignments,
  submissions,
  onSubmitAssignment,
  onGradeSubmission,
  classes,
  onCreateAssignment,
  onUpload,
  onDeleteAssignment,
}) => {
  const [showCreate, setShowCreate] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [nClass, setNClass] = useState('');
  const [nTitle, setNTitle] = useState('');
  const [nInstr, setNInstr] = useState('');
  const [nDue, setNDue] = useState('');
  const [nPoints, setNPoints] = useState(20);
  const myClasses = classes.filter(c => c.teacher_id === currentUserId);
  const canCreate = (currentRole === 'teacher' || currentRole === 'admin') && myClasses.length > 0;
  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onCreateAssignment({
      class_id: nClass || myClasses[0].id, title: nTitle.trim(), instructions: nInstr.trim(),
      due_at: nDue ? new Date(nDue).toISOString() : new Date(Date.now() + 7 * 864e5).toISOString(),
      total_points: Math.max(1, nPoints),
    });
    if (ok) { setShowCreate(false); setNTitle(''); setNInstr(''); setNDue(''); }
  };
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(assignments[0]?.id || null);
  const [solutionText, setSolutionText] = useState('');
  const [attachedFile, setAttachedFile] = useState<AttachedFileInfo | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Teacher per-submission grading & AI review state
  const [gradeEdits, setGradeEdits] = useState<Record<string, { score: string; feedback: string }>>({});
  const [gradedSuccess, setGradedSuccess] = useState(false);
  const [aiReviews, setAiReviews] = useState<Record<string, AssignmentReviewResult>>({});
  const [aiReviewingId, setAiReviewingId] = useState<string | null>(null);
  const [aiReviewError, setAiReviewError] = useState<Record<string, string>>({});
  const [showSimilarityPanel, setShowSimilarityPanel] = useState(false);

  const selectedAssignment = assignments.find(a => a.id === activeAssignmentId) || assignments[0];
  const userSubmission = submissions.find(s => s.assignment_id === selectedAssignment?.id && s.student_id === currentUserId);
  const classSubmissions = submissions.filter(s => s.assignment_id === selectedAssignment?.id);
  const similarityReport = React.useMemo(
    () => (classSubmissions.length >= 2 ? computeSimilarityMap(classSubmissions) : { bySubId: {}, flaggedPairs: [] }),
    [classSubmissions],
  );

  // Handle real file selection from user device
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const up = await onUpload(file, 'submissions');
      setAttachedFile({ name: up.name, size: up.size, type: file.type, url: up.url });
    } catch { /* الرسالة تظهر من الواجهة الرئيسية */ }
    setUploading(false);
  };

  const handleSubmitSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solutionText.trim() || !selectedAssignment) return;
    const newSub: Submission = {
      id: `sub-${Date.now()}`,
      assignment_id: selectedAssignment.id,
      student_id: currentUserId,
      student_name: currentUserName,
      answer_text: solutionText.trim(),
      attachment_url: attachedFile ? attachedFile.url : undefined,
      submitted_at: new Date().toISOString(),
    };
    onSubmitAssignment(newSub);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const getSubEdit = (sub: Submission) => {
    const cur = gradeEdits[sub.id];
    const maxPts = selectedAssignment?.total_points ?? 20;
    return {
      score: cur?.score ?? String(sub.grade ?? maxPts),
      feedback: cur?.feedback ?? (sub.teacher_feedback || ''),
    };
  };

  const handleTeacherGrade = (sub: Submission) => {
    const edit = getSubEdit(sub);
    const maxPts = selectedAssignment?.total_points ?? 100;
    const numeric = Math.max(0, Math.min(maxPts, parseFloat(edit.score) || 0));
    onGradeSubmission(sub.id, numeric, edit.feedback.trim() || 'عمل ممتاز ومتقن!');
    setGradedSuccess(true);
    setTimeout(() => setGradedSuccess(false), 2500);
  };

  const handleAiReviewSubmission = async (sub: Submission) => {
    if (!selectedAssignment || aiReviewingId === sub.id) return;
    setAiReviewingId(sub.id);
    setAiReviewError(prev => {
      const next = { ...prev };
      delete next[sub.id];
      return next;
    });
    try {
      const result = await reviewAssignmentAI({
        assignmentTitle: selectedAssignment.title,
        instructions: selectedAssignment.instructions,
        totalPoints: selectedAssignment.total_points,
        studentAnswer: sub.answer_text,
        attachmentUrl: sub.attachment_url,
      });
      setAiReviews(prev => ({ ...prev, [sub.id]: result }));
      setGradeEdits(prev => ({
        ...prev,
        [sub.id]: {
          score: String(result.suggestedGrade),
          feedback: result.feedback,
        },
      }));
    } catch (err: any) {
      setAiReviewError(prev => ({ ...prev, [sub.id]: err?.message || 'تعذّر مراجعة الواجب بالذكاء الاصطناعي.' }));
    } finally {
      setAiReviewingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">الواجبات الدراسية والتسليمات</h2>
          <p className="text-xs text-slate-500">حل المهام الأسبوعية، إرفاق ملفات حقيقية، واستلام التقييمات والدرجات</p>
        </div>
        {canCreate && (
          <button onClick={() => setShowCreate(true)} className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs cursor-pointer">+ إنشاء واجب</button>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={submitCreate} className="bg-white rounded-3xl w-full max-w-lg p-6 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900">واجب جديد</h3>
              <button type="button" onClick={() => setShowCreate(false)} className="p-1 text-slate-400 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <select value={nClass || myClasses[0]?.id} onChange={e => setNClass(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              {myClasses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <input value={nTitle} onChange={e => setNTitle(e.target.value)} placeholder="عنوان الواجب" required maxLength={150} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
            <textarea value={nInstr} onChange={e => setNInstr(e.target.value)} placeholder="التعليمات" rows={4} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" />
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={nDue} onChange={e => setNDue(e.target.value)} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" title="موعد التسليم" />
              <input type="number" min={1} max={1000} value={nPoints} onChange={e => setNPoints(Number(e.target.value))} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs" title="الدرجة الكاملة" />
            </div>
            <button type="submit" className="w-full py-3 bg-[#1677c7] text-white font-black rounded-xl text-sm cursor-pointer">نشر الواجب</button>
          </form>
        </div>
      )}

      {assignments.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
          لا توجد واجبات بعد. انضم إلى صف باستخدام رمز الانضمام{canCreate ? '، أو أنشئ واجباً جديداً' : ' لتظهر واجباتك هنا'}.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Assignments List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold text-slate-600 block">قائمة الواجبات المطلوبة:</span>
          {assignments.map(asg => {
            const isSelected = selectedAssignment?.id === asg.id;
            const hasSubmitted = submissions.some(s => s.assignment_id === asg.id && s.student_id === currentUserId);
            return (
              <div
                key={asg.id}
                onClick={() => setActiveAssignmentId(asg.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-sky-50/80 border-[#1677c7] shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {asg.class_title}
                  </span>
                  <span className="text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(asg.due_at).toLocaleDateString('ar')}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{asg.title}</h4>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">الدرجة: {asg.total_points} علامة</span>
                  {hasSubmitted ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>تم التسليم</span>
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold text-[11px]">بانتظار الحل</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Active Assignment Detail & Submission / Grading */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          {selectedAssignment ? (
            <>
              {/* Assignment Overview */}
              <div className="space-y-2 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1677c7] bg-sky-50 px-2.5 py-0.5 rounded-full">
                    {selectedAssignment.class_title}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-3">
                    المعلم: {selectedAssignment.teacher_name}
                    {(selectedAssignment.teacher_id === currentUserId || currentRole === 'admin') && (
                      <button
                        onClick={() => { onDeleteAssignment(selectedAssignment.id); setActiveAssignmentId(null); }}
                        className="text-rose-600 font-bold cursor-pointer"
                      >
                        حذف الواجب
                      </button>
                    )}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900">{selectedAssignment.title}</h3>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed space-y-1">
                  <span className="font-bold text-slate-900 block">تعليمات الواجب:</span>
                  <p>{selectedAssignment.instructions}</p>
                </div>
              </div>

              {/* STUDENT WORKFLOW */}
              {currentRole === 'student' && (
                <div className="space-y-4">
                  {userSubmission ? (
                    // Already Submitted
                    <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>تم تسليم هذا الواجب بنجاح!</span>
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(userSubmission.submitted_at).toLocaleDateString('ar')}
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs text-slate-800 space-y-2">
                        <span className="font-bold text-slate-500 block mb-1">إجابتك المسلمة:</span>
                        <p className="whitespace-pre-line leading-relaxed">{userSubmission.answer_text}</p>

                        {userSubmission.attachment_url && (
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] text-slate-600 flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5 text-[#1677c7]" />
                              <span>الملف المرفق بالحل</span>
                            </span>
                            <a
                              href={userSubmission.attachment_url}
                              target="_blank"
                              rel="noreferrer"
                              download="حل_الواجب"
                              className="text-xs text-[#1677c7] font-bold hover:underline flex items-center gap-1"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>تحميل / معاينة الملف</span>
                            </a>
                          </div>
                        )}
                      </div>

                      {userSubmission.grade !== undefined ? (
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-amber-950 flex items-center gap-1">
                              <Award className="w-4 h-4 text-amber-600" />
                              <span>تقييم المعلم والدرجة:</span>
                            </span>
                            <span className="text-base font-black text-amber-900">
                              {userSubmission.grade} / {selectedAssignment.total_points}
                            </span>
                          </div>
                          {userSubmission.teacher_feedback && (
                            <p className="text-amber-900 leading-relaxed pt-1">
                              <strong>ملاحظات الأستاذ:</strong> {userSubmission.teacher_feedback}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 text-center font-medium">
                          قيد المراجعة والتصحيح من قبل أستاذ المادة ⏳
                        </p>
                      )}
                    </div>
                  ) : (
                    // Submit Form
                    <form onSubmit={handleSubmitSolution} className="space-y-3 text-xs">
                      <h4 className="font-bold text-slate-800">تسليم الحل الخاص بك:</h4>
                      <textarea
                        value={solutionText}
                        onChange={e => setSolutionText(e.target.value)}
                        placeholder="اكتب خطوات الحل أو كود البرنامج أو الشرح هنا بالتفصيل..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] min-h-[120px] text-xs leading-relaxed"
                        required
                      />

                      {/* Real File Upload Section */}
                      <div className="space-y-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*,.pdf,.doc,.docx,.txt"
                          className="hidden"
                        />

                        {attachedFile ? (
                          <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-[#1677c7] text-white flex items-center justify-center font-bold">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block truncate max-w-[200px] sm:max-w-xs">
                                  {attachedFile.name}
                                </span>
                                <span className="text-[10px] text-slate-500">{attachedFile.size}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={attachedFile.url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 text-[#1677c7] hover:bg-sky-100 rounded-md"
                                title="معاينة الملف"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <button
                                type="button"
                                onClick={() => setAttachedFile(null)}
                                className="p-1 text-rose-500 hover:bg-rose-50 rounded-md cursor-pointer"
                                title="حذف المرفق"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-[#1677c7] rounded-xl text-slate-600 hover:text-[#1677c7] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer bg-slate-50/50"
                          >
                            <FileUp className="w-4 h-4" />
                            <span>إرفاق ملف الحل من جهازك (PDF، صورة، Word)</span>
                          </button>
                        )}
                      </div>

                      {submitSuccess && (
                        <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-2 font-bold">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>تم إرسال حلك للمعلم بنجاح!</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>تسليم الواجب النهائي للمراجعة</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TEACHER WORKFLOW: Grading Desk */}
              {(currentRole === 'teacher' || currentRole === 'admin') && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-bold text-slate-800 text-sm">مكتب تصحيح حلول الطلاب ({classSubmissions.length})</h4>
                    <div className="flex items-center gap-2">
                      {classSubmissions.length >= 2 && (
                        <button
                          type="button"
                          onClick={() => setShowSimilarityPanel(p => !p)}
                          className={`px-3 py-1 rounded-xl text-[11px] font-bold border inline-flex items-center gap-1 cursor-pointer ${
                            similarityReport.flaggedPairs.length > 0
                              ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>
                            فحص تشابه الإجابات
                            {similarityReport.flaggedPairs.length > 0 ? ` (${similarityReport.flaggedPairs.length})` : ''}
                          </span>
                        </button>
                      )}
                      <span className="text-xs text-slate-500">الدرجة الكلية: {selectedAssignment.total_points}</span>
                    </div>
                  </div>

                  {showSimilarityPanel && classSubmissions.length >= 2 && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900">تقرير فحص تشابه الإجابات بين الطلاب</span>
                        <button
                          type="button"
                          onClick={() => setShowSimilarityPanel(false)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {similarityReport.flaggedPairs.length === 0 ? (
                        <p className="text-emerald-700 font-bold text-[11px]">
                          لم يُرصد أي تطابق مرتفع (≥ 35%) بين تسليمات الطلاب في هذا الواجب.
                        </p>
                      ) : (
                        <div className="space-y-1.5">
                          {similarityReport.flaggedPairs.map((pair, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-white border border-amber-200 flex items-center justify-between gap-2"
                            >
                              <span className="font-bold text-slate-800">
                                {pair.aName} ↔ {pair.bName}
                              </span>
                              <span
                                className={`font-black tabular-nums text-[11px] ${
                                  pair.percent >= 65 ? 'text-rose-600' : 'text-amber-700'
                                }`}
                              >
                                تشابه {pair.percent}%
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {classSubmissions.length > 0 ? (
                    <div className="space-y-3">
                      {classSubmissions.map(sub => {
                        const simMatch = similarityReport.bySubId[sub.id];
                        return (
                        <div key={sub.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-900">{sub.student_name}</span>
                              {simMatch && simMatch.percent >= 35 && (
                                <span
                                  className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${
                                    simMatch.percent >= 65
                                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                                      : 'bg-amber-50 text-amber-800 border-amber-200'
                                  }`}
                                >
                                  تشابه {simMatch.percent}% مع {simMatch.otherName}
                                </span>
                              )}
                            </div>
                            <span className="text-slate-400">
                              تاريخ التسليم: {new Date(sub.submitted_at).toLocaleDateString('ar')}
                            </span>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed space-y-2">
                            <p>{sub.answer_text}</p>
                            {sub.attachment_url && (
                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                  <FileText className="w-3.5 h-3.5 text-[#1677c7]" />
                                  <span>مرفق الطالب</span>
                                </span>
                                <a
                                  href={sub.attachment_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-[#1677c7] font-bold hover:underline flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>فتح الملف المرفق</span>
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Grading Inputs & AI Review */}
                          {(() => {
                            const edit = getSubEdit(sub);
                            const aiRev = aiReviews[sub.id];
                            const isReviewing = aiReviewingId === sub.id;
                            const revErr = aiReviewError[sub.id];

                            return (
                              <>
                                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                                  <button
                                    type="button"
                                    disabled={isReviewing}
                                    onClick={() => handleAiReviewSubmission(sub)}
                                    className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#1677c7] border border-sky-200 font-bold rounded-xl text-[11px] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                  >
                                    {isReviewing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                    <span>
                                      {isReviewing
                                        ? 'جاري تحليل الإجابة والملف...'
                                        : sub.attachment_url
                                          ? 'تقييم الحل والملف المرفق بالذكاء (AI)'
                                          : 'تقييم وصياغة ملاحظات بالذكاء (AI)'}
                                    </span>
                                  </button>
                                  {sub.grade !== undefined && (
                                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                      الدرجة المرصودة: {sub.grade} / {selectedAssignment.total_points}
                                    </span>
                                  )}
                                </div>

                                {revErr && (
                                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold flex items-center gap-1.5">
                                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                    <span>{revErr}</span>
                                  </div>
                                )}

                                {aiRev && (
                                  <div className="p-3 rounded-xl bg-white border border-sky-200 space-y-2 text-[11px]">
                                    <div className="flex items-center justify-between font-black text-slate-900">
                                      <span className="flex items-center gap-1.5 text-[#1677c7]">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>تحليل الذكاء الاصطناعي لحل الطالب</span>
                                      </span>
                                      <span className="text-emerald-700 tabular-nums">
                                        المقترح: {aiRev.suggestedGrade} / {selectedAssignment.total_points}
                                      </span>
                                    </div>
                                    {(aiRev.strengths.length > 0 || aiRev.improvements.length > 0) && (
                                      <div className="grid sm:grid-cols-2 gap-2">
                                        {aiRev.strengths.length > 0 && (
                                          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 space-y-1">
                                            <span className="font-bold text-emerald-800 block">نقاط القوة:</span>
                                            <ul className="list-disc list-inside text-emerald-900 space-y-0.5">
                                              {aiRev.strengths.map((st, idx) => <li key={idx}>{st}</li>)}
                                            </ul>
                                          </div>
                                        )}
                                        {aiRev.improvements.length > 0 && (
                                          <div className="p-2 rounded-lg bg-amber-50 border border-amber-100 space-y-1">
                                            <span className="font-bold text-amber-800 block">نقاط للتحسين:</span>
                                            <ul className="list-disc list-inside text-amber-950 space-y-0.5">
                                              {aiRev.improvements.map((im, idx) => <li key={idx}>{im}</li>)}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="pt-2 border-t border-slate-200 grid sm:grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <label className="block font-bold text-slate-600 mb-1">
                                      الدرجة المستحقة (من {selectedAssignment.total_points}):
                                    </label>
                                    <input
                                      type="number"
                                      max={selectedAssignment.total_points}
                                      min={0}
                                      step="0.5"
                                      value={edit.score}
                                      onChange={e => setGradeEdits(prev => ({
                                        ...prev,
                                        [sub.id]: { ...edit, score: e.target.value },
                                      }))}
                                      className="w-full p-2 bg-white border border-slate-200 rounded-xl outline-none font-bold tabular-nums"
                                    />
                                  </div>
                                  <div>
                                    <label className="block font-bold text-slate-600 mb-1">ملاحظات وتشجيع المعلم:</label>
                                    <input
                                      type="text"
                                      value={edit.feedback}
                                      onChange={e => setGradeEdits(prev => ({
                                        ...prev,
                                        [sub.id]: { ...edit, feedback: e.target.value },
                                      }))}
                                      placeholder="اكتب ملاحظة للطالب..."
                                      className="w-full p-2 bg-white border border-slate-200 rounded-xl outline-none"
                                    />
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleTeacherGrade(sub)}
                                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                                >
                                  حفظ الدرجة وإشعار الطالب بنتيجته ✓
                                </button>
                              </>
                            );
                          })()}
                        </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-6">
                      لم يقم أي طالب بتسليم هذا الواجب حتى الآن.
                    </p>
                  )}

                  {gradedSuccess && (
                    <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-center gap-2 font-bold text-xs">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>تم رصد الدرجة بنجاح وإرسال إشعار فوري للطالب!</span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-xs text-slate-400">اختر واجباً من القائمة لعرض تفاصيله وحله.</p>
          )}
        </div>
      </div>
    </div>
  );
};
