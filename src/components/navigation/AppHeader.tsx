import React, { useState } from 'react';
import {
  Award,
  Bell,
  BellRing,
  BookOpen,
  CheckCheck,
  FileCheck,
  Home,
  LayoutGrid,
  MessageSquare,
  Search,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AppRole, NotificationItem, Profile } from '../../types';
import { UI_COPY, useAppSettings } from '../../lib/settings';
import {
  isDesktopNotifEnabled,
  isSoundEnabled,
  playNotificationChime,
  requestBrowserNotificationPermission,
  setDesktopNotifEnabled,
  setSoundEnabled,
} from '../../lib/notifications';

interface AppHeaderProps {
  currentProfile: Profile;
  activeSection: string;
  currentRole: AppRole;
  notifications: NotificationItem[];
  unreadMessagesCount: number;
  pendingAssignmentsCount: number;
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onSelectSection: (section: string) => void;
  onOpenSearch: () => void;
  onOpenHub: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentProfile,
  activeSection,
  notifications,
  unreadMessagesCount,
  pendingAssignmentsCount,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onSelectSection,
  onOpenSearch,
  onOpenHub,
}) => {
  const { settings } = useAppSettings();
  const copy = UI_COPY[settings.lang];
  const t = copy.header;
  const [showNotifications, setShowNotifications] = useState(false);
  const [soundOn, setSoundOn] = useState<boolean>(() => isSoundEnabled());
  const [desktopOn, setDesktopOn] = useState<boolean>(() => isDesktopNotifEnabled());
  const [notifPerm, setNotifPerm] = useState<string>(() =>
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported',
  );
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playNotificationChime('message', true, settings.chimeTone);
  };

  const handleEnableDesktop = async () => {
    if (notifPerm === 'granted') {
      const next = !desktopOn;
      setDesktopOn(next);
      setDesktopNotifEnabled(next);
      return;
    }
    const res = await requestBrowserNotificationPermission();
    setNotifPerm(res);
    if (res === 'granted') {
      setDesktopOn(true);
      playNotificationChime('alert', true, settings.chimeTone);
    }
  };

  const openNotificationTarget = (n: NotificationItem) => {
    onMarkNotificationRead(n.id);
    setShowNotifications(false);
    if (n.kind === 'grade') onSelectSection('courses');
    else if (n.kind === 'live') onSelectSection('live');
    else if (n.kind === 'social') onSelectSection('community');
    else onSelectSection('assignments');
  };

  const centerTabs = [
    { id: 'home', label: copy.mobile.home, icon: Home },
    { id: 'classes', label: copy.mobile.classes, icon: BookOpen },
    { id: 'courses', label: settings.lang === 'en' ? 'Quizzes' : settings.lang === 'fr' ? 'Quiz' : 'الاختبارات', icon: Award },
    { id: 'assignments', label: copy.mobile.assignments, icon: FileCheck, badge: pendingAssignmentsCount },
    { id: 'community', label: copy.mobile.community, icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Brand / Hub Trigger (tapping logo opens Hub menu!) */}
        <button
          type="button"
          onClick={onOpenHub}
          title={settings.lang === 'en' ? 'Open Menu' : 'فتح القائمة الشاملة'}
          className="min-h-[40px] flex items-center gap-2 px-1.5 py-1 rounded-xl hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#1677c7] text-white flex items-center justify-center font-black text-base">
            N
          </div>
          <span className="font-black text-base sm:text-lg text-slate-900 tracking-tight whitespace-nowrap">
            NEMVIA
          </span>
          <LayoutGrid className="w-4 h-4 text-slate-400" />
        </button>

        {/* Zone 2: Centered Facebook-style Primary Tabs (Desktop md+) */}
        <nav className="hidden md:flex items-stretch h-full gap-1">
          {centerTabs.map(tab => {
            const Icon = tab.icon;
            const active = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectSection(tab.id)}
                title={tab.label}
                className={`relative px-4 lg:px-6 flex items-center gap-2 text-xs font-bold whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                  active
                    ? 'border-[#1677c7] text-[#1677c7]'
                    : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center tabular-nums">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Compact Circular Utility Triggers */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            title={`${t.search} (Ctrl+K)`}
            aria-label={t.search}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('messages')}
            title={copy.mobile.messages}
            aria-label={copy.mobile.messages}
            className="hidden sm:flex w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 items-center justify-center relative transition-colors cursor-pointer shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center tabular-nums">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Notifications */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setSoundOn(isSoundEnabled());
                setShowNotifications(!showNotifications);
              }}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors relative cursor-pointer"
              aria-label={t.notifications}
            >
              {unreadCount > 0 ? <BellRing className="w-4 h-4 text-[#1677c7]" /> : <Bell className="w-4 h-4" />}
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center tabular-nums">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className={`absolute ${settings.lang === 'ar' ? 'left-0' : 'right-0'} mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 space-y-3 z-50`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 gap-2">
                  <span className="font-bold text-xs text-slate-900">
                    {t.notifications} {unreadCount > 0 ? `(${unreadCount} ${t.unread})` : `(${notifications.length})`}
                  </span>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={onMarkAllNotificationsRead}
                        className="text-[11px] font-bold text-[#1677c7] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>{t.markAllRead}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                    >
                      {t.close}
                    </button>
                  </div>
                </div>

                {/* Sound & Device Alerts Controls */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={handleToggleSound}
                    className={`px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                      soundOn ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    <span>{soundOn ? t.soundOn : t.soundOff}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => playNotificationChime('message', true, settings.chimeTone)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                  >
                    {t.testChime}
                  </button>

                  {notifPerm !== 'unsupported' && notifPerm !== 'denied' && (
                    <button
                      type="button"
                      onClick={handleEnableDesktop}
                      className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                        notifPerm === 'granted' && desktopOn
                          ? 'bg-sky-100 text-[#1677c7]'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {notifPerm === 'granted'
                        ? desktopOn
                          ? t.deviceAlertsOn
                          : t.deviceAlertsOff
                        : t.enableDeviceAlerts}
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.length === 0 && (
                    <p className="text-[11px] text-slate-400 text-center py-4">{t.noNotifications}</p>
                  )}
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => openNotificationTarget(n)}
                      className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer border ${
                        n.read
                          ? 'bg-slate-50 border-slate-100 text-slate-600'
                          : 'bg-sky-50/70 border-sky-200 text-slate-800 font-bold'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] text-slate-700 font-bold">{n.title}</span>
                        {!n.read && <span className="text-[10px] text-sky-700 font-bold">{t.newBadge}</span>}
                      </div>
                      <p className="text-[11px] font-normal leading-relaxed">{n.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar (Desktop) */}
          <button
            type="button"
            onClick={() => onSelectSection('profile')}
            title={currentProfile.display_name}
            className="hidden sm:flex w-10 h-10 rounded-full bg-slate-900 text-white items-center justify-center font-bold text-xs overflow-hidden cursor-pointer shrink-0"
          >
            {currentProfile.avatar_url ? (
              <img src={currentProfile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              currentProfile.display_name.slice(0, 1)
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

