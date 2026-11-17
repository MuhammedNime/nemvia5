import React, { useState } from 'react';
import { BarChart2, CheckCircle2, Plus, Trash2, X } from 'lucide-react';
import { AppRole, PollItem, PollScopeType } from '../types';
import * as api from '../lib/api';

interface PollComposerModalProps {
  open: boolean;
  scopeType: PollScopeType;
  scopeId: string;
  creatorId: string;
  creatorName: string;
  onClose: () => void;
}

export const PollComposerModal: React.FC<PollComposerModalProps> = ({
  open,
  scopeType,
  scopeId,
  creatorId,
  creatorName,
  onClose,
}) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validOpts = options.map(o => o.trim()).filter(Boolean);
    if (!question.trim() || validOpts.length < 2) {
      setError('اكتب سؤال التصويت وخيارين على الأقل.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api.createPoll({
        scopeType,
        scopeId,
        creatorId,
        creatorName,
        question: question.trim(),
        options: validOpts,
      });
      setQuestion('');
      setOptions(['', '']);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'تعذّر نشر الاستطلاع.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-['Cairo',sans-serif]"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 bg-[#0f233a] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-sky-400" />
            <h3 className="font-black text-sm">إنشاء استطلاع تصويت سريع</h3>
          </div>
          <button type="button" onClick={onClose} className="text-white/70 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">سؤال التصويت:</label>
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="مثال: ما أفضل موعد لحصة المراجعة؟"
              maxLength={300}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-slate-700">الخيارات (2 إلى 6 خيارات):</label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={opt}
                  onChange={e =>
                    setOptions(prev => prev.map((v, i) => (i === idx ? e.target.value : v)))
                  }
                  placeholder={`الخيار ${idx + 1}`}
                  maxLength={120}
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
                  required={idx < 2}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setOptions(prev => prev.filter((_, i) => i !== idx))}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {options.length < 6 && (
              <button
                type="button"
                onClick={() => setOptions(prev => [...prev, ''])}
                className="text-[#1677c7] font-bold text-xs inline-flex items-center gap-1 cursor-pointer pt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة خيار آخر</span>
              </button>
            )}
          </div>

          {error && <p className="text-rose-600 font-bold">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={busy}
              className="flex-1 py-2.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white font-bold rounded-xl cursor-pointer"
            >
              {busy ? 'جاري النشر...' : 'نشر الاستطلاع'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface PollCardProps {
  poll: PollItem;
  currentUserId: string;
  currentRole: AppRole;
  compact?: boolean;
}

export const PollCard: React.FC<PollCardProps> = ({
  poll,
  currentUserId,
  currentRole,
  compact = false,
}) => {
  const [votingIdx, setVotingIdx] = useState<number | null>(null);
  const votes = poll.votes || [];
  const totalVotes = votes.length;
  const myVote = votes.find(v => v.user_id === currentUserId);
  const canDelete = poll.creator_id === currentUserId || currentRole === 'admin';

  const vote = async (idx: number) => {
    setVotingIdx(idx);
    try {
      await api.castPollVote(poll.id, currentUserId, idx);
    } finally {
      setVotingIdx(null);
    }
  };

  return (
    <div className={`bg-white border border-sky-200/80 rounded-2xl ${compact ? 'p-3 space-y-2' : 'p-4 space-y-3'} shadow-xs`}>
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1677c7]">
            <BarChart2 className="w-3.5 h-3.5 shrink-0" />
            <span>استطلاع رأي · {poll.creator_name}</span>
          </div>
          <h4 className={`font-black text-slate-900 leading-snug ${compact ? 'text-xs' : 'text-sm'}`}>
            {poll.question}
          </h4>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full tabular-nums">
            {totalVotes} صوت
          </span>
          {canDelete && (
            <button
              type="button"
              onClick={() => void api.deletePoll(poll.id)}
              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
              title="حذف الاستطلاع"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        {poll.options.map((opt, idx) => {
          const count = votes.filter(v => v.option_index === idx).length;
          const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          const isMine = myVote?.option_index === idx;
          return (
            <button
              key={idx}
              type="button"
              disabled={votingIdx !== null}
              onClick={() => void vote(idx)}
              className={`w-full relative overflow-hidden rounded-xl border text-right px-3 py-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                isMine
                  ? 'border-[#1677c7] bg-sky-50/70 text-[#0f233a]'
                  : 'border-slate-200 bg-slate-50/60 hover:border-sky-300 text-slate-700'
              }`}
            >
              <div
                className={`absolute inset-y-0 right-0 transition-all duration-300 ${
                  isMine ? 'bg-[#1677c7]/15' : 'bg-slate-200/55'
                }`}
                style={{ width: `${pct}%` }}
              />
              <span className="relative z-10 flex items-center gap-1.5 truncate">
                {isMine && <CheckCircle2 className="w-3.5 h-3.5 text-[#1677c7] shrink-0" />}
                <span className="truncate">{opt}</span>
              </span>
              <span className="relative z-10 text-[11px] font-black tabular-nums shrink-0 text-slate-600">
                {pct}% ({count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
