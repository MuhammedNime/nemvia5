// Sound chime synthesizer (Web Audio API) + Browser & Native Android Notification helper for NEMVIA
import { LocalNotifications } from '@capacitor/local-notifications';
import { isNativeApp } from './native';

export type ChimeKind = 'message' | 'alert' | 'grade';

const SOUND_PREF_KEY = 'nemvia-notif-sound-enabled';
const DESKTOP_PREF_KEY = 'nemvia-notif-desktop-enabled';
const NATIVE_CHANNEL_ID = 'nemvia-alerts';

let sharedAudioCtx: AudioContext | null = null;
let unlockBound = false;
let nativeNotifInitialized = false;
let nativeNotifSeq = 100;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new Ctx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

export function bindAudioUnlock(): void {
  if (typeof window === 'undefined' || unlockBound) return;
  unlockBound = true;
  const unlock = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  };
  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('keydown', unlock, { passive: true });
}

export function isSoundEnabled(): boolean {
  try {
    const raw = localStorage.getItem(SOUND_PREF_KEY);
    return raw === null ? true : raw === '1';
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(SOUND_PREF_KEY, enabled ? '1' : '0');
  } catch {
    /* ignore */
  }
}

export function isDesktopNotifEnabled(): boolean {
  try {
    const raw = localStorage.getItem(DESKTOP_PREF_KEY);
    return raw === null ? true : raw === '1';
  } catch {
    return true;
  }
}

export function setDesktopNotifEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(DESKTOP_PREF_KEY, enabled ? '1' : '0');
  } catch {
    /* ignore */
  }
}

function getSelectedTone(): 'classic' | 'soft' | 'bright' {
  try {
    const raw = localStorage.getItem('nemvia-app-settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.chimeTone === 'soft' || parsed.chimeTone === 'bright') return parsed.chimeTone;
    }
  } catch {
    /* ignore */
  }
  return 'classic';
}

export async function initNativeNotifications(): Promise<void> {
  if (!isNativeApp() || nativeNotifInitialized) return;
  nativeNotifInitialized = true;
  try {
    await LocalNotifications.createChannel({
      id: NATIVE_CHANNEL_ID,
      name: 'إشعارات NEMVIA',
      description: 'تنبيهات الرسائل والواجبات والاختبارات والحصص المباشرة',
      importance: 4,
      visibility: 1,
      vibration: true,
    });
  } catch {
    /* channel creation optional on older OS */
  }

  try {
    const perm = await LocalNotifications.checkPermissions();
    if (perm.display === 'prompt' || perm.display === 'prompt-with-rationale') {
      const res = await LocalNotifications.requestPermissions();
      if (res.display === 'granted') setDesktopNotifEnabled(true);
    } else if (perm.display === 'granted') {
      setDesktopNotifEnabled(true);
    }
  } catch {
    /* ignore permission errors */
  }

  try {
    await LocalNotifications.addListener('localNotificationActionPerformed', event => {
      const targetSection = event?.notification?.extra?.targetSection;
      if (typeof targetSection === 'string' && targetSection && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('nemvia:open-section', { detail: { targetSection } }));
      }
    });
  } catch {
    /* ignore */
  }
}

export function playNotificationChime(
  kind: ChimeKind = 'message',
  force = false,
  toneOverride?: 'classic' | 'soft' | 'bright',
): void {
  if (!force && !isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const tone = toneOverride || getSelectedTone();

  const scheduleNotes = () => {
    const now = ctx.currentTime;
    let notes: Array<{ freq: number; delay: number; dur: number; peak: number; type: OscillatorType }>;

    if (tone === 'soft') {
      notes = kind === 'grade'
        ? [
            { freq: 440, delay: 0, dur: 0.16, peak: 0.15, type: 'sine' },
            { freq: 554.37, delay: 0.12, dur: 0.22, peak: 0.16, type: 'sine' },
          ]
        : [
            { freq: 523.25, delay: 0, dur: 0.14, peak: 0.15, type: 'sine' },
            { freq: 659.25, delay: 0.11, dur: 0.24, peak: 0.15, type: 'sine' },
          ];
    } else if (tone === 'bright') {
      notes = [
        { freq: 783.99, delay: 0, dur: 0.1, peak: 0.2, type: 'triangle' },
        { freq: 987.77, delay: 0.08, dur: 0.1, peak: 0.2, type: 'triangle' },
        { freq: 1318.51, delay: 0.16, dur: 0.26, peak: 0.22, type: 'sine' },
      ];
    } else {
      notes =
        kind === 'grade'
          ? [
              { freq: 587.33, delay: 0, dur: 0.14, peak: 0.18, type: 'triangle' },
              { freq: 739.99, delay: 0.1, dur: 0.16, peak: 0.2, type: 'triangle' },
              { freq: 880.0, delay: 0.2, dur: 0.28, peak: 0.22, type: 'sine' },
            ]
          : kind === 'alert'
            ? [
                { freq: 880.0, delay: 0, dur: 0.14, peak: 0.2, type: 'sine' },
                { freq: 1174.66, delay: 0.12, dur: 0.24, peak: 0.2, type: 'sine' },
              ]
            : [
                { freq: 783.99, delay: 0, dur: 0.12, peak: 0.22, type: 'sine' },
                { freq: 1046.5, delay: 0.09, dur: 0.26, peak: 0.22, type: 'sine' },
              ];
    }

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = n.type;
      osc.frequency.setValueAtTime(n.freq, now + n.delay);

      gain.gain.setValueAtTime(0.0001, now + n.delay);
      gain.gain.exponentialRampToValueAtTime(n.peak, now + n.delay + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.delay + n.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.delay);
      osc.stop(now + n.delay + n.dur + 0.02);
    });
  };

  if (ctx.state === 'suspended') {
    ctx.resume().then(scheduleNotes).catch(() => {});
  } else {
    scheduleNotes();
  }

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate([80, 40, 80]);
    }
  } catch {
    /* ignore */
  }
}

export async function requestBrowserNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (isNativeApp()) {
    try {
      const perm = await LocalNotifications.requestPermissions();
      if (perm.display === 'granted') {
        setDesktopNotifEnabled(true);
        return 'granted';
      }
      return 'denied';
    } catch {
      return 'unsupported';
    }
  }
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') {
    setDesktopNotifEnabled(true);
    return 'granted';
  }
  const res = await Notification.requestPermission();
  if (res === 'granted') setDesktopNotifEnabled(true);
  return res;
}

export function showBrowserNotification(
  title: string,
  body: string,
  tag = 'nemvia-alert',
  targetSection?: string,
): void {
  if (!isDesktopNotifEnabled()) return;

  if (isNativeApp()) {
    nativeNotifSeq = (nativeNotifSeq % 900000) + 1;
    void LocalNotifications.schedule({
      notifications: [
        {
          id: nativeNotifSeq,
          title,
          body,
          channelId: NATIVE_CHANNEL_ID,
          schedule: { at: new Date(Date.now() + 250) },
          extra: { tag, targetSection },
        },
      ],
    }).catch(() => {});
    return;
  }

  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const opts: NotificationOptions = {
    body,
    tag,
    dir: 'rtl',
    lang: 'ar',
    silent: true,
  };

  if (navigator.serviceWorker?.controller) {
    navigator.serviceWorker.ready
      .then(reg => reg.showNotification(title, opts))
      .catch(() => {
        try { new Notification(title, opts); } catch { /* ignore */ }
      });
    return;
  }

  try {
    new Notification(title, opts);
  } catch {
    /* ignore */
  }
}
