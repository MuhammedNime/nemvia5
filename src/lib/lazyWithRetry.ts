import React, { lazy } from 'react';

const RELOAD_STAMP_KEY = 'nemvia:chunk_reload_at';

function isChunkLoadError(err: unknown): boolean {
  const msg = String((err as any)?.message || err || '');
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk [\d]+ failed/i.test(msg);
}

export function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    let lastError: unknown;
    const delays = [250, 650];

    for (let attempt = 0; attempt <= delays.length; attempt++) {
      try {
        return await factory();
      } catch (err) {
        lastError = err;
        if (!isChunkLoadError(err) || attempt === delays.length) {
          break;
        }
        await new Promise(resolve => window.setTimeout(resolve, delays[attempt]));
      }
    }

    if (typeof window !== 'undefined' && isChunkLoadError(lastError)) {
      try {
        const lastReload = Number(sessionStorage.getItem(RELOAD_STAMP_KEY) || '0');
        const now = Date.now();
        if (!lastReload || now - lastReload > 15000) {
          sessionStorage.setItem(RELOAD_STAMP_KEY, String(now));
          window.location.reload();
          return await new Promise<{ default: T }>(() => {});
        }
      } catch {
        /* fall through and let ErrorBoundary handle */
      }
    }

    throw lastError;
  });
}
