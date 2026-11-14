import React, { useEffect } from 'react';
import {
  Award,
  BookOpen,
  Building2,
  Calendar,
  ClipboardList,
  FileCheck,
  Home,
  Layers,
  LogOut,
  MessageSquare,
  Radio,
  Scale,
  Settings,
  ShieldCheck,
  Sparkles,
  UserCircle,
  Users,
  X,
} from 'lucide-react';
import { AppRole, Profile } from '../../types';
import { UI_COPY, useAppSettings } from '../../lib/settings';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface HubDrawerModalProps {
  open: boolean;
  activeSection: string;
  currentProfile: Profile;
  currentRole: AppRole;
  unreadMessagesCount: number;
  pendingAssignmentsCount: number;
  onSelectSection: (section: string) => void;
  onSignOut: () => void;
  onClose: () => void;
}

export const HubDrawerModal: React.FC<HubDrawerModalProps> = ({
  open,
  activeSection,
  currentProfile,
  currentRole,
  unreadMessagesCount,
  pendingAssignmentsCount,
  onSelectSection,
  onSignOut,
  onClose,
}) => {
  const { settings } = useAppSettings();
  const copy = UI_COPY[settings.lang];
  const n = copy.nav;
  const appDir = settings.lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const jump = (id: string) => {
    onSelectSection(id);
    onClose();
  };

  const groups = [
    {
      title: settings.lang === 'en' ? 'Learning & Classes' : settings.lang === 'fr' ? 'Apprentissage' : 'الدراسة والتقييم',
      items: [
        { id: 'home', label: n.home, icon: Home },
        { id: 'classes', label: n.classes, icon: BookOpen },
        { id: 'schools', label: settings.lang === 'en' ? 'Schools & Ministries' : settings.lang === 'fr' ? 'Écoles & Ministères' : 'المدارس والوزارات', icon: Building2 },
        { id: 'courses', label: n.courses, icon: Award },
        { id: 'assignments', label: n.assignments, icon: FileCheck, badge: pendingAssignmentsCount },
        { id: 'calendar', label: n.calendar, icon: Calendar },
        { id: 'grades', label: n.grades, icon: ClipboardList },
      ],
    },
    {
      title: settings.lang === 'en' ? 'Smart Tools & Community' : settings.lang === 'fr' ? 'Outils & Réseau' : 'الأدوات والتفاعل',
      items: [
        { id: 'ai', label: n.ai, icon: Sparkles },
        { id: 'tools', label: n.tools, icon: Layers },
        { id: 'live', label: n.live, icon: Radio },
        { id: 'community', label: n.community, icon: Users },
        { id: 'messages', label: n.messages, icon: MessageSquare, badge: unreadMessagesCount },
      ],
    },
    {
      title: settings.lang === 'en' ? 'Account & Preferences' : settings.lang === 'fr' ? 'Compte' : 'الحساب والنظام',
      items: [
        { id: 'profile', label: n.profile, icon: UserCircle },
        { id: 'settings', label: n.settings, icon: Settings },
        ...(currentRole === 'admin' ? [{ id: 'admin', label: n.admin, icon: ShieldCheck }] : []),
        { id: 'legal', label: n.legal, icon: Scale },
      ],
    },
  ];

  const roleLabel =
    currentRole === 'teacher'
      ? copy.header.roleTeacher
      : currentRole === 'admin'
        ? copy.header.roleAdmin
        : copy.header.roleStudent;

  return (
    <div
      className="fixed inset-0 z-[65] bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-stretch justify-start"
      onClick={onClose}
      dir={appDir}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full sm:w-96 max-h-[88vh] sm:max-h-full bg-white sm:h-full rounded-t-3xl sm:rounded-none sm:border-e border-slate-200 flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Top Grab Handle (mobile) + Header */}
        <div className="sm:hidden w-10 h-1.5 bg-slate-300 rounded-full mx-auto mt-2.5" />
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1677c7] text-white flex items-center justify-center font-black text-base">
              N
            </div>
            <div>
              <span className="font-black text-base text-slate-900 block leading-tight">NEMVIA</span>
              <span className="text-[11px] text-slate-500 block">
                {settings.lang === 'en' ? 'All-in-One Menu' : settings.lang === 'fr' ? 'Menu complet' : 'القائمة الشاملة'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
            aria-label={copy.header.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Strip */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50">
          <button
            type="button"
            onClick={() => jump('profile')}
            className="flex items-center gap-3 text-start min-w-0 cursor-pointer"
          >
            {currentProfile.avatar_url ? (
              <img src={currentProfile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {currentProfile.display_name.slice(0, 1)}
              </div>
            )}
            <div className="min-w-0">
              <span className="font-bold text-sm text-slate-900 block truncate">{currentProfile.display_name}</span>
              <span className="text-[11px] text-slate-500 block tabular-nums">
                {roleLabel} · {currentProfile.points} XP · {currentProfile.streakDays} {copy.header.days}
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => { onSignOut(); onClose(); }}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 cursor-pointer shrink-0"
            title={copy.header.signOut}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {groups.map(group => (
            <div key={group.title} className="space-y-2">
              <h3 className="text-[11px] font-bold text-slate-400 px-1">{group.title}</h3>
              <div className="grid grid-cols-2 gap-2">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const active =
                    item.id === 'tools'
                      ? ['tools', 'flashcards', 'pomodoro', 'grapher', 'certificate', 'badges'].includes(activeSection)
                      : activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => jump(item.id)}
                      className={`min-h-[48px] px-3 py-2.5 rounded-2xl border flex items-center justify-between gap-2 text-start text-xs font-bold transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#1677c7] text-white border-[#1677c7]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-[#1677c7]'}`} />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black tabular-nums ${
                          active ? 'bg-white/20 text-white' : 'bg-rose-600 text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-center empty:hidden">
          <PWAInstallButton />
        </div>
      </div>
    </div>
  );
};
