import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  BookOpen,
  Calculator,
  FileText,
  HelpCircle,
  Trash2,
  Copy,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Lesson, Quiz, Profile } from '../../types';
import { askTutor, TutorMessage, TutorMode } from '../../lib/ai';

interface AIStudioViewProps {
  currentProfile: Profile;
  lessons: Lesson[];
  quizzes: Quiz[];
  onRewardXP?: (xp: number) => void;
}

const MODES: Array<{ id: TutorMode; label: string; desc: string; icon: React.FC<{ className?: string }> }> = [
  { id: 'explain', label: 'شرح مبسّط', desc: 'تبسيط المفاهيم خطوة بخطوة مع أمثلة', icon: BookOpen },
  { id: 'solve', label: 'حل مسألة', desc: 'تفصيل خطوات الحل الرياضي أو العلمي', icon: Calculator },
  { id: 'summarize', label: 'تلخيص مركز', desc: 'نقاط رئيسية مركّزة للمراجعة السريعة', icon: FileText },
  { id: 'practice', label: 'تدريب فوري', desc: 'أسئلة تدريبية مع إجابات للتحقق', icon: HelpCircle },
];

const QUICK_PROMPTS = [
  'اشرح لي مفهوم التكامل في الرياضيات بمثال بسيط من الحياة اليومية',
  'لخّص لي أهم النقاط في الدرس المحدد على شكل خطوات مراجعة',
  'أعطني 3 أسئلة تدريبية قصيرة لاختبار فهمي مع الإجابة النموذجية',
  'حل هذه المسألة خطوة بخطوة: 2x² - 5x - 3 = 0',
];

export const AIStudioView: React.FC<AIStudioViewProps> = ({
  currentProfile,
  lessons,
  quizzes,
  onRewardXP,
}) => {
  const [mode, setMode] = useState<TutorMode>('explain');
  const [selectedContextId, setSelectedContextId] = useState<string>('');
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      role: 'assistant',
      text: `أهلاً ${currentProfile.display_name}! أنا المعلّم الذكي في NEMVIA. اختر وضع المساعدة أو ارفق درساً من صفوفك، واكتب سؤالك وسأساعدك فوراً.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const listEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, busy]);

  const resolvedContext = (() => {
    if (!selectedContextId) return '';
    if (selectedContextId.startsWith('lesson:')) {
      const l = lessons.find(x => `lesson:${x.id}` === selectedContextId);
      return l ? `الدرس: ${l.title}\n${l.content}` : '';
    }
    if (selectedContextId.startsWith('quiz:')) {
      const q = quizzes.find(x => `quiz:${x.id}` === selectedContextId);
      return q
        ? `الاختبار: ${q.title}\n${q.description}\nالأسئلة:\n${q.questions.map((qq, i) => `${i + 1}. ${qq.question}`).join('\n')}`
        : '';
    }
    return '';
  })();

  const sendMessage = async (textOverride?: string) => {
    const content = (textOverride ?? input).trim();
    if (!content || busy) return;
    setError(null);
    const nextHistory: TutorMessage[] = [...messages, { role: 'user', text: content }];
    setMessages(nextHistory);
    if (!textOverride) setInput('');
    setBusy(true);
    try {
      const reply = await askTutor(nextHistory, mode, resolvedContext);
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      onRewardXP?.(5);
    } catch (err: any) {
      setError(err?.message || 'تعذّر الاتصال بالمعلم الذكي');
    } finally {
      setBusy(false);
    }
  };

  const copyMessage = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-5 animate-in fade-in">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
            <Sparkles className="w-4 h-4" />
            <span>استوديو NEMVIA للذكاء الاصطناعي</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">المعلّم الذكي التفاعلي ومساعد المذاكرة</h2>
          <p className="text-xs text-slate-500">
            اسأل عن أي مفهوم، أرفق درساً من صفوفك لتلخيصه أو إنشاء تمارين، واحصل على شرح خطوة بخطوة.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedContextId}
            onChange={e => setSelectedContextId(e.target.value)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-slate-900 max-w-[240px]"
            aria-label="إرفاق سياق من دروسك أو اختباراتك"
          >
            <option value="">بدون سياق مرفق (سؤال عام)</option>
            {lessons.map(l => (
              <option key={l.id} value={`lesson:${l.id}`}>درس: {l.title}</option>
            ))}
            {quizzes.map(q => (
              <option key={q.id} value={`quiz:${q.id}`}>اختبار: {q.title}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() =>
              setMessages([
                {
                  role: 'assistant',
                  text: `محادثة جديدة جاهزة يا ${currentProfile.display_name}. كيف أساعدك الآن؟`,
                },
              ])
            }
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl cursor-pointer"
            title="محادثة جديدة"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {MODES.map(m => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer space-y-1 ${
                active
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-black">
                <Icon className={`w-4 h-4 ${active ? 'text-amber-300' : 'text-slate-600'}`} />
                <span>{m.label}</span>
              </div>
              <p className={`text-[11px] leading-snug ${active ? 'text-slate-300' : 'text-slate-500'}`}>
                {m.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Chat Workspace */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-slate-50/40">
          {messages.map((m, i) => {
            const isUser = m.role === 'user';
            return (
              <div key={i} className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[78%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-1.5 ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-br-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                  }`}
                >
                  <p>{m.text}</p>
                  {!isUser && (
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => copyMessage(m.text, i)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {copiedIdx === i ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIdx === i ? 'تم النسخ' : 'نسخ'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {busy && (
            <div className="flex justify-end">
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl text-xs text-slate-600 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>المعلّم الذكي يجهز الإجابة...</span>
              </div>
            </div>
          )}
          <div ref={listEndRef} />
        </div>

        {error && (
          <div className="px-4 py-2.5 bg-rose-50 border-t border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick prompts */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          {QUICK_PROMPTS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              disabled={busy}
              onClick={() => void sendMessage(q)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={e => {
            e.preventDefault();
            void sendMessage();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="اكتب سؤالك، معادلتك، أو نص الدرس هنا..."
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-slate-900 focus:bg-white"
            disabled={busy}
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="px-4 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            <span>إرسال</span>
          </button>
        </form>
      </div>
    </div>
  );
};
