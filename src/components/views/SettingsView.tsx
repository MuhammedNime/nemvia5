import React, { useState } from 'react';
import {
  Bell,
  Check,
  Download,
  Globe,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  Sliders,
  Sparkles,
  Sun,
  Type,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Profile } from '../../types';
import {
  ACCENT_OPTIONS,
  AppFontScale,
  AppLang,
  AppTheme,
  ChimeTone,
  useAppSettings,
} from '../../lib/settings';
import {
  isDesktopNotifEnabled,
  isSoundEnabled,
  playNotificationChime,
  requestBrowserNotificationPermission,
  setDesktopNotifEnabled,
  setSoundEnabled,
} from '../../lib/notifications';
import { loadQuestionBank } from '../../lib/questionBank';
import { saveOrShareBlobFile } from '../../lib/native';

interface SettingsViewProps {
  currentProfile: Profile;
  onNotify: (msg: string, ok?: boolean) => void;
}

const LABELS: Record<AppLang, {
  title: string;
  subtitle: string;
  langTitle: string;
  langDesc: string;
  themeTitle: string;
  themeDesc: string;
  themeLight: string;
  themeDark: string;
  themeWarm: string;
  accentTitle: string;
  accentDesc: string;
  previewBadge: string;
  previewText: string;
  previewBtn: string;
  displayTitle: string;
  fontSize: string;
  fontSm: string;
  fontMd: string;
  fontLg: string;
  compactMode: string;
  compactDesc: string;
  reducedMotion: string;
  reducedMotionDesc: string;
  soundTitle: string;
  soundToggle: string;
  soundDesc: string;
  chimeTone: string;
  toneClassic: string;
  toneSoft: string;
  toneBright: string;
  testChime: string;
  desktopAlerts: string;
  desktopDesc: string;
  desktopOn: string;
  desktopOff: string;
  desktopBlocked: string;
  dataTitle: string;
  dataDesc: string;
  exportBtn: string;
  resetBtn: string;
  exportedMsg: string;
  resetMsg: string;
  permDeniedMsg: string;
  permGrantedMsg: string;
}> = {
  ar: {
    title: 'الإعدادات والتخصيص',
    subtitle: 'تحكّم باللغة، شكل التطبيق، الألوان، حجم الخط، والأصوات كما يناسبك.',
    langTitle: 'اللغة واتجاه الواجهة',
    langDesc: 'تغيير لغة القوائم واتجاه العرض (RTL / LTR) فوراً.',
    themeTitle: 'مظهر التطبيق',
    themeDesc: 'اختر الوضع المناسب لوقت دراستك.',
    themeLight: 'نهاري فاتح',
    themeDark: 'ليلي داكن',
    themeWarm: 'ورقي دافئ',
    accentTitle: 'لون التمييز الأساسي',
    accentDesc: 'يتغيّر لون الأزرار والتبويبات والعناصر النشطة في كامل المنصة.',
    previewBadge: 'معاينة فورية',
    previewText: 'هكذا يبدو المظهر والألوان المختارة الآن',
    previewBtn: 'زر تجريبي',
    displayTitle: 'الخط والعرض',
    fontSize: 'حجم الخط العام',
    fontSm: 'مضغوط',
    fontMd: 'افتراضي',
    fontLg: 'كبير مريح',
    compactMode: 'وضع العرض المكثف',
    compactDesc: 'يقلل الفراغات الجانبية لعرض محتوى أكثر في الشاشة.',
    reducedMotion: 'تقليل الحركات والانتقالات',
    reducedMotionDesc: 'يلغي الأنيميشن لراحة العين وسرعة الاستجابة.',
    soundTitle: 'الأصوات والتنبيهات',
    soundToggle: 'تشغيل صوت الإشعارات والرسائل',
    soundDesc: 'رنّة لطيفة عند وصول رسالة جديدة أو إشعار أو درجة.',
    chimeTone: 'نغمة الإشعارات',
    toneClassic: 'كلاسيكية',
    toneSoft: 'هادئة',
    toneBright: 'مشرقة',
    testChime: 'تجربة الصوت',
    desktopAlerts: 'تنبيهات المتصفح / الجهاز',
    desktopDesc: 'تظهر حتى عند استخدام تبويب آخر.',
    desktopOn: 'مفعّلة ✓',
    desktopOff: 'تفعيل الآن',
    desktopBlocked: 'مرفوضة من المتصفح',
    dataTitle: 'النسخ الاحتياطي وإعادة الضبط',
    dataDesc: 'تصدير بطاقات المراجعة وبنك الأسئلة المحلي كملف JSON، أو استعادة الإعدادات.',
    exportBtn: 'تصدير بياناتي (JSON)',
    resetBtn: 'إعادة الإعدادات الافتراضية',
    exportedMsg: 'تم تنزيل نسخة احتياطية من بياناتك المحلية بنجاح',
    resetMsg: 'تمت استعادة الإعدادات الافتراضية',
    permDeniedMsg: 'المتصفح يحظر الإشعارات، فعّلها من إعدادات الموقع في المتصفح',
    permGrantedMsg: 'تم تفعيل تنبيهات الجهاز بنجاح',
  },
  en: {
    title: 'Settings & Customization',
    subtitle: 'Personalize language, theme mode, accent colors, typography, and notification chimes.',
    langTitle: 'Language & Layout Direction',
    langDesc: 'Switch interface language and RTL/LTR direction immediately.',
    themeTitle: 'Appearance Mode',
    themeDesc: 'Pick the theme that matches your study environment.',
    themeLight: 'Clean Light',
    themeDark: 'Night Dark',
    themeWarm: 'Warm Paper',
    accentTitle: 'Primary Accent Color',
    accentDesc: 'Applies to active tabs, primary buttons, and highlights across the app.',
    previewBadge: 'Live Preview',
    previewText: 'This is how your active color & surface look',
    previewBtn: 'Sample Button',
    displayTitle: 'Typography & Layout',
    fontSize: 'Global Font Size',
    fontSm: 'Compact',
    fontMd: 'Default',
    fontLg: 'Large',
    compactMode: 'Compact Spacing Mode',
    compactDesc: 'Reduces outer padding to fit more content on screen.',
    reducedMotion: 'Reduce Motion',
    reducedMotionDesc: 'Minimizes animations and transitions across views.',
    soundTitle: 'Sounds & Alerts',
    soundToggle: 'Notification & Message Chime',
    soundDesc: 'Plays a chime when new messages, grades, or alerts arrive.',
    chimeTone: 'Chime Style',
    toneClassic: 'Classic',
    toneSoft: 'Soft',
    toneBright: 'Bright',
    testChime: 'Test Chime',
    desktopAlerts: 'Device / Browser Notifications',
    desktopDesc: 'Shown even when working in another tab.',
    desktopOn: 'Enabled ✓',
    desktopOff: 'Enable Now',
    desktopBlocked: 'Blocked in Browser',
    dataTitle: 'Backup & Reset',
    dataDesc: 'Export your local flashcards & question bank as JSON, or restore defaults.',
    exportBtn: 'Export Local Data (JSON)',
    resetBtn: 'Reset to Defaults',
    exportedMsg: 'Backup JSON downloaded successfully',
    resetMsg: 'Settings restored to defaults',
    permDeniedMsg: 'Notifications are blocked in your browser site settings',
    permGrantedMsg: 'Device notifications enabled',
  },
  fr: {
    title: 'Paramètres & Personnalisation',
    subtitle: 'Personnalisez la langue, le thème, les couleurs, la taille du texte et les sons.',
    langTitle: 'Langue & Direction',
    langDesc: 'Changez la langue et le sens d’affichage (RTL / LTR) instantanément.',
    themeTitle: 'Thème Visuel',
    themeDesc: 'Choisissez le mode adapté à votre confort de lecture.',
    themeLight: 'Clair',
    themeDark: 'Sombre',
    themeWarm: 'Papier Chaud',
    accentTitle: 'Couleur Principale',
    accentDesc: 'S’applique aux boutons principaux, onglets actifs et indicateurs.',
    previewBadge: 'Aperçu en direct',
    previewText: 'Voici l’apparence actuelle de votre thème',
    previewBtn: 'Bouton test',
    displayTitle: 'Texte & Affichage',
    fontSize: 'Taille de police',
    fontSm: 'Compact',
    fontMd: 'Standard',
    fontLg: 'Grand',
    compactMode: 'Mode d’affichage compact',
    compactDesc: 'Réduit les marges pour afficher plus d’informations.',
    reducedMotion: 'Réduire les animations',
    reducedMotionDesc: 'Désactive les transitions rapides pour plus de confort.',
    soundTitle: 'Sons & Notifications',
    soundToggle: 'Son des messages et alertes',
    soundDesc: 'Joue une sonnerie lors d’un nouveau message ou d’une note.',
    chimeTone: 'Style de sonnerie',
    toneClassic: 'Classique',
    toneSoft: 'Douce',
    toneBright: 'Claire',
    testChime: 'Tester le son',
    desktopAlerts: 'Alertes Navigateur / Appareil',
    desktopDesc: 'Visibles même depuis un autre onglet.',
    desktopOn: 'Activées ✓',
    desktopOff: 'Activer',
    desktopBlocked: 'Bloquées',
    dataTitle: 'Sauvegarde & Réinitialisation',
    dataDesc: 'Exportez vos cartes et votre banque de questions en JSON ou réinitialisez.',
    exportBtn: 'Exporter mes données (JSON)',
    resetBtn: 'Réinitialiser',
    exportedMsg: 'Sauvegarde JSON téléchargée avec succès',
    resetMsg: 'Paramètres réinitialisés',
    permDeniedMsg: 'Les notifications sont bloquées dans les paramètres du navigateur',
    permGrantedMsg: 'Alertes appareil activées',
  },
};

