import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Check, RefreshCw } from 'lucide-react';
import { useAppSettings } from '../lib/settings';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  enabled?: boolean;
  children: React.ReactNode;
}

type PullPhase = 'idle' | 'pulling' | 'ready' | 'refreshing' | 'done';

const THRESHOLD = 62;
const MAX_PULL = 98;

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  enabled = true,
  children,
}) => {
  const { settings } = useAppSettings();
  const isEn = settings.lang === 'en';
  const isFr = settings.lang === 'fr';

  const containerRef = useRef<HTMLDivElement | null>(null);
  const startYRef = useRef<number | null>(null);
  const startXRef = useRef<number | null>(null);
  const pullingActiveRef = useRef(false);
  const pullDistanceRef = useRef(0);
  const phaseRef = useRef<PullPhase>('idle');
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  const [pullDistance, setPullDistance] = useState(0);
  const [phase, setPhase] = useState<PullPhase>('idle');
  const [dragging, setDragging] = useState(false);

  const syncPhase = (next: PullPhase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;

    const isInteractiveChild = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'].includes(tag)) return true;
      return Boolean(target.closest('[data-no-pull="true"]'));
    };

    const getScrollTop = () =>
      Math.max(window.scrollY || 0, document.documentElement?.scrollTop || 0, document.body?.scrollTop || 0);

    const onTouchStart = (e: TouchEvent) => {
      if (phaseRef.current === 'refreshing' || phaseRef.current === 'done') return;
      if (e.touches.length !== 1) return;
      if (getScrollTop() > 4) return;
      if (isInteractiveChild(e.target)) return;

      startYRef.current = e.touches[0].clientY;
      startXRef.current = e.touches[0].clientX;
      pullingActiveRef.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (startYRef.current === null || startXRef.current === null) return;
      if (phaseRef.current === 'refreshing' || phaseRef.current === 'done') return;

      const dy = e.touches[0].clientY - startYRef.current;
      const dx = Math.abs(e.touches[0].clientX - startXRef.current);

      // Cancel pull if scrolling horizontally (e.g. Stories carousel) or scrolling down
      if (!pullingActiveRef.current) {
        if (dx > 10 && dx > dy) {
          startYRef.current = null;
          return;
        }
        if (dy < 8 || getScrollTop() > 4) {
          if (dy < -6) startYRef.current = null;
          return;
        }
        pullingActiveRef.current = true;
        setDragging(true);
      }

      if (dy <= 0) {
        pullDistanceRef.current = 0;
        setPullDistance(0);
        syncPhase('idle');
        return;
      }

      if (e.cancelable) e.preventDefault();

      // Tactile rubber-band resistance curve
      const damped = Math.round(MAX_PULL * (1 - Math.exp(-dy / 135)));
      pullDistanceRef.current = damped;
      setPullDistance(damped);
      syncPhase(damped >= THRESHOLD ? 'ready' : 'pulling');
    };

    const onTouchEnd = async () => {
      if (!pullingActiveRef.current) {
        startYRef.current = null;
        startXRef.current = null;
        return;
      }
      pullingActiveRef.current = false;
      startYRef.current = null;
      startXRef.current = null;
      setDragging(false);

      const dist = pullDistanceRef.current;
      if (dist >= THRESHOLD) {
        syncPhase('refreshing');
        pullDistanceRef.current = 58;
        setPullDistance(58);

        const startedAt = Date.now();
        try {
          await onRefreshRef.current();
        } catch {
          // Error notification handled by App run/refresh handler
        }
        const elapsed = Date.now() - startedAt;
        if (elapsed < 550) {
          await new Promise(r => setTimeout(r, 550 - elapsed));
        }

        syncPhase('done');
        await new Promise(r => setTimeout(r, 550));
      }

      pullDistanceRef.current = 0;
      setPullDistance(0);
      syncPhase('idle');
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [enabled]);

  const progress = Math.min(1, pullDistance / THRESHOLD);
  const circumference = 2 * Math.PI * 15;
  const dashOffset = circumference * (1 - progress);
  const showIndicator = pullDistance > 6 || phase === 'refreshing' || phase === 'done';

  const statusLabel =
    phase === 'done'
      ? (isEn ? 'Updated' : isFr ? 'Actualisé' : 'تم التحديث')
      : phase === 'refreshing'
        ? (isEn ? 'Refreshing...' : isFr ? 'Actualisation...' : 'جاري التحديث...')
        : phase === 'ready'
          ? (isEn ? 'Release to refresh' : isFr ? 'Relâcher pour actualiser' : 'أفلت للتحديث')
          : (isEn ? 'Pull to refresh' : isFr ? 'Tirer pour actualiser' : 'اسحب للتحديث');

  return (
    <div ref={containerRef} className="relative touch-pan-y">
      {/* Native Pull-to-Refresh Indicator */}
      <div
        aria-hidden={!showIndicator}
        className="pointer-events-none absolute top-0 left-0 right-0 flex flex-col items-center justify-start z-20 overflow-hidden"
        style={{
          height: `${Math.max(0, pullDistance)}px`,
          opacity: showIndicator ? Math.min(1, Math.max(0.25, progress * 1.15)) : 0,
          transition: dragging ? 'none' : 'height 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease',
        }}
      >
        <div className="mt-1.5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
          <div className="relative w-7 h-7 flex items-center justify-center">
            <svg className="w-7 h-7 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-slate-200"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={phase === 'refreshing' || phase === 'done' ? 0 : dashOffset}
                className={phase === 'done' ? 'text-emerald-600' : 'text-[#1677c7]'}
                style={{ transition: dragging ? 'none' : 'stroke-dashoffset 180ms ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {phase === 'done' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in-75" />
              ) : phase === 'refreshing' ? (
                <RefreshCw className="w-3.5 h-3.5 text-[#1677c7] animate-spin" />
              ) : (
                <ArrowDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    phase === 'ready' ? 'rotate-180 text-[#1677c7]' : 'text-slate-500'
                  }`}
                />
              )}
            </div>
          </div>
          <span className={`text-[11px] font-bold whitespace-nowrap ${
            phase === 'done' ? 'text-emerald-700' : phase === 'ready' || phase === 'refreshing' ? 'text-[#1677c7]' : 'text-slate-600'
          }`}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Feed Content Container */}
      <div
        style={{
          transform: pullDistance > 0 ? `translate3d(0, ${pullDistance}px, 0)` : 'none',
          transition: dragging ? 'none' : 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {children}
      </div>
    </div>
  );
};
