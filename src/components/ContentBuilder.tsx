import React, { useState } from 'react';
import { X, Plus, Trash2, Paperclip, Loader2, Sparkles, BookmarkPlus, Library, Check, FileUp, FileText, Download, Image as ImageIcon } from 'lucide-react';
import { ClassItem, Lesson, Quiz, QuizQuestion, QuizQuestionType } from '../types';
import { UploadedFile } from '../lib/api';
import { generateQuizQuestionsAI, GeneratedQuizHeader } from '../lib/ai';
import { fileToBase64Payload, downloadQuizAsWordDoc, UploadedAIPayload } from '../lib/wordExport';
import { BankQuestionItem, loadQuestionBank, saveQuestionsToBank } from '../lib/questionBank';

const field = 'w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7] focus:bg-white';

function toEmbed(url: string): string {
  const u = url.trim();
  if (!u) return '';
  const m = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : u;
}

const Shell: React.FC<{ title: string; onClose: () => void; onSubmit: (e: React.FormEvent) => void; children: React.ReactNode; busy?: boolean }> =
  ({ title, onClose, onSubmit, children, busy }) => (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
      <form onSubmit={onSubmit} className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-900">{title}</h3>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        {children}
        <button type="submit" disabled={busy} className="w-full py-3 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white font-black rounded-xl text-sm cursor-pointer flex items-center justify-center gap-2">
          {busy && <Loader2 className="w-4 h-4 animate-spin" />} نشر
        </button>
      </form>
    </div>
  );

/* ------------------------- Lesson ------------------------- */
export const LessonBuilderModal: React.FC<{
  classes: ClassItem[]; teacherName: string; onClose: () => void;
  onSubmit: (l: Lesson) => void; onUpload: (f: File, folder: string) => Promise<UploadedFile>;
}> = ({ classes, teacherName, onClose, onSubmit, onUpload }) => {
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [video, setVideo] = useState('');
  const [duration, setDuration] = useState('');
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try { setFile(await onUpload(f, 'lessons')); } catch { /* toast في App */ }
    setBusy(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId || !title.trim()) return;
    onSubmit({
      id: 'new', class_id: classId, teacher_id: '', teacher_name: teacherName, title: title.trim(), content: content.trim(),
      video_url: toEmbed(video) || undefined, duration: duration.trim() || undefined,
      attachment_url: file?.url, attachment_name: file?.name, position: 0, published_at: new Date().toISOString(),
    } as Lesson);
    onClose();
  };

  return (
    <Shell title="إضافة درس جديد" onClose={onClose} onSubmit={submit} busy={busy}>
      <select value={classId} onChange={e => setClassId(e.target.value)} className={field} required>
        {classes.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
      </select>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="عنوان الدرس" className={field} required maxLength={150} />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="شرح الدرس…" rows={6} className={field} />
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={video} onChange={e => setVideo(e.target.value)} placeholder="رابط فيديو يوتيوب (اختياري)" className={field} dir="ltr" />
        <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="المدة (مثال: 20 دقيقة)" className={field} />
      </div>
      <label className="flex items-center gap-2 p-2.5 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-50">
        <Paperclip className="w-4 h-4" /> {file ? file.name : 'إرفاق ملف (PDF / مستند — حتى 10MB)'}
        <input type="file" className="hidden" onChange={pick} />
      </label>
    </Shell>
  );
};

/* ------------------------- Quiz ------------------------- */

