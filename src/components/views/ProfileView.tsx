import React, { useState } from 'react';
import { Camera, Loader2, Lock, Globe, Flame, Star, LogOut, Trash2, AlertTriangle } from 'lucide-react';
import { Profile } from '../../types';
import { UploadedFile } from '../../lib/api';
import { updatePassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface ProfileViewProps {
  profile: Profile;
  email: string;
  classesCount: number;
  onSave: (patch: { display_name: string; bio: string; visibility: 'public' | 'private'; avatar_url?: string }) => Promise<boolean>;
  onUpload: (f: File, folder: string) => Promise<UploadedFile>;
  onSignOut: () => void;
  onDeleteAccount: () => Promise<void>;
}

const roleName = { student: 'طالب', teacher: 'معلم', admin: 'مؤسس / أدمن' } as const;
const input = 'w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#1677c7] focus:bg-white';

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, email, classesCount, onSave, onUpload, onSignOut, onDeleteAccount }) => {
  const [name, setName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio);
  const [visibility, setVisibility] = useState<'public' | 'private'>(profile.visibility as 'public' | 'private');
  const [avatar, setAvatar] = useState(profile.avatar_url || '');
  const [busy, setBusy] = useState(false);
  const [pw, setPw] = useState('');
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const hasPasswordProvider = Boolean(auth.currentUser?.providerData?.some(p => p.providerId === 'password'));

  const pickAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f || !f.type.startsWith('image/')) return;
    setBusy(true);
    try { setAvatar((await onUpload(f, 'avatars')).url); } catch { /* toast */ }
    setBusy(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    await onSave({ display_name: name.trim(), bio: bio.trim(), visibility, avatar_url: avatar || undefined });
    setBusy(false);
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    try {
      await updatePassword(auth.currentUser, pw);
      setPwMsg({ ok: true, text: 'تم تغيير كلمة المرور' });
      setPw('');
    } catch (err: any) {
      setPwMsg({ ok: false, text: err?.message || 'تعذّر تغيير كلمة المرور' });
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in max-w-2xl">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-4">
        <div className="relative shrink-0">
          {avatar ? (
            <img src={avatar} alt="" className="w-20 h-20 rounded-2xl object-cover border border-slate-200" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-3xl font-black">{name.slice(0, 1) || '؟'}</div>
          )}
          <label className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-white border border-slate-200 text-[#1677c7] flex items-center justify-center cursor-pointer shadow">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            <input type="file" accept="image/*" className="hidden" onChange={pickAvatar} />
          </label>
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-black text-slate-900 truncate">{profile.display_name}</h2>
          <p className="text-xs text-slate-500">{roleName[profile.role]} · منضم {profile.joinedDate}</p>
          <div className="flex gap-3 mt-2 text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500" />{profile.points} نقطة</span>
            <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" />{profile.streakDays} يوم</span>
            <span>{classesCount} صف</span>
          </div>
        </div>
      </div>

      <form onSubmit={save} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
        <h3 className="font-black text-slate-900 text-sm">معلومات الحساب</h3>
        <div className="space-y-1"><label className="text-xs font-bold text-slate-600">الاسم الظاهر</label>
          <input value={name} onChange={e => setName(e.target.value)} maxLength={80} required className={input} /></div>
        <div className="space-y-1"><label className="text-xs font-bold text-slate-600">نبذة عنك</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={300} rows={3} className={input} /></div>
        <div className="space-y-1"><label className="text-xs font-bold text-slate-600">البريد الإلكتروني</label>
          <input value={email} readOnly dir="ltr" className={`${input} text-slate-400`} /></div>

        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          {([['public', 'عام', Globe, 'منشوراتك وقصصك يراها كل المسجّلين'], ['private', 'خاص', Lock, 'منشوراتك لا تظهر إلا لك ولأعضاء صفوفك']] as const).map(([v, label, Icon, hint]) => (
            <button type="button" key={v} onClick={() => setVisibility(v)}
              className={`p-3 rounded-xl border text-right cursor-pointer ${visibility === v ? 'border-[#1677c7] bg-sky-50 text-[#1677c7]' : 'border-slate-200 text-slate-500'}`}>
              <span className="flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" />{label}</span>
              <span className="block text-[10px] font-normal mt-1 leading-relaxed">{hint}</span>
            </button>
          ))}
        </div>
        <button type="submit" disabled={busy} className="w-full py-3 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white font-black rounded-xl text-sm cursor-pointer">حفظ التغييرات</button>
      </form>

      {hasPasswordProvider && (
        <form onSubmit={changePassword} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
          <h3 className="font-black text-slate-900 text-sm">تغيير كلمة المرور</h3>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} minLength={6} required dir="ltr" placeholder="كلمة مرور جديدة (6 أحرف فأكثر)" className={input} />
          {pwMsg && <p className={`text-xs font-bold ${pwMsg.ok ? 'text-emerald-600' : 'text-rose-600'}`}>{pwMsg.text}</p>}
          <button type="submit" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer">تغيير</button>
        </form>
      )}

      <button onClick={onSignOut} className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-black rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer">
        <LogOut className="w-4 h-4" /> تسجيل الخروج
      </button>

      <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="space-y-0.5">
            <h3 className="font-black text-rose-900 text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              منطقة الخطر — حذف الحساب نهائياً
            </h3>
            <p className="text-[11px] text-rose-700 leading-relaxed">
              يحذف حسابك وجميع منشوراتك ورسائلك وبياناتك نهائياً من المنصة ولا يمكن التراجع عن ذلك.
            </p>
          </div>
          <button
            type="button"
            onClick={() => { setDeleteOpen(true); setDeleteConfirmText(''); setDeleteError(null); }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" /> حذف حسابي
          </button>
        </div>
      </div>

      {deleteOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => !deleting && setDeleteOpen(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-rose-100" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2.5 text-rose-700">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-black text-base">تأكيد حذف الحساب نهائياً</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              سيتم حذف ملفك الشخصي وجميع صفوفك ومنشوراتك ورسائلك وتسليماتك نهائياً دون إمكانية الاسترجاع. اكتب كلمة <strong className="text-rose-700">حذف</strong> للمتابعة.
            </p>
            <input
              value={deleteConfirmText}
              onChange={e => setDeleteConfirmText(e.target.value)}
              placeholder="اكتب: حذف"
              className={input}
              disabled={deleting}
            />
            {deleteError && <p className="text-xs font-bold text-rose-600">{deleteError}</p>}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={deleting || deleteConfirmText.trim() !== 'حذف'}
                onClick={async () => {
                  setDeleting(true);
                  setDeleteError(null);
                  try {
                    await onDeleteAccount();
                    setDeleteOpen(false);
                  } catch (err: any) {
                    setDeleteError(err?.message || 'تعذّر حذف الحساب');
                  } finally {
                    setDeleting(false);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                تأكيد الحذف النهائي
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
