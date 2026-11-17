import React, { useState } from 'react';
import { Smartphone, Download, X } from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';
import { isNativeApp, resolveApiUrl } from '../../lib/native';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (isInstalled || isNativeApp()) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <div className="inline-flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={handleInstallClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-sm transition-all hover:scale-105 cursor-pointer"
          title="تثبيت تطبيق NEMVIA على الهاتف أو سطح المكتب"
        >
          {isInstallable ? <Download className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          <span>تثبيت تطبيق الهاتف</span>
        </button>
        {!isIOS && (
          <a
            href={resolveApiUrl('/download/nemvia.apk')}
            download="NEMVIA.apk"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
            title="تنزيل ملف تثبيت أندرويد APK مباشرة"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>تنزيل Android APK</span>
          </a>
        )}
      </div>

      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            dir="rtl"
            className="bg-white rounded-3xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs animate-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">تثبيت NEMVIA على جهازك</h3>
                  <span className="text-[10px] text-slate-400">تطبيق ويب تقدمي (PWA)</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-900">
                لتثبيت المنصة كأيقونة تطبيق على الشاشة الرئيسية:
              </p>

              {isIOS ? (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#0f233a] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                    <span>اضغط على زر <strong>مشاركة (Share)</strong> في شريط Safari.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1677c7] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                    <span>اختر <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home Screen)</strong>.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                    <span>سيفتح التطبيق بكامل الشاشة كأنه تطبيق أصلي!</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#0f233a] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                    <span>افتح قائمة المتصفح (⋮) أو اضغط على أيقونة التثبيت في شريط العنوان.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1677c7] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                    <span>اختر <strong>«تثبيت التطبيق» (Install App)</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                    <span>سيعمل NEMVIA في نافذة مستقلة تماماً مثل تطبيقات الجوال.</span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 bg-[#0f233a] text-white font-bold rounded-xl cursor-pointer"
            >
              فهمت ذلك، حسناً
            </button>
          </div>
        </div>
      )}
    </>
  );
};