export const QUIZ_TYPE_META: Record<QuizQuestionType, { label: string; badge: string; hint: string }> = {
  mcq: { label: 'اختيار من متعدد', badge: 'اختيار واحد', hint: 'اختر الإجابة الصحيحة من الخيارات' },
  true_false: { label: 'صح أم خطأ', badge: 'صح / خطأ', hint: 'حدد هل العبارة صحيحة أم خاطئة' },
  multi_select: { label: 'اختيار أكثر من إجابة', badge: 'تحديد متعدد', hint: 'حدّد كل الإجابات الصحيحة (إجابتان فأكثر)' },
  short_answer: { label: 'إجابة قصيرة (كتابة)', badge: 'كتابة قصيرة', hint: 'يكتب الطالب الإجابة وتُصحَّح تلقائياً' },
  fill_blank: { label: 'أكمل الفراغ', badge: 'أكمل الفراغ', hint: 'استخدم ___ مكان الفراغ في نص السؤال' },
  essay: { label: 'سؤال مقالي / كتابي', badge: 'تصحيح المعلم', hint: 'يكتب الطالب فقرة مفصلة ويراجعها المعلم' },
};

const blankQ = (type: QuizQuestionType = 'mcq'): QuizQuestion => ({
  id: Math.random().toString(36).slice(2),
  type,
  question: '',
  options: type === 'true_false' ? ['صح', 'خطأ'] : type === 'mcq' || type === 'multi_select' ? ['', '', '', ''] : [],
  correctOptionIndex: 0,
  correctOptionIndices: type === 'multi_select' ? [0] : undefined,
  acceptedAnswers: type === 'short_answer' || type === 'fill_blank' ? [''] : undefined,
  modelAnswer: '',
  caseSensitive: false,
  explanation: '',
  topic: '',
  points: type === 'essay' ? 5 : 1,
});

