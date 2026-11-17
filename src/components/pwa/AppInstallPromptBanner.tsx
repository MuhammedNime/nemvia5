import React, { useEffect, useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';
import { isNativeApp, resolveApiUrl } from '../../lib/native';

const DISMISS_KEY = 'nemvia-install-prompt-dismissed-at';
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const AppInstallPromptBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [visible, setVisible] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [apkAvailable, setApkAvailable] = useState(true);
  const [apkUrl, setApkUrl] = useState<string>(resolveApiUrl('/download/nemvia.apk'));

  useEffect(() => {
    if (isInstalled || isNativeApp()) return;

    try {
      const raw = Number(localStorage.getItem(DISMISS_KEY) || 0);
      if (raw && Date.now() - raw < DISMISS_TTL_MS) return;
    } catch {
      /* ignore */
    }

    fetch(resolveApiUrl('/api/health'))
      .then(r => r.json())
      .then((d: { apkAvailable?: boolean; apkUrl?: string }) => {
        if (d?.apkAvailable === false) setApkAvailable(false);
        else setApkAvailable(true);
        if (d?.apkUrl) {
          setApkUrl(d.apkUrl.startsWith('http') ? d.apkUrl : resolveApiUrl(d.apkUrl));
        }
      })
      .catch(() => {});

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 10000);

    return () => window.clearTimeout(timer);
  }, [isInstalled]);

  if (isInstalled || isNativeApp()) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  };

  const handleInstall = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) setVisible(false);
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      {visible && (
        <div
          dir="rtl"
          role="dialog"
          aria-label="تثبيت تطبيق NEMVIA"
          className="fixed bottom-20 md:bottom-5 left-3 right-3 sm:right-auto sm:w-96 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 flex items-start gap-3 animate-in fade-in"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-[#1677c7] flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0 space-y-2 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-black text-slate-900 text-sm">هل تريد تنزيل NEMVIA كتطبيق؟</h4>
                <p className="text-slate-600 leading-relaxed mt-0.5">
                  أضفه إلى شاشتك الرئيسية أو حمّل تطبيق Android (APK) مباشرة على هاتفك.
                </p>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label="إغلاق"
                className="p-1.5 -mt-1 -ml-1 text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <button
                type="button"
                onClick={handleInstall}
                className="min-h-[40px] px-3.5 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تثبيت التطبيق</span>
              </button>

              {apkAvailable && !isIOS && (
                <a
                  href={apkUrl}
                  download="NEMVIA.apk"
                  className="min-h-[40px] px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تنزيل APK</span>
                </a>
              )}

              <button
                type="button"
                onClick={dismiss}
                className="min-h-[40px] px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer whitespace-nowrap"
              >
                لاحقاً
              </button>
            </div>
          </div>
        </div>
      )}

      {showGuide && (
        <div
          className="fixed inset-0 z-[70] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowGuide(false)}
        >
          <div
            dir="rtl"
            className="bg-white rounded-3xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs animate-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#1677c7] flex items-center justify-center font-bold">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">تثبيت NEMVIA على جهازك</h3>
                  <span className="text-[10px] text-slate-400">خطوات سريعة للتشغيل كتطبيق</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isIOS ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-slate-700 leading-relaxed">
                <p>1. افتح الموقع في متصفح <strong>Safari</strong>.</p>
                <p>2. اضغط على زر <strong>مشاركة (Share)</strong> في الأسفل.</p>
                <p>3. اختر <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home Screen)</strong>.</p>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-slate-700 leading-relaxed">
                <p>1. افتح قائمة المتصفح (<strong>⋮</strong>) في الأعلى.</p>
                <p>2. اختر <strong>«تثبيت التطبيق»</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.</p>
                <p>3. ستظهر أيقونة NEMVIA بجانب تطبيقات هاتفك فوراً.</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setShowGuide(false);
                dismiss();
              }}
              className="w-full min-h-[44px] py-2.5 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl cursor-pointer"
            >
              فهمت، حسناً
            </button>
          </div>
        </div>
      )}
    </>
  );
};
