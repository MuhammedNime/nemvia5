import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, Flame, Loader2, RefreshCw, ShieldCheck, X } from 'lucide-react';
import { VerifiedCertificate } from '../../types';
import { fetchVerifiedCertificate } from '../../lib/api';

interface CertificateVerifyModalProps {
  initialCode?: string;
  onClose: () => void;
}

export const CertificateVerifyModal: React.FC<CertificateVerifyModalProps> = ({
  initialCode = '',
  onClose,
}) => {
  const [code, setCode] = useState(initialCode.toUpperCase());
  const [loading, setLoading] = useState(Boolean(initialCode));
  const [error, setError] = useState<string | null>(null);
  const [cert, setCert] = useState<VerifiedCertificate | null>(null);

  const lookup = async (targetCode: string) => {
    const clean = targetCode.trim().toUpperCase();
    if (clean.length < 8) {
      setError('أدخل رمز تحقق صحيحاً (8 أحرف على الأقل، مثال: CERT7K9X2M4P).');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchVerifiedCertificate(clean);
      if (!res) {
        setCert(null);
        setError('لم يتم العثور على شهادة موثّقة مطابقة لهذا الرمز.');
      } else {
        setCert(res);
      }
    } catch {
      setError('تعذّر التحقق من الشهادة الآن، حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode.trim().length >= 8) {
      void lookup(initialCode);
    }
  }, [initialCode]);

  return (
    <div
      className="fixed inset-0 z-[75] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 font-['Cairo',sans-serif]"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 bg-[#0f233a] text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base">بوابة التحقق من الشهادات الرقمية</h3>
              <p className="text-[11px] text-slate-300">تحقق فوري من صحة الشهادات الصادرة عن منصة NEMVIA</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-white/70 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          <form
            onSubmit={e => {
              e.preventDefault();
              void lookup(code);
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="text"
              dir="ltr"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="CERT8X9K2M4P"
              maxLength={16}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-black text-sm tracking-widest text-center uppercase outline-none focus:border-[#1677c7]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span>تحقق الآن</span>
            </button>
          </form>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-bold">
              {error}
            </div>
          )}

          {cert && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/70 border-2 border-emerald-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>شهادة موثّقة وصالحة</span>
                </span>
                <span className="font-mono font-black text-slate-600 text-[11px]">{cert.cert_code}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 block">اسم الطالب(ـة):</span>
                <h4 className="text-xl font-black text-slate-900">{cert.student_name}</h4>
                <p className="text-xs font-bold text-[#1677c7]">{cert.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 tabular-nums">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block">رصيد الإنجاز الموثّق</span>
                  <strong className="text-base font-black text-slate-900">{cert.points} XP</strong>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block">سلسلة المواظبة</span>
                  <strong className="text-base font-black text-orange-600 inline-flex items-center gap-1">
                    <Flame className="w-4 h-4" />
                    <span>{cert.streak_days} يوم</span>
                  </strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600">
                <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{cert.issuer_name}</span>
                </span>
                <span>تاريخ الإصدار: {new Date(cert.issued_at).toLocaleDateString('ar')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