export const SettingsView: React.FC<SettingsViewProps> = ({ currentProfile, onNotify }) => {
  const { settings, updateSettings, resetSettings } = useAppSettings();
  const t = LABELS[settings.lang];

  const [soundOn, setSoundOn] = useState<boolean>(() => isSoundEnabled());
  const [desktopOn, setDesktopOn] = useState<boolean>(() => isDesktopNotifEnabled());
  const [notifPerm, setNotifPerm] = useState<string>(() =>
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported',
  );

  const handleSoundToggle = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playNotificationChime('message', true, settings.chimeTone);
  };

  const handleToneSelect = (tone: ChimeTone) => {
    updateSettings({ chimeTone: tone });
    playNotificationChime('message', true, tone);
  };

  const handleDesktopToggle = async () => {
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
      onNotify(t.permGrantedMsg, true);
    } else if (res === 'denied') {
      onNotify(t.permDeniedMsg, false);
    }
  };

  const handleExportLocalData = () => {
    let flashcards: unknown = [];
    try {
      const rawCards = localStorage.getItem(`nemvia-cards-${currentProfile.id}`);
      if (rawCards) flashcards = JSON.parse(rawCards);
    } catch {
      /* ignore */
    }
    const bank = loadQuestionBank(currentProfile.id);
    const payload = {
      exportedAt: new Date().toISOString(),
      user: {
        id: currentProfile.id,
        name: currentProfile.display_name,
        role: currentProfile.role,
      },
      settings,
      flashcards,
      questionBank: bank,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    void saveOrShareBlobFile(blob, `nemvia-backup-${new Date().toISOString().slice(0, 10)}.json`);
    onNotify(t.exportedMsg, true);
  };

  const handleResetAll = () => {
    resetSettings();
    setSoundEnabled(true);
    setSoundOn(true);
    onNotify(t.resetMsg, true);
  };

  const accentLabel = (opt: typeof ACCENT_OPTIONS[number]) =>
    settings.lang === 'en' ? opt.labelEn : settings.lang === 'fr' ? opt.labelFr : opt.labelAr;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1677c7] text-white flex items-center justify-center shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">{t.title}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{t.subtitle}</p>
          </div>
        </div>
        <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
          {currentProfile.display_name}
        </span>
      </div>

      {/* Language & Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Language */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-[#1677c7]" />
            <div>
              <h2 className="font-black text-sm text-slate-900">{t.langTitle}</h2>
              <p className="text-[11px] text-slate-500">{t.langDesc}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: 'ar', label: 'العربية', sub: 'RTL' },
              { id: 'en', label: 'English', sub: 'LTR' },
              { id: 'fr', label: 'Français', sub: 'LTR' },
            ] as Array<{ id: AppLang; label: string; sub: string }>).map(lang => {
              const active = settings.lang === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => updateSettings({ lang: lang.id })}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    active
                      ? 'bg-[#1677c7] text-white border-[#1677c7] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="block font-black text-xs">{lang.label}</span>
                  <span className={`block text-[10px] mt-0.5 ${active ? 'text-white/80' : 'text-slate-400'}`}>
                    {lang.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Theme Mode */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <Monitor className="w-4 h-4 text-[#1677c7]" />
            <div>
              <h2 className="font-black text-sm text-slate-900">{t.themeTitle}</h2>
              <p className="text-[11px] text-slate-500">{t.themeDesc}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: 'light', label: t.themeLight, icon: Sun, swatch: 'bg-white border-slate-300' },
              { id: 'dark', label: t.themeDark, icon: Moon, swatch: 'bg-slate-900 border-slate-700' },
              { id: 'warm', label: t.themeWarm, icon: Sparkles, swatch: 'bg-[#f4ede0] border-[#d6c9b0]' },
            ] as Array<{ id: AppTheme; label: string; icon: any; swatch: string }>).map(item => {
              const Icon = item.icon;
              const active = settings.theme === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => updateSettings({ theme: item.id })}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    active
                      ? 'border-[#1677c7] bg-sky-50 text-[#1677c7]'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full border ${item.swatch} flex items-center justify-center`}>
                    <Icon className="w-3.5 h-3.5 text-slate-600" />
                  </span>
                  <span className="font-bold text-[11px]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Accent Color + Live Preview */}
      <section className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <Palette className="w-4 h-4 text-[#1677c7]" />
          <div>
            <h2 className="font-black text-sm text-slate-900">{t.accentTitle}</h2>
            <p className="text-[11px] text-slate-500">{t.accentDesc}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {ACCENT_OPTIONS.map(opt => {
            const active = settings.accent === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateSettings({ accent: opt.id })}
                className={`p-2.5 rounded-2xl border flex items-center gap-2 transition-all cursor-pointer ${
                  active ? 'border-[#1677c7] bg-slate-50 shadow-xs' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span
                  className="w-6 h-6 rounded-xl flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: opt.hex }}
                >
                  {active && <Check className="w-3.5 h-3.5" />}
                </span>
                <span className="text-[11px] font-bold text-slate-800 truncate">{accentLabel(opt)}</span>
              </button>
            );
          })}
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-[#1677c7] text-white text-[10px] font-black">
              {t.previewBadge}
            </span>
            <span className="text-xs font-bold text-slate-700">{t.previewText}</span>
          </div>
          <button
            type="button"
            onClick={() => playNotificationChime('grade', true, settings.chimeTone)}
            className="px-3.5 py-1.5 rounded-xl bg-[#1677c7] hover:bg-[#125fa0] text-white text-xs font-bold cursor-pointer"
          >
            {t.previewBtn}
          </button>
        </div>
      </section>

      {/* Typography & Display + Sound & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Typography & Density */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <Type className="w-4 h-4 text-[#1677c7]" />
            <h2 className="font-black text-sm text-slate-900">{t.displayTitle}</h2>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 block">{t.fontSize}</span>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: 'sm', label: t.fontSm },
                { id: 'md', label: t.fontMd },
                { id: 'lg', label: t.fontLg },
              ] as Array<{ id: AppFontScale; label: string }>).map(f => {
                const active = settings.fontScale === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => updateSettings({ fontScale: f.id })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                      active
                        ? 'bg-[#1677c7] text-white border-[#1677c7]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <span className="block text-xs font-bold text-slate-900">{t.compactMode}</span>
              <span className="block text-[11px] text-slate-500">{t.compactDesc}</span>
            </div>
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={e => updateSettings({ compactMode: e.target.checked })}
              className="w-4 h-4 accent-[#1677c7]"
            />
          </label>

          <label className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <span className="block text-xs font-bold text-slate-900">{t.reducedMotion}</span>
              <span className="block text-[11px] text-slate-500">{t.reducedMotionDesc}</span>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={e => updateSettings({ reducedMotion: e.target.checked })}
              className="w-4 h-4 accent-[#1677c7]"
            />
          </label>
        </section>

        {/* Sound & Notifications */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-[#1677c7]" />
            <h2 className="font-black text-sm text-slate-900">{t.soundTitle}</h2>
          </div>

          <button
            type="button"
            onClick={handleSoundToggle}
            className="w-full flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer text-start"
          >
            <div>
              <span className="block text-xs font-bold text-slate-900">{t.soundToggle}</span>
              <span className="block text-[11px] text-slate-500">{t.soundDesc}</span>
            </div>
            <span
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                soundOn ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </span>
          </button>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">{t.chimeTone}</span>
              <button
                type="button"
                onClick={() => playNotificationChime('message', true, settings.chimeTone)}
                className="text-[11px] font-bold text-[#1677c7] hover:underline cursor-pointer"
              >
                {t.testChime}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: 'classic', label: t.toneClassic },
                { id: 'soft', label: t.toneSoft },
                { id: 'bright', label: t.toneBright },
              ] as Array<{ id: ChimeTone; label: string }>).map(tone => {
                const active = settings.chimeTone === tone.id;
                return (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => handleToneSelect(tone.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                      active
                        ? 'bg-[#1677c7] text-white border-[#1677c7]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tone.label}
                  </button>
                );
              })}
            </div>
          </div>

          {notifPerm !== 'unsupported' && (
            <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="block text-xs font-bold text-slate-900">{t.desktopAlerts}</span>
                <span className="block text-[11px] text-slate-500">{t.desktopDesc}</span>
              </div>
              <button
                type="button"
                onClick={handleDesktopToggle}
                disabled={notifPerm === 'denied'}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer shrink-0 ${
                  notifPerm === 'denied'
                    ? 'bg-rose-50 text-rose-600 cursor-not-allowed'
                    : notifPerm === 'granted' && desktopOn
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-[#1677c7] text-white'
                }`}
              >
                {notifPerm === 'denied'
                  ? t.desktopBlocked
                  : notifPerm === 'granted' && desktopOn
                    ? t.desktopOn
                    : t.desktopOff}
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Data Backup & Reset */}
      <section className="bg-white rounded-3xl border border-slate-200 p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-black text-sm text-slate-900">{t.dataTitle}</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">{t.dataDesc}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportLocalData}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportBtn}</span>
          </button>
          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetBtn}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
