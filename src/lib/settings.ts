import { useEffect, useState } from 'react';
import { syncNativeStatusBar } from './native';

export type AppLang = 'ar' | 'en' | 'fr';
export type AppTheme = 'light' | 'dark' | 'warm';
export type AppAccent = 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'slate';
export type AppFontScale = 'sm' | 'md' | 'lg';
export type ChimeTone = 'classic' | 'soft' | 'bright';

export interface AppSettings {
  lang: AppLang;
  theme: AppTheme;
  accent: AppAccent;
  fontScale: AppFontScale;
  compactMode: boolean;
  reducedMotion: boolean;
  chimeTone: ChimeTone;
  autoReadAloud: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  lang: 'ar',
  theme: 'light',
  accent: 'blue',
  fontScale: 'md',
  compactMode: false,
  reducedMotion: false,
  chimeTone: 'classic',
  autoReadAloud: false,
};

const SETTINGS_KEY = 'nemvia-app-settings';
const SETTINGS_EVENT = 'nemvia-settings-updated';

export const ACCENT_OPTIONS: Array<{ id: AppAccent; labelAr: string; labelEn: string; labelFr: string; hex: string }> = [
  { id: 'blue', labelAr: 'أزرق سماوي', labelEn: 'Sky Blue', labelFr: 'Bleu ciel', hex: '#1677c7' },
  { id: 'emerald', labelAr: 'أخضر زمردي', labelEn: 'Emerald', labelFr: 'Émeraude', hex: '#059669' },
  { id: 'violet', labelAr: 'بنفسجي ملكي', labelEn: 'Violet', labelFr: 'Violet', hex: '#7c3aed' },
  { id: 'amber', labelAr: 'كهرماني دافئ', labelEn: 'Amber', labelFr: 'Ambre', hex: '#d97706' },
  { id: 'rose', labelAr: 'وردي قرمزي', labelEn: 'Rose', labelFr: 'Rose', hex: '#e11d48' },
  { id: 'slate', labelAr: 'كحلي كلاسيكي', labelEn: 'Classic Slate', labelFr: 'Ardoise', hex: '#0f172a' },
];

export function loadAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function applySettingsToDOM(s: AppSettings): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.lang = s.lang;
  root.dir = s.lang === 'ar' ? 'rtl' : 'ltr';
  root.classList.remove('theme-dark', 'theme-warm');
  if (s.theme === 'dark') root.classList.add('theme-dark');
  else if (s.theme === 'warm') root.classList.add('theme-warm');
  root.setAttribute('data-accent', s.accent);
  root.setAttribute('data-font-scale', s.fontScale);
  root.setAttribute('data-density', s.compactMode ? 'compact' : 'comfortable');
  root.setAttribute('data-reduced-motion', s.reducedMotion ? '1' : '0');
  void syncNativeStatusBar(s.theme);
}

export function saveAppSettings(next: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  applySettingsToDOM(next);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<AppSettings>(SETTINGS_EVENT, { detail: next }));
  }
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => loadAppSettings());

  useEffect(() => {
    applySettingsToDOM(settings);
    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent<AppSettings>).detail;
      if (detail) setSettings(detail);
    };
    window.addEventListener(SETTINGS_EVENT, handler);
    return () => window.removeEventListener(SETTINGS_EVENT, handler);
  }, []);

  const updateSettings = (patch: Partial<AppSettings>) => {
    const merged = { ...loadAppSettings(), ...patch };
    setSettings(merged);
    saveAppSettings(merged);
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    saveAppSettings(DEFAULT_SETTINGS);
  };

  return { settings, updateSettings, resetSettings };
}

