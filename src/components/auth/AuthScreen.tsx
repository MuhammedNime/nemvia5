import React, { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { Browser } from '@capacitor/browser';
import { GraduationCap, AlertCircle, CheckCircle2, Loader2, Mail, Lock, User, ExternalLink } from 'lucide-react';
import { auth, googleProvider } from '../../lib/firebase';
import { ensureOwnProfile } from '../../lib/api';
import { ANDROID_AUTH_REDIRECT_URL, getRemoteAppBaseUrl, isNativeApp } from '../../lib/native';
import { LegalContent } from '../views/LegalView';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

function arabicAuthError(err: any): string {
  const code = String(err?.code || '').toLowerCase();
  const m = String(err?.message || '');
  const ml = m.toLowerCase();
  if (code.includes('popup-closed-by-user')) return 'تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية.';
  if (code.includes('cancelled-popup-request')) return 'تم إلغاء الطلب السابق، اضغط مجدداً للمتابعة.';
  if (code.includes('popup-blocked')) {
    return 'المتصفح منع النافذة المنبثقة لتسجيل الدخول. يرجى السماح بالنوافذ المنبثقة لهذا الموقع أو فتح التطبيق في تبويب مستقل والمحاولة مجدداً.';
  }
  if (code.includes('operation-not-allowed')) {
    return 'طريقة تسجيل الدخول هذه غير مفعّلة حالياً في إعدادات المصادقة (Firebase Auth). يمكنك المتابعة بحساب Google أو تفعيل Email/Password من لوحة Firebase.';
  }
  if (code.includes('invalid-email')) return 'صيغة البريد الإلكتروني غير صحيحة.';
  if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) {
    return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
  }
  if (code.includes('email-already-in-use')) return 'هذا البريد الإلكتروني مسجل مسبقاً. اختر «تسجيل الدخول» أو تابع بحساب Google.';
  if (code.includes('weak-password')) return 'كلمة المرور ضعيفة، يجب أن تتكون من 6 أحرف على الأقل.';
  if (code.includes('too-many-requests')) return 'تم حظر المحاولات مؤقتاً لكثرة المحاولات الخاطئة. انتظر قليلاً ثم أعد المحاولة.';
  if (code.includes('user-disabled')) return 'تم تعطيل هذا الحساب في نظام المصادقة.';
  if (code.includes('network-request-failed') || ml.includes('network')) return 'تعذّر الاتصال بالخادم، تحقق من اتصالك بالإنترنت.';
  if (code.includes('unauthorized-domain')) {
    const host = typeof window !== 'undefined' ? window.location.hostname : '';
    return `النطاق الحالي (${host}) غير مضاف ضمن Authorized Domains في Firebase Auth.`;
  }
  if (m.startsWith('{') && ml.includes('"error"')) {
    try {
      const parsed = JSON.parse(m);
      return `تعذّر تهيئة الحساب: ${parsed.error || 'خطأ في الصلاحيات'}`;
    } catch {
      /* ignore */
    }
  }
  return m || 'حدث خطأ أثناء تسجيل الدخول';
}