export const QuizBuilderModal: React.FC<{
  classes: ClassItem[];
  onClose: () => void;
  onSubmit: (q: Quiz) => void;
  userId?: string;
  initialTitle?: string;
  initialQuestions?: QuizQuestion[];
}> = ({ classes, onClose, onSubmit, userId = '', initialTitle = '', initialQuestions }) => {
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [title, setTitle] = useState(initialTitle);
  const [desc, setDesc] = useState('');
  const [minutes, setMinutes] = useState(15);
  const [qs, setQs] = useState<QuizQuestion[]>(() =>
    initialQuestions && initialQuestions.length > 0
      ? initialQuestions.map(q => ({ ...q, id: `q-${Math.random().toString(36).slice(2, 8)}` }))
      : [blankQ('mcq')],
  );
  const [error, setError] = useState('');
  const [aiOpen, setAiOpen] = useState(true);
  const [aiTopic, setAiTopic] = useState('');
  const [aiCount, setAiCount] = useState(5);
  const [aiTypes, setAiTypes] = useState<QuizQuestionType[]>(['mcq', 'true_false', 'short_answer', 'fill_blank']);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiErr, setAiErr] = useState('');
  const [sourceFile, setSourceFile] = useState<UploadedAIPayload | null>(null);
  const [templateFile, setTemplateFile] = useState<UploadedAIPayload | null>(null);
  const [examHeader, setExamHeader] = useState<GeneratedQuizHeader | null>(null);
  const [bankOpen, setBankOpen] = useState(false);
  const [bankItems, setBankItems] = useState<BankQuestionItem[]>(() => loadQuestionBank(userId));
  const [bankSelected, setBankSelected] = useState<string[]>([]);
  const [savedQIds, setSavedQIds] = useState<Record<string, boolean>>({});

  const toggleBankPick = (id: string) => {
    setBankSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const importFromBank = () => {
    const picked = bankItems.filter(b => bankSelected.includes(b.id));
    if (!picked.length) return;
    const clones = picked.map(b => ({
      ...b.question,
      id: `q-${Math.random().toString(36).slice(2, 8)}`,
    }));
    setQs(prev => {
      const onlyBlank = prev.length === 1 && !prev[0].question.trim();
      return onlyBlank ? clones : [...prev, ...clones];
    });
    setBankSelected([]);
    setBankOpen(false);
  };

  const handleSaveOneToBank = (q: QuizQuestion) => {
    if (!q.question.trim()) return;
    const subj = classes.find(c => c.id === classId)?.subject || title.trim() || 'عام';
    const next = saveQuestionsToBank(userId, subj, [q]);
    setBankItems(next);
    setSavedQIds(prev => ({ ...prev, [q.id]: true }));
  };

  const toggleAiType = (t: QuizQuestionType) => {
    setAiTypes(prev => (prev.includes(t) ? (prev.length > 1 ? prev.filter(x => x !== t) : prev) : [...prev, t]));
  };

  const pickAiFile = async (e: React.ChangeEvent<HTMLInputElement>, target: 'source' | 'template') => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setAiErr('');
    try {
      const payload = await fileToBase64Payload(f);
      if (target === 'source') setSourceFile(payload);
      else setTemplateFile(payload);
    } catch (err: any) {
      setAiErr(err?.message || 'تعذّر قراءة الملف');
    }
  };

  const handleGenerateQuizAI = async () => {
    if ((!aiTopic.trim() && !sourceFile && !templateFile) || aiBusy) return;
    setAiErr('');
    setAiBusy(true);
    try {
      const mode = templateFile ? 'word_template' : sourceFile ? 'from_media' : 'standard';
      const res = await generateQuizQuestionsAI(aiTopic, aiCount, aiTypes, {
        mode,
        sourceFile,
        templateFile,
      });
      if (res.title && !title.trim()) setTitle(res.title);
      if (res.description && !desc.trim()) setDesc(res.description);
      if (res.examHeader) setExamHeader(res.examHeader);
      if (res.questions.length > 0) {
        setQs(res.questions);
        setAiOpen(false);
      } else {
        setAiErr('لم يتم توليد أسئلة، جرّب توضيح الموضوع أو إرفاق ملف أوضح.');
      }
    } catch (err: any) {
      setAiErr(err?.message || 'تعذّر توليد الاختبار');
    } finally {
      setAiBusy(false);
    }
  };

  const handleExportBuilderWord = (withAnswers: boolean) => {
    const validQs = qs.filter(q => q.question.trim());
    if (!validQs.length) return;
    const selectedClass = classes.find(c => c.id === classId);
    downloadQuizAsWordDoc({
      title: title.trim() || 'اختبار دراسي',
      classTitle: selectedClass?.title || examHeader?.subject || '',
      ministryName: examHeader?.institution || 'وزارة التربية والتعليم / المجمع التعليمي',
      schoolName: 'منصة NEMVIA التعليمية',
      instructions: examHeader?.instructions || desc.trim() || 'اقرأ كل سؤال بعناية ثم أجب في المكان المخصص.',
      timeLimitMinutes: Math.max(1, minutes),
      questions: validQs,
      withAnswers,
    });
  };

  const upd = (i: number, patch: Partial<QuizQuestion>) =>
    setQs(list => list.map((q, k) => (k === i ? { ...q, ...patch } : q)));

  const switchType = (i: number, nextType: QuizQuestionType) => {
    setQs(list => list.map((q, k) => {
      if (k !== i) return q;
      const base = blankQ(nextType);
      return {
        ...base,
        id: q.id,
        question: q.question,
        explanation: q.explanation,
        topic: q.topic || '',
        points: q.points,
        options: nextType === 'true_false'
          ? ['صح', 'خطأ']
          : (nextType === 'mcq' || nextType === 'multi_select')
            ? (q.options.length >= 2 && q.type !== 'true_false' ? q.options : ['', '', '', ''])
            : [],
      };
    }));
  };

  const updOpt = (i: number, j: number, v: string) =>
    setQs(list => list.map((q, k) => (k === i ? { ...q, options: q.options.map((o, x) => (x === j ? v : o)) } : q)));

  const addOpt = (i: number) =>
    setQs(list => list.map((q, k) => (k === i && q.options.length < 6 ? { ...q, options: [...q.options, ''] } : q)));

  const removeOpt = (i: number, j: number) =>
    setQs(list => list.map((q, k) => {
      if (k !== i || q.options.length <= 2) return q;
      const nextOpts = q.options.filter((_, x) => x !== j);
      const nextCorrect = q.correctOptionIndex >= nextOpts.length ? 0 : q.correctOptionIndex;
      const nextIndices = (q.correctOptionIndices || [])
        .filter(idx => idx !== j)
        .map(idx => (idx > j ? idx - 1 : idx));
      return {
        ...q,
        options: nextOpts,
        correctOptionIndex: nextCorrect,
        correctOptionIndices: nextIndices.length ? nextIndices : [0],
      };
    }));

  const toggleMulti = (i: number, j: number) =>
    setQs(list => list.map((q, k) => {
      if (k !== i) return q;
      const cur = new Set(q.correctOptionIndices || []);
      if (cur.has(j)) cur.delete(j);
      else cur.add(j);
      return { ...q, correctOptionIndices: [...cur].sort((a, b) => a - b) };
    }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!classId || !title.trim()) return;

    const prepared: QuizQuestion[] = [];
    for (let idx = 0; idx < qs.length; idx++) {
      const q = qs[idx];
      const qType = q.type || 'mcq';
      const num = idx + 1;

      if (!q.question.trim()) {
        setError(`السؤال رقم ${num} يحتاج نصاً.`);
        return;
      }

      if (qType === 'true_false') {
        prepared.push({
          ...q,
          type: 'true_false',
          question: q.question.trim(),
          options: ['صح', 'خطأ'],
          correctOptionIndex: q.correctOptionIndex === 1 ? 1 : 0,
        });
      } else if (qType === 'mcq') {
        const keep = q.options.map((o, i) => ({ o: o.trim(), i })).filter(x => x.o);
        if (keep.length < 2) { setError(`السؤال رقم ${num} يحتاج خيارين على الأقل.`); return; }
        const mappedIdx = keep.findIndex(x => x.i === q.correctOptionIndex);
        if (mappedIdx === -1) { setError(`السؤال رقم ${num}: الإجابة الصحيحة يجب أن تكون خياراً غير فارغ.`); return; }
        prepared.push({
          ...q,
          type: 'mcq',
          question: q.question.trim(),
          options: keep.map(x => x.o),
          correctOptionIndex: mappedIdx,
        });
      } else if (qType === 'multi_select') {
        const keep = q.options.map((o, i) => ({ o: o.trim(), i })).filter(x => x.o);
        if (keep.length < 2) { setError(`السؤال رقم ${num} يحتاج خيارين على الأقل.`); return; }
        const mappedIndices = (q.correctOptionIndices || [])
          .map(origIdx => keep.findIndex(x => x.i === origIdx))
          .filter(x => x !== -1);
        if (mappedIndices.length === 0) { setError(`السؤال رقم ${num}: حدد إجابة صحيحة واحدة على الأقل.`); return; }
        prepared.push({
          ...q,
          type: 'multi_select',
          question: q.question.trim(),
          options: keep.map(x => x.o),
          correctOptionIndex: mappedIndices[0],
          correctOptionIndices: [...new Set(mappedIndices)].sort((a, b) => a - b),
        });
      } else if (qType === 'short_answer' || qType === 'fill_blank') {
        const rawText = (q.acceptedAnswers || []).join('\n');
        const parsed = rawText
          .split(/[\n،,;|]+/)
          .map(s => s.trim())
          .filter(Boolean);
        if (parsed.length === 0) {
          setError(`السؤال رقم ${num}: أضف إجابة صحيحة مقبولة واحدة على الأقل.`);
          return;
        }
        prepared.push({
          ...q,
          type: qType,
          question: q.question.trim(),
          options: [],
          correctOptionIndex: 0,
          acceptedAnswers: parsed,
        });
      } else {
        prepared.push({
          ...q,
          type: 'essay',
          question: q.question.trim(),
          topic: (q.topic || '').trim() || undefined,
          options: [],
          correctOptionIndex: 0,
          modelAnswer: (q.modelAnswer || '').trim(),
        });
      }
    }

    const cleanedPrepared = prepared.map(item => ({
      ...item,
      topic: (item.topic || '').trim() || undefined,
    }));

    onSubmit({
      id: 'new',
      class_id: classId,
      class_title: '',
      title: title.trim(),
      description: desc.trim(),
      timeLimitMinutes: Math.max(1, minutes),
      isPublished: true,
      attemptsCount: 0,
      questions: cleanedPrepared,
    } as Quiz);
    onClose();
  };

  return (
    <Shell title="إنشاء اختبار متنوع ومتكامل" onClose={onClose} onSubmit={submit}>
      <select value={classId} onChange={e => setClassId(e.target.value)} className={field} required>
        {classes.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
      </select>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="عنوان الاختبار" className={field} required maxLength={150} />
      <div className="grid sm:grid-cols-3 gap-3">
        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="وصف أو تعليمات الاختبار" className={`${field} sm:col-span-2`} />
        <div className="relative">
          <input type="number" min={1} max={180} value={minutes} onChange={e => setMinutes(Number(e.target.value))} className={field} title="المدة بالدقائق" />
          <span className="absolute left-3 top-2.5 text-[10px] text-slate-400 font-bold">دقيقة</span>
        </div>
      </div>

      {/* AI Quiz Generator Panel */}
      <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>توليد أسئلة الاختبار بالذكاء الاصطناعي</span>
          </span>
          <button
            type="button"
            onClick={() => setAiOpen(v => !v)}
            className="text-[11px] font-bold text-[#1677c7] hover:underline cursor-pointer"
          >
            {aiOpen ? 'إخفاء' : 'فتح المولّد الذكي'}
          </button>
        </div>

        {aiOpen && (
          <div className="space-y-3 pt-1">
            <textarea
              value={aiTopic}
              onChange={e => setAiTopic(e.target.value)}
              rows={2}
              placeholder="اكتب موضوع الاختبار أو طلبك للذكاء (مثال: أنشئ اختباراً على نمط الملف المرفق مع 5 أسئلة متنوعة)..."
              className={field}
            />

            {/* Upload Source Media & Word Pattern Template */}
            <div className="grid sm:grid-cols-2 gap-2">
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-[#1677c7]" />
                  <span>صورة / ملف الدرس المصدر (اختياري)</span>
                </span>
                {sourceFile ? (
                  <div className="flex items-center justify-between gap-2 bg-sky-50 border border-sky-200 rounded-lg px-2 py-1 text-[11px]">
                    <span className="truncate font-bold text-[#0f233a]">{sourceFile.name}</span>
                    <button type="button" onClick={() => setSourceFile(null)} className="text-rose-600 font-bold cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-1.5 py-1.5 px-2 border border-dashed border-slate-300 hover:border-[#1677c7] rounded-lg text-[11px] font-bold text-slate-600 cursor-pointer hover:bg-slate-50">
                    <FileUp className="w-3.5 h-3.5 text-[#1677c7]" />
                    <span>رفع صورة كتاب / PDF / Word</span>
                    <input
                      type="file"
                      accept="image/*,.pdf,.docx,.doc,.txt"
                      className="hidden"
                      onChange={e => void pickAiFile(e, 'source')}
                    />
                  </label>
                )}
              </div>

              <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>على نمط ملف وورد / نموذج اختبار (اختياري)</span>
                </span>
                {templateFile ? (
                  <div className="flex items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1 text-[11px]">
                    <span className="truncate font-bold text-emerald-900">{templateFile.name}</span>
                    <button type="button" onClick={() => setTemplateFile(null)} className="text-rose-600 font-bold cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-1.5 py-1.5 px-2 border border-dashed border-slate-300 hover:border-emerald-600 rounded-lg text-[11px] font-bold text-slate-600 cursor-pointer hover:bg-slate-50">
                    <FileUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>رفع قالب Word (.docx) أو صورة نموذج</span>
                    <input
                      type="file"
                      accept=".docx,.doc,.pdf,image/*,.txt"
                      className="hidden"
                      onChange={e => void pickAiFile(e, 'template')}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {(Object.keys(QUIZ_TYPE_META) as QuizQuestionType[]).map(t => {
                  const active = aiTypes.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleAiType(t)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border cursor-pointer transition-colors ${
                        active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {QUIZ_TYPE_META[t].badge}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={aiCount}
                  onChange={e => setAiCount(Number(e.target.value))}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                >
                  {[3, 5, 8, 10, 15].map(n => <option key={n} value={n}>{n} أسئلة</option>)}
                </select>
                <button
                  type="button"
                  disabled={aiBusy || (!aiTopic.trim() && !sourceFile && !templateFile)}
                  onClick={handleGenerateQuizAI}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  {aiBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>{aiBusy ? 'جاري التوليد...' : 'توليد الآن'}</span>
                </button>
              </div>
            </div>
            {aiErr && <p className="text-[11px] font-bold text-rose-600">{aiErr}</p>}
          </div>
        )}
      </div>

      {/* Reusable Question Bank Import Panel */}
      <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
            <Library className="w-3.5 h-3.5 text-[#1677c7]" />
            <span>استيراد من بنك الأسئلة المحفوظ ({bankItems.length})</span>
          </span>
          <button
            type="button"
            onClick={() => {
              setBankItems(loadQuestionBank(userId));
              setBankOpen(v => !v);
            }}
            className="text-[11px] font-bold text-[#1677c7] hover:underline cursor-pointer"
          >
            {bankOpen ? 'إغلاق البنك' : 'تصفح البنك'}
          </button>
        </div>

        {bankOpen && (
          <div className="space-y-2.5 pt-1">
            {bankItems.length === 0 ? (
              <p className="text-[11px] text-slate-500">
                بنك الأسئلة فارغ حالياً. يمكنك حفظ أي سؤال بالضغط على «حفظ بالبنك» أو استيراد أسئلة اختباراتك السابقة من تبويب الاختبارات.
              </p>
            ) : (
              <>
                <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                  {bankItems.map(item => {
                    const checked = bankSelected.includes(item.id);
                    const qType = item.question.type || 'mcq';
                    return (
                      <label
                        key={item.id}
                        className={`flex items-start gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                          checked ? 'bg-sky-50 border-[#1677c7]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleBankPick(item.id)}
                          className="mt-0.5 accent-[#1677c7]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 line-clamp-1">{item.question.question}</p>
                          <span className="text-[10px] text-slate-500">
                            {item.subject} · {QUIZ_TYPE_META[qType]?.badge || qType} · {item.question.points} نقطة
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <button
                  type="button"
                  disabled={bankSelected.length === 0}
                  onClick={importFromBank}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  إدراج المحدد ({bankSelected.length}) في الاختبار
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {qs.map((q, i) => {
          const qType = q.type || 'mcq';
          return (
            <div key={q.id} className="p-3.5 border border-slate-200 rounded-2xl space-y-2.5 bg-slate-50/70">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-800">السؤال {i + 1}</span>
                  <select
                    value={qType}
                    onChange={e => switchType(i, e.target.value as QuizQuestionType)}
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-[#1677c7] outline-none cursor-pointer"
                  >
                    {(Object.keys(QUIZ_TYPE_META) as QuizQuestionType[]).map(t => (
                      <option key={t} value={t}>{QUIZ_TYPE_META[t].label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">{QUIZ_TYPE_META[qType].hint}</span>
                  {q.question.trim() && (
                    <button
                      type="button"
                      onClick={() => handleSaveOneToBank(q)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 cursor-pointer ${
                        savedQIds[q.id]
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-[#1677c7] hover:text-[#1677c7]'
                      }`}
                      title="حفظ هذا السؤال في بنك الأسئلة لإعادة استخدامه"
                    >
                      {savedQIds[q.id] ? <Check className="w-3 h-3" /> : <BookmarkPlus className="w-3 h-3" />}
                      <span>{savedQIds[q.id] ? 'محفوظ' : 'للبنك'}</span>
                    </button>
                  )}
                  {qs.length > 1 && (
                    <button type="button" onClick={() => setQs(l => l.filter((_, k) => k !== i))} className="text-rose-500 hover:text-rose-700 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                {qType === 'fill_blank' ? (
                  <div className="space-y-1">
                    <textarea
                      value={q.question}
                      onChange={e => upd(i, { question: e.target.value })}
                      placeholder="مثال: عاصمة المملكة العربية السعودية هي ___ وتقع في وسط شبه الجزيرة."
                      rows={2}
                      className={field}
                    />
                    <button
                      type="button"
                      onClick={() => upd(i, { question: `${q.question}${q.question.endsWith(' ') || !q.question ? '' : ' '}___ ` })}
                      className="text-[10px] font-bold px-2 py-0.5 bg-sky-100 text-[#1677c7] rounded-md cursor-pointer"
                    >
                      + إدراج فراغ (___)
                    </button>
                  </div>
                ) : qType === 'essay' ? (
                  <textarea
                    value={q.question}
                    onChange={e => upd(i, { question: e.target.value })}
                    placeholder="اكتب نص السؤال المقالي أو المسألة التي تتطلب شرحاً أو حلاً مكتوباً..."
                    rows={2}
                    className={field}
                  />
                ) : (
                  <input value={q.question} onChange={e => upd(i, { question: e.target.value })} placeholder="نص السؤال" className={field} />
                )}
              </div>

              {/* صح وخطأ */}
              {qType === 'true_false' && (
                <div className="grid grid-cols-2 gap-2">
                  {(['صح', 'خطأ'] as const).map((lbl, idx) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => upd(i, { correctOptionIndex: idx })}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-black cursor-pointer transition-all ${
                        q.correctOptionIndex === idx
                          ? idx === 0
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                            : 'bg-rose-50 border-rose-500 text-rose-700'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {q.correctOptionIndex === idx ? '✓ ' : ''}{lbl} {q.correctOptionIndex === idx ? '(الإجابة الصحيحة)' : ''}
                    </button>
                  ))}
                </div>
              )}

              {/* اختيار من متعدد / اختيار أكثر من إجابة */}
              {(qType === 'mcq' || qType === 'multi_select') && (
                <div className="space-y-1.5">
                  {q.options.map((o, j) => (
                    <div key={j} className="flex items-center gap-2">
                      {qType === 'mcq' ? (
                        <input
                          type="radio"
                          name={`c-${q.id}`}
                          checked={q.correctOptionIndex === j}
                          onChange={() => upd(i, { correctOptionIndex: j })}
                          className="accent-emerald-500 cursor-pointer"
                          title="الإجابة الصحيحة"
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked={(q.correctOptionIndices || []).includes(j)}
                          onChange={() => toggleMulti(i, j)}
                          className="accent-emerald-500 cursor-pointer"
                          title="إجابة صحيحة"
                        />
                      )}
                      <input value={o} onChange={e => updOpt(i, j, e.target.value)} placeholder={`الخيار ${j + 1}`} className={field} />
                      {q.options.length > 2 && (
                        <button type="button" onClick={() => removeOpt(i, j)} className="text-slate-400 hover:text-rose-500 cursor-pointer text-xs px-1" title="حذف الخيار">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  {q.options.length < 6 && (
                    <button type="button" onClick={() => addOpt(i)} className="text-[11px] font-bold text-[#1677c7] hover:underline cursor-pointer">
                      + إضافة خيار آخر
                    </button>
                  )}
                </div>
              )}

              {/* إجابة قصيرة أو أكمل الفراغ */}
              {(qType === 'short_answer' || qType === 'fill_blank') && (
                <div className="space-y-1.5 bg-white p-2.5 rounded-xl border border-slate-200">
                  <label className="block text-[11px] font-bold text-slate-700">
                    الإجابات الصحيحة المقبولة (يمكنك وضع أكثر من صيغة مفصولة بفاصلة أو بسطر جديد):
                  </label>
                  <textarea
                    value={(q.acceptedAnswers || []).join('، ')}
                    onChange={e => upd(i, { acceptedAnswers: [e.target.value] })}
                    placeholder="مثال: الرياض، مدينة الرياض"
                    rows={2}
                    className={field}
                  />
                  <label className="flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!q.caseSensitive}
                      onChange={e => upd(i, { caseSensitive: e.target.checked })}
                      className="accent-[#1677c7]"
                    />
                    <span>مطابقة حساسة لحالة الأحرف (للإنجليزية/الرموز البرمجية)</span>
                  </label>
                </div>
              )}

              {/* سؤال مقالي */}
              {qType === 'essay' && (
                <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200">
                  <label className="block text-[11px] font-bold text-slate-700">
                    الإجابة النموذجية / معيار التصحيح (اختياري — يظهر للطالب بعد التسليم وللمعلم عند التصحيح):
                  </label>
                  <textarea
                    value={q.modelAnswer || ''}
                    onChange={e => upd(i, { modelAnswer: e.target.value })}
                    placeholder="اكتب النقاط الأساسية المتوقعة في إجابة الطالب..."
                    rows={2}
                    className={field}
                  />
                </div>
              )}

              <div className="grid sm:grid-cols-6 gap-2">
                <input
                  value={q.topic || ''}
                  onChange={e => upd(i, { topic: e.target.value })}
                  placeholder="الموضوع / المهارة (اختياري)"
                  className={`${field} sm:col-span-2`}
                  title="يساعد تصنيف الموضوع في تحديد نقاط القوة والضعف في تقرير الطالب"
                />
                <input
                  value={q.explanation}
                  onChange={e => upd(i, { explanation: e.target.value })}
                  placeholder="تفسير أو ملاحظة تعليمية (تظهر بعد التسليم)"
                  className={`${field} sm:col-span-3`}
                />
                <div className="relative sm:col-span-1">
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={q.points}
                    onChange={e => upd(i, { points: Math.max(1, Number(e.target.value)) })}
                    className={field}
                    title="درجة السؤال"
                  />
                  <span className="absolute left-2.5 top-2.5 text-[10px] text-slate-400 font-bold">نقطة</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* أزرار إضافة سريعة لكل نوع سؤال */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-500 block">إضافة سؤال سريع حسب النوع:</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {(Object.keys(QUIZ_TYPE_META) as QuizQuestionType[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setQs(l => [...l, blankQ(t)])}
              className="py-2 px-2.5 border border-dashed border-[#1677c7]/60 hover:border-[#1677c7] hover:bg-sky-50 text-[#1677c7] rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3 h-3 shrink-0" />
              <span>{QUIZ_TYPE_META[t].label}</span>
            </button>
          ))}
        </div>
      </div>

      {qs.some(q => q.question.trim()) && (
        <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#1677c7]" />
            <span>تصدير ورقة الاختبار المنسّقة كملف Word (.doc):</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleExportBuilderWord(false)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#1677c7]" />
              <span>نسخة الطالب (.doc)</span>
            </button>
            <button
              type="button"
              onClick={() => handleExportBuilderWord(true)}
              className="px-3 py-1.5 bg-[#0f233a] hover:bg-[#1677c7] text-white rounded-xl text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>نموذج الحل (.doc)</span>
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs font-bold text-rose-600">{error}</p>}
    </Shell>
  );
};