export const UI_COPY: Record<AppLang, {
  nav: Record<string, string>;
  header: {
    aiAssistant: string;
    days: string;
    roleTeacher: string;
    roleAdmin: string;
    roleStudent: string;
    signOut: string;
    settings: string;
    notifications: string;
    unread: string;
    markAllRead: string;
    close: string;
    noNotifications: string;
    newBadge: string;
    soundOn: string;
    soundOff: string;
    testChime: string;
    deviceAlertsOn: string;
    deviceAlertsOff: string;
    enableDeviceAlerts: string;
    search: string;
  };
  mobile: {
    home: string;
    classes: string;
    assignments: string;
    community: string;
    messages: string;
    more: string;
    close: string;
  };
}> = {
  ar: {
    nav: {
      home: 'الرئيسية والمتابعة',
      ai: 'المعلّم الذكي (AI)',
      classes: 'الصفوف والمجموعات',
      courses: 'المحتوى والاختبارات',
      calendar: 'التقويم والمواعيد',
      grades: 'سجل الدرجات',
      tools: 'أدوات الدراسة والمختبر',
      flashcards: 'بطاقات المراجعة (Flashcards)',
      pomodoro: 'غرفة التركيز بومودورو',
      grapher: 'محاكي الدوال والمختبر',
      certificate: 'شهادة الإنجاز',
      badges: 'لوحة الشرف والأوسمة',
      assignments: 'الواجبات والتسليمات',
      community: 'المجتمع والقصص 24h',
      live: 'الحصص المباشرة',
      messages: 'المجموعات وخزينة الملفات',
      admin: 'لوحة الإدارة والأمان',
      profile: 'ملفي الشخصي',
      settings: 'الإعدادات والتخصيص',
      legal: 'الخصوصية والشروط',
    },
    header: {
      aiAssistant: 'المساعد الذكي',
      days: 'أيام',
      roleTeacher: 'معلم',
      roleAdmin: 'إدارة',
      roleStudent: 'طالب',
      signOut: 'تسجيل الخروج',
      settings: 'الإعدادات',
      notifications: 'الإشعارات',
      unread: 'جديد',
      markAllRead: 'قراءة الكل',
      close: 'إغلاق',
      noNotifications: 'لا توجد إشعارات بعد',
      newBadge: 'جديد',
      soundOn: 'الصوت مفعّل',
      soundOff: 'الصوت صامت',
      testChime: 'تجربة الرنّة',
      deviceAlertsOn: 'تنبيهات الجهاز ✓',
      deviceAlertsOff: 'تنبيهات الجهاز (موقفة)',
      enableDeviceAlerts: 'تفعيل تنبيهات الجهاز',
      search: 'بحث شامل',
    },
    mobile: {
      home: 'الرئيسية',
      classes: 'الصفوف',
      assignments: 'الواجبات',
      community: 'المجتمع',
      messages: 'الرسائل',
      more: 'المزيد',
      close: 'إغلاق',
    },
  },
  en: {
    nav: {
      home: 'Home & Overview',
      ai: 'AI Tutor Studio',
      classes: 'Classes & Groups',
      courses: 'Courses & Quizzes',
      calendar: 'Calendar & Schedule',
      grades: 'Gradebook',
      tools: 'Study Tools & Lab',
      flashcards: 'Smart Flashcards',
      pomodoro: 'Pomodoro Focus',
      grapher: 'Math Grapher Lab',
      certificate: 'Certificates',
      badges: 'Badges & Honors',
      assignments: 'Assignments',
      community: 'Community & Stories',
      live: 'Live Classroom',
      messages: 'Messages & Vault',
      admin: 'Admin & Safety',
      profile: 'My Profile',
      settings: 'Settings & Theme',
      legal: 'Privacy & Terms',
    },
    header: {
      aiAssistant: 'AI Tutor',
      days: 'days',
      roleTeacher: 'Teacher',
      roleAdmin: 'Admin',
      roleStudent: 'Student',
      signOut: 'Sign Out',
      settings: 'Settings',
      notifications: 'Notifications',
      unread: 'new',
      markAllRead: 'Mark all read',
      close: 'Close',
      noNotifications: 'No notifications yet',
      newBadge: 'New',
      soundOn: 'Sound On',
      soundOff: 'Muted',
      testChime: 'Test Chime',
      deviceAlertsOn: 'Device Alerts ✓',
      deviceAlertsOff: 'Device Alerts (Off)',
      enableDeviceAlerts: 'Enable Device Alerts',
      search: 'Search',
    },
    mobile: {
      home: 'Home',
      classes: 'Classes',
      assignments: 'Tasks',
      community: 'Community',
      messages: 'Messages',
      more: 'More',
      close: 'Close',
    },
  },
  fr: {
    nav: {
      home: 'Accueil & Suivi',
      ai: 'Tuteur IA',
      classes: 'Classes & Groupes',
      courses: 'Cours & Quiz',
      calendar: 'Calendrier',
      grades: 'Relevé de notes',
      tools: 'Outils d’étude',
      flashcards: 'Cartes Mémoire',
      pomodoro: 'Minuteur Pomodoro',
      grapher: 'Laboratoire Maths',
      certificate: 'Certificats',
      badges: 'Badges & Honneurs',
      assignments: 'Devoirs',
      community: 'Communauté',
      live: 'Classe en Direct',
      messages: 'Messages & Fichiers',
      admin: 'Administration',
      profile: 'Mon Profil',
      settings: 'Paramètres & Thème',
      legal: 'Confidentialité',
    },
    header: {
      aiAssistant: 'Tuteur IA',
      days: 'jours',
      roleTeacher: 'Enseignant',
      roleAdmin: 'Admin',
      roleStudent: 'Étudiant',
      signOut: 'Déconnexion',
      settings: 'Paramètres',
      notifications: 'Notifications',
      unread: 'nouveau',
      markAllRead: 'Tout lire',
      close: 'Fermer',
      noNotifications: 'Aucune notification',
      newBadge: 'Nouveau',
      soundOn: 'Son activé',
      soundOff: 'Muet',
      testChime: 'Tester le son',
      deviceAlertsOn: 'Alertes appareil ✓',
      deviceAlertsOff: 'Alertes (Désactivé)',
      enableDeviceAlerts: 'Activer alertes',
      search: 'Rechercher',
    },
    mobile: {
      home: 'Accueil',
      classes: 'Classes',
      assignments: 'Devoirs',
      community: 'Réseau',
      messages: 'Messages',
      more: 'Plus',
      close: 'Fermer',
    },
  },
};
