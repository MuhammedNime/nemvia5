import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  FileCheck,
  MessageSquare,
  Radio,
  Search,
  Users,
  X,
  FileText,
} from 'lucide-react';
import { AppData } from '../lib/api';
import { useAppSettings } from '../lib/settings';

interface GlobalSearchModalProps {
  open: boolean;
  data: AppData;
  onClose: () => void;
  onNavigate: (section: string) => void;
}

type ResultKind = 'all' | 'class' | 'lesson' | 'quiz' | 'assignment' | 'live' | 'post' | 'message';

interface SearchEntry {
  id: string;
  kind: Exclude<ResultKind, 'all'>;
  title: string;
  subtitle: string;
  section: string;
  searchBlob: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  open,
  data,
  onClose,
  onNavigate,
}) => {
  const { settings } = useAppSettings();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ResultKind>('all');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setQuery('');
      setFilter('all');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const entries = useMemo<SearchEntry[]>(() => {
    const list: SearchEntry[] = [];
    data.classes.forEach(c => {
      list.push({
        id: `cls-${c.id}`,
        kind: 'class',
        title: c.title,
        subtitle: `${c.subject} · ${c.teacher_name}`,
        section: 'classes',
        searchBlob: `${c.title} ${c.subject} ${c.grade_level} ${c.teacher_name} ${c.description}`.toLowerCase(),
      });
    });
    data.lessons.forEach(l => {
      list.push({
        id: `lsn-${l.id}`,
        kind: 'lesson',
        title: l.title,
        subtitle: `${l.teacher_name} · درس`,
        section: 'courses',
        searchBlob: `${l.title} ${l.content} ${l.teacher_name}`.toLowerCase(),
      });
    });
    data.quizzes.forEach(q => {
      list.push({
        id: `qz-${q.id}`,
        kind: 'quiz',
        title: q.title,
        subtitle: `${q.class_title} · ${q.questions.length} سؤال`,
        section: 'courses',
        searchBlob: `${q.title} ${q.description} ${q.class_title}`.toLowerCase(),
      });
    });
    data.assignments.forEach(a => {
      list.push({
        id: `asg-${a.id}`,
        kind: 'assignment',
        title: a.title,
        subtitle: `${a.class_title} · ${a.total_points} درجة`,
        section: 'assignments',
        searchBlob: `${a.title} ${a.instructions} ${a.class_title} ${a.teacher_name}`.toLowerCase(),
      });
    });
    data.liveSessions.forEach(s => {
      list.push({
        id: `lv-${s.id}`,
        kind: 'live',
        title: s.title,
        subtitle: `${s.host_name} · ${s.status === 'live' ? 'بث مباشر' : 'حصة مجدولة'}`,
        section: 'live',
        searchBlob: `${s.title} ${s.description} ${s.host_name} ${s.class_title || ''}`.toLowerCase(),
      });
    });
    data.posts.forEach(p => {
      list.push({
        id: `pst-${p.id}`,
        kind: 'post',
        title: p.body.slice(0, 80) + (p.body.length > 80 ? '...' : ''),
        subtitle: `${p.author_name} · المجتمع`,
        section: 'community',
        searchBlob: `${p.body} ${p.author_name}`.toLowerCase(),
      });
    });
    data.messages.slice(-150).forEach(m => {
      const text = m.body || m.attachment?.name || '';
      if (!text) return;
      list.push({
        id: `msg-${m.id}`,
        kind: 'message',
        title: text.slice(0, 80) + (text.length > 80 ? '...' : ''),
        subtitle: `${m.sender_name} ← ${m.recipient_name}`,
        section: 'messages',
        searchBlob: `${text} ${m.sender_name} ${m.recipient_name}`.toLowerCase(),
      });
    });
    return list;
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries
      .filter(e => (filter === 'all' ? true : e.kind === filter))
      .filter(e => (!q ? true : e.searchBlob.includes(q)))
      .slice(0, 28);
  }, [entries, filter, query]);

  if (!open) return null;

  const isEn = settings.lang === 'en';
  const isFr = settings.lang === 'fr';
  const placeholder = isEn
    ? 'Search lessons, quizzes, assignments, classes, posts, or messages...'
    : isFr
      ? 'Rechercher cours, quiz, devoirs, classes, messages...'
      : 'ابحث في الدروس، الاختبارات، الواجبات، الصفوف، المنشورات، أو الرسائل...';

  const kindLabel = (k: Exclude<ResultKind, 'all'>) => {
    const map: Record<Exclude<ResultKind, 'all'>, string> = isEn
      ? { class: 'Class', lesson: 'Lesson', quiz: 'Quiz', assignment: 'Task', live: 'Live', post: 'Post', message: 'Chat' }
      : isFr
        ? { class: 'Classe', lesson: 'Cours', quiz: 'Quiz', assignment: 'Devoir', live: 'Direct', post: 'Post', message: 'Message' }
        : { class: 'صف', lesson: 'درس', quiz: 'اختبار', assignment: 'واجب', live: 'حصة', post: 'منشور', message: 'رسالة' };
    return map[k];
  };

  const kindIcon = (k: Exclude<ResultKind, 'all'>) => {
    if (k === 'class') return BookOpen;
    if (k === 'lesson') return FileText;
    if (k === 'quiz') return Award;
    if (k === 'assignment') return FileCheck;
    if (k === 'live') return Radio;
    if (k === 'post') return Users;
    return MessageSquare;
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200">
          <Search className="w-5 h-5 text-[#1677c7] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {isEn ? 'Clear' : isFr ? 'Effacer' : 'مسح'}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold">
          {([
            ['all', isEn ? 'All' : isFr ? 'Tout' : 'الكل'],
            ['lesson', isEn ? 'Lessons' : isFr ? 'Cours' : 'الدروس'],
            ['quiz', isEn ? 'Quizzes' : isFr ? 'Quiz' : 'الاختبارات'],
            ['assignment', isEn ? 'Tasks' : isFr ? 'Devoirs' : 'الواجبات'],
            ['class', isEn ? 'Classes' : isFr ? 'Classes' : 'الصفوف'],
            ['live', isEn ? 'Live' : isFr ? 'Direct' : 'الحصص'],
            ['post', isEn ? 'Community' : isFr ? 'Réseau' : 'المجتمع'],
            ['message', isEn ? 'Messages' : isFr ? 'Messages' : 'الرسائل'],
          ] as Array<[ResultKind, string]>).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                filter === id ? 'bg-[#1677c7] text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400">
              {isEn ? 'No matching results found.' : isFr ? 'Aucun résultat trouvé.' : 'لا توجد نتائج مطابقة لبحثك.'}
            </div>
          ) : (
            filtered.map(item => {
              const Icon = kindIcon(item.kind);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.section);
                    onClose();
                  }}
                  className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors text-start cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#1677c7] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                    {kindLabel(item.kind)}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
