import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  PhoneCall,
  Award,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
} from 'lucide-react';

interface OnboardingModalProps {
  open: boolean;
  userName: string;
  onClose: () => void;
  onNavigate?: (section: string) => void;
}

const SLIDES = [
  {
    icon: Sparkles,
    badge: 'خطوة ١ من ٣',
    title: 'تعلّم أذكى مع المعلّم الذكي والماسح الضوئي',
    desc: 'اسأل بالصوت أو النص، وصوّر أي مسألة أو ورقة واجب بالكاميرا ليحلّلها الذكاء الاصطناعي ويشرحها خطوة بخطوة.',
    accent: 'bg-sky-50 text-[#1677c7] border-sky-200',
    ctaSection: 'ai',
    ctaLabel: 'جرّب المعلّم الذكي',
  },
  {
    icon: PhoneCall,
    badge: 'خطوة ٢ من ٣',
    title: 'تواصل وتعاون مباشر مع صفّك',
    desc: 'مكالمات صوت وفيديو مباشرة، رسائل صوتية، سبورة رسم تفاعلية، وغرف مذاكرة صوتية وتصويتات سريعة داخل الصفوف.',
    accent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ctaSection: 'messages',
    ctaLabel: 'استكشف الرسائل والغرف',
  },
  {
    icon: Award,
    badge: 'خطوة ٣ من ٣',
    title: 'ذاكر بدون إنترنت ووثّق تفوقك',
    desc: 'احفظ الدروس للمذاكرة دون اتصال، راقب ساعات تركيزك الأسبوعية بمؤقت بومودورو، وأصدر شهادة تفوق موثّقة برمز QR.',
    accent: 'bg-amber-50 text-amber-700 border-amber-200',
    ctaSection: 'tools',
    ctaLabel: 'افتح أدوات التفوق',
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  open,
  userName,
  onClose,
  onNavigate,
}) => {
  const [step, setStep] = useState(0);
  if (!open) return null;

  const current = SLIDES[step] || SLIDES[0];
  const Icon = current.icon;

  return (
    <div
      className="fixed inset-0 z-[80] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 font-['Cairo',sans-serif]"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden border border-slate-200 shadow-2xl animate-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 bg-[#0f233a] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-sky-400" />
            <span className="font-black text-sm">أهلاً بك في NEMVIA، {userName}!</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white cursor-pointer"
            aria-label="تخطي الجولة"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-center">
          <div className="flex justify-center">
            <span className={`px-3 py-1 rounded-full border text-[11px] font-black ${current.accent}`}>
              {current.badge}
            </span>
          </div>

          <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border ${current.accent}`}>
            <Icon className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-black text-slate-900">{current.title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{current.desc}</p>
          </div>

          {/* Step Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === step ? 'w-7 bg-[#1677c7]' : 'w-2 bg-slate-200'
                }`}
                aria-label={`الخطوة ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <button
              type="button"
              onClick={() => {
                if (step === 0) onClose();
                else setStep(s => s - 1);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer inline-flex items-center gap-1"
            >
              {step === 0 ? (
                <span>تخطي</span>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span>السابق</span>
                </>
              )}
            </button>

            {onNavigate && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate(current.ctaSection);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#1677c7] font-bold cursor-pointer"
              >
                {current.ctaLabel}
              </button>
            )}

            {step < SLIDES.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="px-4 py-2.5 rounded-xl bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold cursor-pointer inline-flex items-center gap-1"
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer inline-flex items-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ابدأ الآن</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
