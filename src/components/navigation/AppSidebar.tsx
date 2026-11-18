import React from 'react';
import {
  Calendar,
  ClipboardList,
  Layers,
  LayoutGrid,
  Radio,
  Settings,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AppRole, Profile } from '../../types';
import { UI_COPY, useAppSettings } from '../../lib/settings';

interface AppSidebarProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
  onOpenHub: () => void;
  currentRole: AppRole;
  currentProfile: Profile;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeSection,
  onSelectSection,
  onOpenHub,
  currentRole,
  currentProfile,
}) => {
  const { settings } = useAppSettings();
  const copy = UI_COPY[settings.lang];
  const n = copy.nav;

  const shortcuts = [
    { id: 'ai', label: n.ai, icon: Sparkles },
    { id: 'calendar', label: n.calendar, icon: Calendar },
    { id: 'grades', label: n.grades, icon: ClipboardList },
    { id: 'tools', label: n.tools, icon: Layers },
    { id: 'live', label: n.live, icon: Radio },
    ...(currentRole === 'admin' ? [{ id: 'admin', label: n.admin, icon: ShieldCheck }] : []),
    { id: 'settings', label: n.settings, icon: Settings },
  ];

  const roleText =
    currentRole === 'teacher'
      ? copy.header.roleTeacher
      : currentRole === 'admin'
        ? copy.header.roleAdmin
        : copy.header.roleStudent;

  return (
    <aside className="w-60 sticky top-[calc(3.5rem+var(--nemvia-safe-top,env(safe-area-inset-top,0px)))] h-[calc(100dvh-3.5rem-var(--nemvia-safe-top,env(safe-area-inset-top,0px)))] py-4 px-3 flex flex-col justify-between shrink-0 overflow-y-auto">
      <div className="space-y-1">
        {/* User Profile Row */}
        <button
          type="button"
          onClick={() => onSelectSection('profile')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-start cursor-pointer ${
            activeSection === 'profile' ? 'bg-sky-50 text-[#1677c7]' : 'hover:bg-slate-200/60 text-slate-900'
          }`}
        >
          {currentProfile.avatar_url ? (
            <img src={currentProfile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {currentProfile.display_name.slice(0, 1)}
            </div>
          )}
          <div className="min-w-0">
            <span className="font-bold text-xs block truncate">{currentProfile.display_name}</span>
            <span className="text-[10px] text-slate-500 block truncate">{roleText} · {currentProfile.points} XP</span>
          </div>
        </button>

        <div className="my-2 border-t border-slate-200/80" />

        {/* Essential Shortcuts */}
        {shortcuts.map(item => {
          const Icon = item.icon;
          const isActive =
            item.id === 'tools'
              ? ['tools', 'flashcards', 'pomodoro', 'grapher', 'certificate', 'badges'].includes(activeSection)
              : activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors text-start cursor-pointer ${
                isActive
                  ? 'bg-[#1677c7] text-white'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#1677c7]'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Open All Menu Button */}
        <button
          type="button"
          onClick={onOpenHub}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-colors text-start cursor-pointer"
        >
          <LayoutGrid className="w-4 h-4 shrink-0 text-slate-500" />
          <span>{copy.mobile.more}</span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => onSelectSection('legal')}
        className="px-3 py-2 text-[11px] text-slate-400 hover:text-slate-600 text-start cursor-pointer"
      >
        {n.legal}
      </button>
    </aside>
  );
};
