import React from 'react';
import {
  Award,
  BookOpen,
  Building2,
  Calendar,
  ClipboardList,
  FileCheck,
  Flame,
  Radio,
  Sparkles,
  Users,
} from 'lucide-react';
import { Assignment, ClassItem, LiveSession, MinistryItem, Post, Profile, Quiz, SchoolItem } from '../../types';
import { useAppSettings } from '../../lib/settings';

interface HomeViewProps {
  currentProfile: Profile;
  classes: ClassItem[];
  schools?: SchoolItem[];
  ministries?: MinistryItem[];
  assignments: Assignment[];
  quizzes: Quiz[];
  liveSessions: LiveSession[];
  posts: Post[];
  onNavigate: (section: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentProfile,
  classes,
  schools = [],
  ministries = [],
  assignments,
  quizzes,
  liveSessions,
  posts,
  onNavigate,
}) => {
  const { settings } = useAppSettings();
  const isEn = settings.lang === 'en';
  const isFr = settings.lang === 'fr';

  const quickActions = [
    { id: 'ai', label: isEn ? 'Ask AI Tutor' : isFr ? 'Tuteur IA' : 'اسأل المعلّم الذكي', icon: Sparkles },
    { id: 'courses', label: isEn ? 'Quizzes & Lessons' : isFr ? 'Cours & Quiz' : 'الدروس والاختبارات', icon: Award },
    { id: 'assignments', label: isEn ? 'Assignments' : isFr ? 'Devoirs' : 'الواجبات', icon: FileCheck },
    { id: 'live', label: isEn ? 'Live Class' : isFr ? 'Direct' : 'الحصص المباشرة', icon: Radio },
  ];

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Compact All-in-One Launcher Card (Facebook Composer-style, tailored to Education Hub) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm shrink-0">
              {currentProfile.display_name.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <h1 className="font-black text-base sm:text-lg text-slate-900 truncate">
                {isEn ? `Welcome, ${currentProfile.display_name}` : isFr ? `Bienvenue, ${currentProfile.display_name}` : `مرحباً، ${currentProfile.display_name}`}
              </h1>
              <p className="text-xs text-slate-500 tabular-nums">
                {classes.length} {isEn ? 'classes' : 'صفوف'} · {quizzes.length} {isEn ? 'quizzes' : 'اختبارات'} · {assignments.length} {isEn ? 'tasks' : 'واجبات'}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs font-bold tabular-nums shrink-0">
            <span className="flex items-center gap-1 text-orange-600">
              <Flame className="w-4 h-4" />
              {currentProfile.streakDays}
            </span>
            <span className="flex items-center gap-1 text-[#1677c7]">
              <Award className="w-4 h-4" />
              {currentProfile.points} XP
            </span>
          </div>
        </div>

        {/* 4 Single-Row Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
          {quickActions.map(act => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => onNavigate(act.id)}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Icon className="w-4 h-4 text-[#1677c7] shrink-0" />
                <span className="truncate">{act.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Clean 2-Column Workspace Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Main Feed: Upcoming Sessions, Assignments, Community Highlights */}
        <div className="lg:col-span-8 space-y-5">
          {/* Upcoming Sessions & Tasks Unified List */}
          <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1677c7]" />
                <span>{isEn ? 'Up Next' : isFr ? 'À venir' : 'المهام والحصص القادمة'}</span>
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('calendar')}
                className="text-xs font-bold text-[#1677c7] hover:underline cursor-pointer"
              >
                {isEn ? 'Full Calendar' : 'التقويم الكامل'}
              </button>
            </div>

            {liveSessions.length === 0 && assignments.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                {isEn ? 'No upcoming sessions or assignments right now.' : 'لا توجد حصص أو واجبات قريبة حالياً.'}
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {liveSessions.slice(0, 2).map(ls => (
                  <div key={ls.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-900 truncate">{ls.title}</p>
                      <p className="text-[11px] text-slate-500 tabular-nums">
                        حصة مباشرة · {ls.host_name} · {new Date(ls.starts_at).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('live')}
                      className="px-3 py-1.5 rounded-xl bg-[#1677c7] text-white font-bold text-xs shrink-0 cursor-pointer"
                    >
                      دخول
                    </button>
                  </div>
                ))}

                {assignments.slice(0, 3).map(a => (
                  <div key={a.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-900 truncate">{a.title}</p>
                      <p className="text-[11px] text-slate-500 tabular-nums">
                        واجب · {a.class_title} · التسليم {new Date(a.due_at).toLocaleDateString('ar', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('assignments')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs shrink-0 cursor-pointer"
                    >
                      فتح
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Compact Community Stream */}
          <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1677c7]" />
                <span>{isEn ? 'Community Updates' : isFr ? 'Communauté' : 'آخر منشورات المجتمع'}</span>
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('community')}
                className="text-xs font-bold text-[#1677c7] hover:underline cursor-pointer"
              >
                {isEn ? 'Open Community' : 'عرض الكل'}
              </button>
            </div>

            {posts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                {isEn ? 'No posts yet.' : 'لا توجد منشورات بعد.'}
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {posts.slice(0, 3).map(p => (
                  <div key={p.id} onClick={() => onNavigate('community')} className="py-3 space-y-1 cursor-pointer hover:opacity-80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{p.author_name}</span>
                      <span className="text-[11px] text-slate-400 tabular-nums">
                        {p.likes_count} إعجاب · {p.comments_count} ردود
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{p.body}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Side: Compact Summary & Direct Hub Links */}
        <aside className="lg:col-span-4 space-y-4">
          <section className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
            <h2 className="font-black text-sm text-slate-900">
              {isEn ? 'Quick Access' : isFr ? 'Accès rapide' : 'اختصارات سريعة'}
            </h2>
            <div className="space-y-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => onNavigate('classes')}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-slate-800 cursor-pointer"
              >
                <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#1677c7]" />الصفوف والمجموعات</span>
                <span className="text-slate-500 tabular-nums">{classes.length}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('schools')}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-slate-800 cursor-pointer"
              >
                <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-emerald-600" />المدارس والوزارات</span>
                <span className="text-slate-500 tabular-nums">{schools.length + ministries.length}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('grades')}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-slate-800 cursor-pointer"
              >
                <span className="flex items-center gap-2"><ClipboardList className="w-4 h-4 text-emerald-600" />سجل الدرجات</span>
                <span className="text-slate-500 tabular-nums">{quizzes.length}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('ai')}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-slate-800 cursor-pointer"
              >
                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" />استوديو الذكاء الاصطناعي</span>
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