export const AuthScreen: React.FC = () => {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(true);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | null>(null);

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailMode, setEmailMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileCallbackUrl, setMobileCallbackUrl] = useState<string | null>(null);

  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isMobileAuthHandoff = !isNativeApp() && searchParams?.get('mobile_auth') === '1';
  const handoffRole = (searchParams?.get('role') === 'teacher' ? 'teacher' : 'student') as 'student' | 'teacher';

  useEffect(() => {
    if (isMobileAuthHandoff) {
      setRole(handoffRole);
    }
  }, [isMobileAuthHandoff, handoffRole]);

  useEffect(() => {
    const completeNativeOAuth = async (detail?: { idToken?: string; accessToken?: string; role?: string }) => {
      if (!detail || (!detail.idToken && !detail.accessToken)) return;
      setBusy(true);
      setError(null);
      try {
        const chosenRole = (detail.role === 'teacher' || detail.role === 'student'
          ? detail.role
          : (localStorage.getItem('nemvia-pending-role') as 'student' | 'teacher' | null)) || role;
        const credential = GoogleAuthProvider.credential(detail.idToken || null, detail.accessToken || null);
        const cred = await signInWithCredential(auth, credential);
        if (cred?.user) {
          localStorage.removeItem('nemvia-pending-role');
          await ensureOwnProfile(cred.user, chosenRole);
        }
      } catch (err: any) {
        setError(arabicAuthError(err));
      } finally {
        setBusy(false);
      }
    };

    const win = window as unknown as { __nemviaPendingNativeOAuth?: { idToken?: string; accessToken?: string; role?: string } };
    if (win.__nemviaPendingNativeOAuth) {
      const pending = win.__nemviaPendingNativeOAuth;
      delete win.__nemviaPendingNativeOAuth;
      void completeNativeOAuth(pending);
    }

    const onNativeOAuth = (ev: Event) => {
      const detail = (ev as CustomEvent<{ idToken?: string; accessToken?: string; role?: string }>).detail;
      delete win.__nemviaPendingNativeOAuth;
      void completeNativeOAuth(detail);
    };
    window.addEventListener('nemvia:native-oauth', onNativeOAuth);

    getRedirectResult(auth)
      .then(async res => {
        if (res?.user && res.user.emailVerified) {
          const pending = localStorage.getItem('nemvia-pending-role') as 'student' | 'teacher' | null;
          if (pending) localStorage.removeItem('nemvia-pending-role');
          await ensureOwnProfile(res.user, pending || undefined);
        }
      })
      .catch(err => setError(arabicAuthError(err)));

    return () => {
      window.removeEventListener('nemvia:native-oauth', onNativeOAuth);
    };
  }, [role]);

  const completeHandoffGoogle = async () => {
    setError(null);
    setBusy(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const oauthCred = GoogleAuthProvider.credentialFromResult(cred);
      const idToken = oauthCred?.idToken || '';
      const accessToken = oauthCred?.accessToken || '';
      if (!idToken && !accessToken) {
        setError('تعذّر استلام رمز المصادقة من Google. حاول مجدداً.');
        return;
      }
      const params = new URLSearchParams();
      if (idToken) params.set('id_token', idToken);
      if (accessToken) params.set('access_token', accessToken);
      params.set('role', handoffRole);
      const targetUrl = `${ANDROID_AUTH_REDIRECT_URL}#${params.toString()}`;
      setMobileCallbackUrl(targetUrl);
      window.location.href = targetUrl;
    } catch (err: any) {
      setError(arabicAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const signInGoogle = async () => {
    setError(null);
    setInfoMsg(null);
    if (!agreed) {
      setError('يجب الموافقة على شروط الاستخدام وسياسة الخصوصية للمتابعة.');
      return;
    }
    if (isNativeApp()) {
      setBusy(true);
      try {
        localStorage.setItem('nemvia-pending-role', role);
        const handoffUrl = `${getRemoteAppBaseUrl()}/?mobile_auth=1&role=${encodeURIComponent(role)}`;
        await Browser.open({ url: handoffUrl, toolbarColor: '#0f233a' });
        setInfoMsg('أكمل تسجيل الدخول في المتصفح المفتوح وسيتم إعادتك تلقائياً للتطبيق.');
      } catch (err: any) {
        setError(arabicAuthError(err));
      } finally {
        setBusy(false);
      }
      return;
    }
    setBusy(true);
    try {
      localStorage.setItem('nemvia-pending-role', role);
      const cred = await signInWithPopup(auth, googleProvider);
      if (cred?.user) {
        localStorage.removeItem('nemvia-pending-role');
        await ensureOwnProfile(cred.user, role);
      }
    } catch (err: any) {
      setError(arabicAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMsg(null);

    if (emailMode !== 'reset' && !agreed) {
      setError('يجب الموافقة على شروط الاستخدام وسياسة الخصوصية للمتابعة.');
      return;
    }
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('يرجى إدخال البريد الإلكتروني.');
      return;
    }

    setBusy(true);
    try {
      if (emailMode === 'reset') {
        await sendPasswordResetEmail(auth, cleanEmail);
        setInfoMsg('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
        return;
      }

      if (emailMode === 'signup') {
        localStorage.setItem('nemvia-pending-role', role);
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        if (fullName.trim()) {
          await updateProfile(cred.user, { displayName: fullName.trim().slice(0, 80) });
        }
        await sendEmailVerification(cred.user);
        setInfoMsg('تم إنشاء الحساب وإرسال رابط التفعيل إلى بريدك الإلكتروني.');
        return;
      }

      const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      if (cred.user.emailVerified) {
        localStorage.removeItem('nemvia-pending-role');
        await ensureOwnProfile(cred.user, role);
      }
    } catch (err: any) {
      setError(arabicAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  if (isMobileAuthHandoff) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-br from-[#0f233a] via-[#164673] to-[#1677c7] flex items-center justify-center p-4 font-['Cairo',sans-serif]" dir="rtl">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#0f233a] to-[#1677c7] text-white flex items-center justify-center shadow-md">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-black text-slate-900">تسجيل الدخول لتطبيق NEMVIA</h1>
            <p className="text-xs text-slate-500">
              الدور المختار: <span className="font-bold text-[#1677c7]">{handoffRole === 'teacher' ? 'معلم' : 'طالب'}</span>
            </p>
          </div>
          {error && (
            <div className="p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 flex items-start gap-2 text-xs font-bold text-right">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {!mobileCallbackUrl ? (
            <button
              type="button"
              disabled={busy}
              onClick={completeHandoffGoogle}
              className="w-full min-h-[48px] py-3.5 px-4 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>اضغط هنا لتسجيل الدخول بحساب Google</span>
            </button>
          ) : (
            <a
              href={mobileCallbackUrl}
              className="w-full min-h-[48px] py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-md"
            >
              <ExternalLink className="w-4 h-4" />
              <span>تم التحقق — اضغط للعودة لتطبيق NEMVIA</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#0f233a] via-[#164673] to-[#1677c7] flex items-center justify-center p-4 font-['Cairo',sans-serif]" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#0f233a] to-[#1677c7] text-white flex items-center justify-center shadow-md">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">NEMVIA</h1>
          <p className="text-xs text-slate-500">منصة تعليمية ومجتمع أكاديمي للجميع</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-700 text-center">اختر دورك عند التسجيل لأول مرة:</p>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            {(['student', 'teacher'] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`min-h-[44px] py-2.5 rounded-xl border cursor-pointer transition-colors ${
                  role === r ? 'border-[#1677c7] bg-sky-50 text-[#1677c7]' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {r === 'student' ? '🎓 طالب' : '👨‍🏫 معلم'}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            className="mt-0.5 accent-[#1677c7]"
          />
          <span>
            أوافق على{' '}
            <button type="button" onClick={() => setLegalTab('terms')} className="text-[#1677c7] font-bold underline cursor-pointer">شروط الاستخدام</button>
            {' '}و{' '}
            <button type="button" onClick={() => setLegalTab('privacy')} className="text-[#1677c7] font-bold underline cursor-pointer">سياسة الخصوصية</button>
          </span>
        </label>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 flex items-start gap-2 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {infoMsg && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 flex items-start gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{infoMsg}</span>
          </div>
        )}

        <button
          type="button"
          disabled={busy}
          onClick={signInGoogle}
          className="w-full min-h-[48px] py-3.5 px-4 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2.5 shadow-md cursor-pointer transition-colors"
        >
          {busy ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.1 5.5c4.3-4 6.8-9.8 6.8-16.9z" />
                <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-2.9-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.4-4.7 2.3-8.8 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
              </svg>
            </span>
          )}
          <span>المتابعة بحساب Google</span>
        </button>

        {/* Optional Email / Password Toggle */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => {
              setShowEmailForm(v => !v);
              setError(null);
              setInfoMsg(null);
            }}
            className="w-full py-2 text-xs font-bold text-slate-500 hover:text-[#1677c7] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{showEmailForm ? 'إخفاء الدخول بالبريد الإلكتروني' : 'أو الدخول بالبريد الإلكتروني وكلمة المرور'}</span>
          </button>

          {showEmailForm && (
            <form onSubmit={handleEmailSubmit} className="mt-3 pt-3 border-t border-slate-100 space-y-3 text-xs animate-in fade-in">
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl font-bold">
                <button
                  type="button"
                  onClick={() => { setEmailMode('signin'); setError(null); setInfoMsg(null); }}
                  className={`py-2 rounded-lg cursor-pointer transition-colors ${emailMode === 'signin' ? 'bg-white text-[#1677c7] shadow-2xs' : 'text-slate-600'}`}
                >
                  دخول
                </button>
                <button
                  type="button"
                  onClick={() => { setEmailMode('signup'); setError(null); setInfoMsg(null); }}
                  className={`py-2 rounded-lg cursor-pointer transition-colors ${emailMode === 'signup' ? 'bg-white text-[#1677c7] shadow-2xs' : 'text-slate-600'}`}
                >
                  حساب جديد
                </button>
                <button
                  type="button"
                  onClick={() => { setEmailMode('reset'); setError(null); setInfoMsg(null); }}
                  className={`py-2 rounded-lg cursor-pointer transition-colors ${emailMode === 'reset' ? 'bg-white text-[#1677c7] shadow-2xs' : 'text-slate-600'}`}
                >
                  استعادة
                </button>
              </div>

              {emailMode === 'signup' && (
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="الاسم الكامل"
                    required
                    maxLength={80}
                    className="w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-right"
                />
              </div>

              {emailMode !== 'reset' && (
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    dir="ltr"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="كلمة المرور (6 أحرف على الأقل)"
                    required
                    minLength={6}
                    className="w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-right"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full min-h-[44px] py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold rounded-xl cursor-pointer transition-colors"
              >
                {emailMode === 'signin'
                  ? 'تسجيل الدخول'
                  : emailMode === 'signup'
                    ? 'إنشاء الحساب وإرسال التفعيل'
                    : 'إرسال رابط استعادة كلمة المرور'}
              </button>
            </form>
          )}
        </div>

        {legalTab && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4" onClick={() => setLegalTab(null)}>
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 space-y-4" onClick={e => e.stopPropagation()}>
              <h3 className="font-black text-slate-900">{legalTab === 'terms' ? 'شروط الاستخدام' : 'سياسة الخصوصية'}</h3>
              <LegalContent tab={legalTab} />
              <button type="button" onClick={() => setLegalTab(null)} className="w-full py-2.5 bg-[#1677c7] text-white font-bold rounded-xl text-sm cursor-pointer">إغلاق</button>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex justify-center">
          <PWAInstallButton />
        </div>
      </div>
    </div>
  );
};
