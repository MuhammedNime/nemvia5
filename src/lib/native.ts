import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

export const ANDROID_APP_ID = 'com.nemvia.app';
export const ANDROID_AUTH_REDIRECT_URL = 'com.nemvia.app://auth-callback';
const DEFAULT_REMOTE_API_BASE = 'https://nemvia-app.onrender.com';

export function isNativeApp(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export function isNativeAndroid(): boolean {
  try {
    return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
  } catch {
    return false;
  }
}

export function getApiBaseUrl(): string {
  const configured = (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_APP_URL ||
    ''
  ).trim().replace(/\/+$/, '');

  if (isNativeApp()) {
    return configured || DEFAULT_REMOTE_API_BASE;
  }
  return configured;
}

export function resolveApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const base = getApiBaseUrl();
  return base ? `${base}${normalized}` : normalized;
}

export function getAppRedirectUrl(): string {
  if (isNativeApp()) return ANDROID_AUTH_REDIRECT_URL;
  if (typeof window !== 'undefined') return window.location.origin;
  return DEFAULT_REMOTE_API_BASE;
}

export async function openExternalUrl(url: string): Promise<void> {
  if (!url) return;
  if (isNativeApp()) {
    try {
      await Browser.open({ url, toolbarColor: '#0f233a' });
      return;
    } catch {
      // fall through
    }
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file data'));
    reader.onload = () => {
      const result = String(reader.result || '');
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.readAsDataURL(blob);
  });
}

export async function saveOrShareBlobFile(blob: Blob, filename: string): Promise<void> {
  const safeFilename = (filename || 'nemvia-file').replace(/[\\/:*?"<>|]+/g, '_');

  if (isNativeApp()) {
    try {
      const base64 = await blobToBase64(blob);
      const written = await Filesystem.writeFile({
        path: safeFilename,
        data: base64,
        directory: Directory.Cache,
        recursive: true,
      });
      await Share.share({
        title: safeFilename,
        url: written.uri,
        dialogTitle: safeFilename,
      });
      return;
    } catch {
      // Fallback to browser anchor if Filesystem/Share unavailable
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = safeFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function shareAppLink(title: string, text: string, url: string): Promise<void> {
  if (isNativeApp()) {
    try {
      await Share.share({ title, text, url, dialogTitle: title });
      return;
    } catch {
      /* ignore cancel */
    }
  }
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return;
    } catch {
      /* ignore cancel */
    }
  }
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(url).catch(() => {});
  }
}

export async function syncNativeStatusBar(theme: 'light' | 'dark' | 'warm'): Promise<void> {
  if (!isNativeApp()) return;
  try {
    await StatusBar.setOverlaysWebView({ overlay: false });
    if (theme === 'dark') {
      await StatusBar.setBackgroundColor({ color: '#111827' });
      await StatusBar.setStyle({ style: Style.Dark });
    } else if (theme === 'warm') {
      await StatusBar.setBackgroundColor({ color: '#fffdf8' });
      await StatusBar.setStyle({ style: Style.Light });
    } else {
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
      await StatusBar.setStyle({ style: Style.Light });
    }
  } catch {
    /* ignore */
  }
}

export function initNativeAndroidShell(options: {
  onBackButton: () => boolean; // return true if handled in-app, false to exit
  onAuthDeepLink?: (kind: 'recovery' | 'signed_in') => void;
  onResume?: () => void;
  initialTheme?: 'light' | 'dark' | 'warm';
}): () => void {
  if (!isNativeApp()) return () => {};

  const listeners: Array<{ remove: () => Promise<void> }> = [];
  let disposed = false;

  (async () => {
    await syncNativeStatusBar(options.initialTheme || 'light');
    try {
      await SplashScreen.hide();
    } catch {
      /* ignore */
    }
  })();

  // Intercept external target="_blank" links so Jitsi/Meet/PDF links open in Chrome Custom Tabs
  const onDocumentClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
    if (!anchor) return;
    const href = anchor.getAttribute('href') || '';
    if (anchor.target === '_blank' && /^https?:\/\//i.test(href) && !href.startsWith('https://localhost')) {
      e.preventDefault();
      void openExternalUrl(href);
    }
  };
  document.addEventListener('click', onDocumentClick, true);

  CapApp.addListener('backButton', ({ canGoBack }) => {
    const handled = options.onBackButton();
    if (!handled) {
      if (canGoBack && window.history.length > 1) {
        window.history.back();
      } else {
        void CapApp.exitApp();
      }
    }
  }).then(handle => {
    if (disposed) void handle.remove();
    else listeners.push(handle);
  });

  CapApp.addListener('appUrlOpen', async ({ url }) => {
    if (url.startsWith(ANDROID_AUTH_REDIRECT_URL)) {
      await Browser.close().catch(() => {});
      options.onAuthDeepLink?.('signed_in');
    }
  }).then(handle => {
    if (disposed) void handle.remove();
    else listeners.push(handle);
  });

  if (options.onResume) {
    CapApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) options.onResume?.();
    }).then(handle => {
      if (disposed) void handle.remove();
      else listeners.push(handle);
    });
  }

  return () => {
    disposed = true;
    document.removeEventListener('click', onDocumentClick, true);
    listeners.forEach(l => void l.remove());
  };
}
