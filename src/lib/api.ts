import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  ADMIN_EMAIL,
  auth,
  db,
  handleFirestoreError,
  OperationType,
  storage,
} from './firebase';
import {
  AppRole, Profile, ClassItem, SchoolItem, MinistryItem, Lesson, Assignment, Submission, Quiz, QuizQuestion,
  QuizQuestionType, QuizAnswerValue, QuizAttempt, QuestionFeedbackItem,
  Post, PostComment, Story, LiveSession, DirectMessage, Course, NotificationItem,
  ContentReport, ContactInfo, FollowRequestItem, ClassMemberInfo,
  GuardianGradeEntry, GuardianReport, CallSession, CallStatus, CallType, LiveAttendanceRecord, LiveAttendanceStatus,
  VerifiedCertificate, ChatPresence, PollScopeType, PollItem, PollVoteItem,
  ClassResource, ClassResourceKind,
} from '../types';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type Row = Record<string, any>;

function toIso(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val === 'string') return val;
  if (val instanceof Timestamp) return val.toDate().toISOString();
  if (typeof val?.toDate === 'function') return val.toDate().toISOString();
  if (typeof val?.seconds === 'number') return new Date(val.seconds * 1000).toISOString();
  return new Date().toISOString();
}

function makeJoinCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function mapDoc(d: { id: string; data: () => Row }): Row {
  return { id: d.id, ...d.data() };
}

export function mapProfile(r: Row): Profile {
  return {
    id: r.id,
    username: r.username || '',
    display_name: r.display_name || 'مستخدم NEMVIA',
    bio: r.bio || '',
    avatar_url: r.avatar_url || undefined,
    role: (r.role as AppRole) || 'student',
    visibility: r.visibility || 'public',
    points: Number(r.points ?? 0),
    streakDays: Number(r.streak_days ?? 0),
    is_suspended: !!r.is_suspended,
    joinedDate: r.created_at
      ? new Date(toIso(r.created_at)).toLocaleDateString('ar', { month: 'long', year: 'numeric' })
      : '',
  };
}

const TW_HEX: Record<string, string> = {
  blue: '#2563eb', indigo: '#4f46e5', emerald: '#059669', rose: '#e11d48', amber: '#d97706', sky: '#0284c7',
  violet: '#7c3aed', teal: '#0d9488', purple: '#9333ea', slate: '#334155', orange: '#ea580c', cyan: '#0891b2',
  pink: '#db2777', green: '#16a34a', red: '#dc2626', fuchsia: '#c026d3',
};
export const DEFAULT_THEME = 'from-blue-600 to-indigo-700';
const MINISTRY_PREFIX = '__ORG__:ministry|';
const SCHOOL_PREFIX = '__ORG__:school|';

function cleanTheme(raw?: string): string {
  const base = (raw || '').split('|')[0];
  return base && base.includes('from-') ? base : DEFAULT_THEME;
}

function coverFor(theme: string, title: string) {
  const from = TW_HEX[(theme.match(/from-([a-z]+)/) || [])[1]] || '#2563eb';
  const to = TW_HEX[(theme.match(/to-([a-z]+)/) || [])[1]] || '#4338ca';
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/></linearGradient></defs><rect width='600' height='300' fill='url(#g)'/><text x='300' y='165' font-size='120' text-anchor='middle' fill='white' fill-opacity='.25' font-family='sans-serif'>${(title || 'N').trim().slice(0, 1).replace(/[<&>]/g, '')}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/* ------------------------------------------------------------------ */
/* Profile / Auth helpers                                              */
/* ------------------------------------------------------------------ */

const ensureProfileInFlight = new Map<string, Promise<Profile>>();

export async function ensureOwnProfile(
  user: User,
  preferredRole?: 'student' | 'teacher',
): Promise<Profile> {
  const inflight = ensureProfileInFlight.get(user.uid);
  if (inflight) return inflight;

  const task = ensureOwnProfileImpl(user, preferredRole).finally(() => {
    ensureProfileInFlight.delete(user.uid);
  });
  ensureProfileInFlight.set(user.uid, task);
  return task;
}

async function ensureOwnProfileImpl(
  user: User,
  preferredRole?: 'student' | 'teacher',
): Promise<Profile> {
  const email = (user.email || '').trim().toLowerCase();
  const isBootAdmin = email === ADMIN_EMAIL && Boolean(user.emailVerified);
  const profileRef = doc(db, 'profiles', user.uid);
  const privateRef = doc(db, 'users_private', user.uid);

  let snap;
  try {
    snap = await getDoc(profileRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `profiles/${user.uid}`);
  }

  if (!snap.exists()) {
    const safeName =
      (user.displayName || '').trim().slice(0, 80) ||
      (user.email ? user.email.split('@')[0].slice(0, 80) : '') ||
      'مستخدم NEMVIA';
    const initialRole: AppRole = isBootAdmin ? 'admin' : (preferredRole === 'teacher' ? 'teacher' : 'student');
    const avatar = user.photoURL && user.photoURL.length <= 2000 ? user.photoURL : undefined;

    const profilePayload: Record<string, any> = {
      id: user.uid,
      display_name: safeName,
      bio: '',
      role: initialRole,
      visibility: 'public',
      points: 0,
      streak_days: 1,
      last_active_date: new Date().toISOString().slice(0, 10),
      is_suspended: false,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
    if (avatar) profilePayload.avatar_url = avatar;

    try {
      await setDoc(profileRef, profilePayload);
      await setDoc(privateRef, {
        uid: user.uid,
        email: (user.email || '').slice(0, 254),
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      if (isBootAdmin) {
        await setDoc(doc(db, 'admins', user.uid), {
          uid: user.uid,
          email: (user.email || '').slice(0, 254),
          created_at: serverTimestamp(),
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `profiles/${user.uid}`);
    }

    const created = await getDoc(profileRef);
    return mapProfile({ id: user.uid, ...(created.data() || profilePayload) });
  }

  const existing = snap.data() as Row;

  // ضمان ترقية البريد الإداري المعتمد تلقائياً
  if (isBootAdmin && existing.role !== 'admin') {
    try {
      await updateDoc(profileRef, { role: 'admin', updated_at: serverTimestamp() });
      await setDoc(
        doc(db, 'admins', user.uid),
        { uid: user.uid, email: (user.email || '').slice(0, 254), created_at: serverTimestamp() },
        { merge: true },
      );
      existing.role = 'admin';
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `profiles/${user.uid}`);
    }
  }

  // تأكد من مزامنة users_private
  try {
    const privSnap = await getDoc(privateRef);
    if (!privSnap.exists()) {
      await setDoc(privateRef, {
        uid: user.uid,
        email: (user.email || '').slice(0, 254),
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    }
  } catch {
    /* ignore non-fatal private sync */
  }

  return mapProfile({ id: snap.id, ...existing });
}

export async function fetchOwnProfile(userId: string): Promise<Profile | null> {
  const profileRef = doc(db, 'profiles', userId);
  try {
    const snap = await getDoc(profileRef);
    if (snap.exists()) {
      const data = snap.data() as Row;
      const cu = auth.currentUser;
      if (
        cu &&
        cu.uid === userId &&
        (cu.email || '').toLowerCase() === ADMIN_EMAIL &&
        cu.emailVerified &&
        data.role !== 'admin'
      ) {
        return await ensureOwnProfile(cu);
      }
      return mapProfile({ id: snap.id, ...data });
    }
    if (auth.currentUser?.uid === userId) {
      const preferred = localStorage.getItem('nemvia-pending-role') as 'student' | 'teacher' | null;
      if (preferred) localStorage.removeItem('nemvia-pending-role');
      return await ensureOwnProfile(auth.currentUser, preferred || undefined);
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `profiles/${userId}`);
  }
}

export async function updateProfile(
  userId: string,
  patch: Partial<{ display_name: string; bio: string; avatar_url: string; visibility: 'public' | 'private' }>,
) {
  const clean: Record<string, any> = { updated_at: serverTimestamp() };
  if (patch.display_name !== undefined) clean.display_name = patch.display_name.slice(0, 80);
  if (patch.bio !== undefined) clean.bio = patch.bio.slice(0, 500);
  if (patch.visibility !== undefined) clean.visibility = patch.visibility;
  if (patch.avatar_url !== undefined && patch.avatar_url) {
    clean.avatar_url = patch.avatar_url.slice(0, 2000);
  }
  try {
    await updateDoc(doc(db, 'profiles', userId), clean);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `profiles/${userId}`);
  }
}

export async function touchStreak() {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  try {
    const refDoc = doc(db, 'profiles', uid);
    const snap = await getDoc(refDoc);
    if (!snap.exists()) return;
    const data = snap.data() as Row;
    const today = new Date().toISOString().slice(0, 10);
    if (data.last_active_date === today) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const nextStreak = data.last_active_date === yesterday ? Number(data.streak_days || 0) + 1 : 1;
    await updateDoc(refDoc, {
      streak_days: nextStreak,
      last_active_date: today,
      updated_at: serverTimestamp(),
    });
  } catch {
    /* ignore non-critical streak update */
  }
}

export async function awardPoints(xp: number): Promise<number | null> {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  const delta = Math.round(xp);
  if (!Number.isFinite(delta) || delta === 0) return null;
  try {
    const refDoc = doc(db, 'profiles', uid);
    await updateDoc(refDoc, {
      points: increment(delta),
      updated_at: serverTimestamp(),
    });
    const snap = await getDoc(refDoc);
    return Number((snap.data() as Row)?.points ?? 0);
  } catch (err) {
    console.warn('[NEMVIA] awardPoints:', err);
    return null;
  }
}

export async function searchContacts(meId: string, q = ''): Promise<ContactInfo[]> {
  try {
    const snap = await getDocs(
      query(
        collection(db, 'profiles'),
        where('visibility', 'in', ['public', 'private']),
        limit(100),
      ),
    );
    const needle = q.trim().toLowerCase();
    return snap.docs
      .map(d => mapDoc(d))
      .filter(r => r.id !== meId)
      .filter(r => !needle || String(r.display_name || '').toLowerCase().includes(needle))
      .sort((a, b) => toIso(b.created_at).localeCompare(toIso(a.created_at)))
      .map(r => ({
        id: r.id,
        name: r.display_name || 'مستخدم',
        role: (r.role as AppRole) || 'student',
        avatar_url: r.avatar_url || undefined,
        bio: r.bio || '',
        visibility: (r.visibility as 'public' | 'private') || 'public',
        points: Number(r.points ?? 0),
        streakDays: Number(r.streak_days ?? 0),
      }));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'profiles');
  }
}

/* ------------------------------------------------------------------ */
/* Files                                                               */
/* ------------------------------------------------------------------ */

export interface UploadedFile { url: string; name: string; size: string; type: 'pdf' | 'image' | 'doc' | 'code' | 'audio'; }

async function compressImageFile(file: File): Promise<File> {
  if (
    typeof document === 'undefined' ||
    !file.type.startsWith('image/') ||
    file.type === 'image/gif' ||
    file.type === 'image/svg+xml' ||
    file.size <= 300 * 1024
  ) {
    return file;
  }
  try {
    const objectUrl = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error('image_load_failed'));
        el.src = objectUrl;
      });
      const maxDim = 1600;
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      if (!w || !h) return file;
      const scale = Math.min(1, maxDim / Math.max(w, h));
      const targetW = Math.max(1, Math.round(w * scale));
      const targetH = Math.max(1, Math.round(h * scale));
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return file;
      ctx.drawImage(img, 0, 0, targetW, targetH);
      const blob = await new Promise<Blob | null>(resolve =>
        canvas.toBlob(b => resolve(b), 'image/jpeg', 0.82),
      );
      if (!blob || blob.size >= file.size) return file;
      const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
      return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch {
    return file;
  }
}

export async function uploadFile(userId: string, rawFile: File, folder: string): Promise<UploadedFile> {
  const file = await compressImageFile(rawFile);
  if (file.size > 10 * 1024 * 1024) throw new Error('حجم الملف أكبر من 10 ميجابايت');
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
  const storagePath = `nemvia/${userId}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  try {
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file, { contentType: file.type || undefined });
    const publicUrl = await getDownloadURL(storageRef);
    const kb = file.size / 1024;
    const isAudio = file.type.startsWith('audio/') || ['webm', 'ogg', 'mp3', 'wav', 'm4a', 'aac', 'opus'].includes(ext);
    const type: UploadedFile['type'] = isAudio ? 'audio'
      : ext === 'pdf' ? 'pdf'
      : ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext) ? 'image'
      : ['ts', 'js', 'py', 'java', 'html', 'css', 'sql', 'txt'].includes(ext) ? 'code' : 'doc';
    return {
      url: publicUrl,
      name: file.name,
      size: kb > 1024 ? `${(kb / 1024).toFixed(1)} ميجابايت` : `${Math.round(kb)} كيلوبايت`,
      type,
    };
  } catch (err: any) {
    const msg = String(err?.message || '').toLowerCase();
    if (msg.includes('unauthorized') || msg.includes('storage/')) {
      throw new Error('يرجى تفعيل Firebase Storage في وحدة تحكم Firebase لرفع الملفات والصور.');
    }
    throw new Error(err?.message || 'تعذّر رفع الملف');
  }
}

/* ------------------------------------------------------------------ */
/* Load everything                                                     */
/* ------------------------------------------------------------------ */

export interface AppData {
  classes: ClassItem[];
  schools: SchoolItem[];
  ministries: MinistryItem[];
  myOrgIds: string[];
  orgMembers: ClassMemberInfo[];
  courses: Course[];
  lessons: Lesson[];
  quizzes: Quiz[];
  assignments: Assignment[];
  submissions: Submission[];
  posts: Post[];
  stories: Story[];
  liveSessions: LiveSession[];
  messages: DirectMessage[];
  notifications: NotificationItem[];
  reports: ContentReport[];
  contacts: ContactInfo[];
  classMembers: ClassMemberInfo[];
  myClassIds: string[];
  followingIds: string[];
  followerIds: string[];
  followRequests: FollowRequestItem[];
}

async function safeList(path: string, q: any): Promise<Row[]> {
  try {
    const snap = await getDocs(q);
    return snap.docs.map((d: any) => mapDoc(d));
  } catch (err: any) {
    const msg = String(err?.message || '').toLowerCase();
    if (msg.includes('permission') || msg.includes('insufficient')) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
    console.warn(`[NEMVIA] ${path}:`, err?.message || err);
    return [];
  }
}

function dedupeById(list: Row[]): Row[] {
  const m = new Map<string, Row>();
  list.forEach(r => m.set(r.id, r));
  return [...m.values()];
}

export async function loadAll(me: Profile): Promise<AppData> {
  const isAdm = me.role === 'admin';
  const nowIso = new Date().toISOString();

  const [
    classRowsRaw,
    lessonRows,
    assignRowsRaw,
    subRows,
    quizRowsRaw,
    attemptRows,
    keyRowsTeacher,
    postRows,
    commentRowsRaw,
    likeRows,
    storyRowsAll,
    liveRowsAll,
    dmRows,
    cmRows,
    notifRows,
    reportRows,
    contacts,
    memberRows,
    followRows,
    followReqRows,
  ] = await Promise.all([
    safeList('classes', query(collection(db, 'classes'), where('class_type', 'in', ['class', 'study']))),
    safeList('lessons', query(collection(db, 'lessons'), where('position', '>=', 0), orderBy('position', 'asc'))),
    safeList('assignments', query(collection(db, 'assignments'), where('total_points', '>=', 1))),
    isAdm
      ? safeList('submissions', collection(db, 'submissions'))
      : Promise.all([
          safeList('submissions', query(collection(db, 'submissions'), where('student_id', '==', me.id))),
          safeList('submissions', query(collection(db, 'submissions'), where('teacher_id', '==', me.id))),
        ]).then(([a, b]) => dedupeById([...a, ...b])),
    safeList('quizzes', query(collection(db, 'quizzes'), where('is_published', 'in', [true, false]))),
    isAdm
      ? safeList('quiz_attempts', collection(db, 'quiz_attempts'))
      : Promise.all([
          safeList('quiz_attempts', query(collection(db, 'quiz_attempts'), where('student_id', '==', me.id))),
          safeList('quiz_attempts', query(collection(db, 'quiz_attempts'), where('teacher_id', '==', me.id))),
        ]).then(([a, b]) => dedupeById([...a, ...b])),
    isAdm
      ? safeList('quiz_answer_keys', collection(db, 'quiz_answer_keys'))
      : safeList('quiz_answer_keys', query(collection(db, 'quiz_answer_keys'), where('teacher_id', '==', me.id))),
    Promise.all([
      safeList('posts', query(collection(db, 'posts'), where('visibility', 'in', ['public', 'followers']), limit(100))),
      safeList('posts', query(collection(db, 'posts'), where('author_id', '==', me.id), limit(50))),
    ]).then(([a, b]) =>
      dedupeById([...a, ...b]).sort((x, y) => toIso(y.created_at).localeCompare(toIso(x.created_at))).slice(0, 100),
    ),
    safeList('comments', query(collection(db, 'comments'), where('post_id', '!=', ''))),
    safeList('post_likes', query(collection(db, 'post_likes'), where('post_id', '!=', ''))),
    safeList('stories', query(collection(db, 'stories'), where('expires_at', '>', ''))),
    safeList('live_sessions', query(collection(db, 'live_sessions'), where('status', 'in', ['scheduled', 'live', 'ended']))),
    safeList('direct_messages', query(collection(db, 'direct_messages'), where('participants', 'array-contains', me.id), limit(500))),
    safeList('class_messages', query(collection(db, 'class_messages'), where('class_id', '!=', ''), limit(500))),
    safeList('notifications', query(collection(db, 'notifications'), where('user_id', '==', me.id), limit(50))),
    isAdm
      ? safeList('content_reports', query(collection(db, 'content_reports'), where('status', 'in', ['open', 'reviewing'])))
      : Promise.resolve([] as Row[]),
    searchContacts(me.id),
    safeList('class_members', query(collection(db, 'class_members'), where('member_role', 'in', ['student', 'assistant']))),
    Promise.all([
      safeList('follows', query(collection(db, 'follows'), where('follower_id', '==', me.id))),
      safeList('follows', query(collection(db, 'follows'), where('followed_id', '==', me.id))),
    ]).then(([a, b]) => dedupeById([...a, ...b])),
    Promise.all([
      safeList('follow_requests', query(collection(db, 'follow_requests'), where('target_id', '==', me.id))),
      safeList('follow_requests', query(collection(db, 'follow_requests'), where('requester_id', '==', me.id))),
    ]).then(([a, b]) => dedupeById([...a, ...b]).filter(r => r.status === 'pending')),
  ]);

  const classRows = [...classRowsRaw].sort((a, b) => toIso(b.created_at).localeCompare(toIso(a.created_at)));
  const assignRows = [...assignRowsRaw].sort((a, b) => toIso(b.created_at).localeCompare(toIso(a.created_at)));
  const quizRows = [...quizRowsRaw].sort((a, b) => toIso(b.created_at).localeCompare(toIso(a.created_at)));
  const commentRows = [...commentRowsRaw].sort((a, b) => toIso(a.created_at).localeCompare(toIso(b.created_at)));
  const storyRows = storyRowsAll
    .filter(s => String(s.expires_at || '') > nowIso)
    .sort((a, b) => toIso(b.created_at).localeCompare(toIso(a.created_at)))
    .slice(0, 60);
  const liveRows = liveRowsAll
    .filter(l => l.status !== 'cancelled')
    .sort((a, b) => String(a.starts_at || '').localeCompare(String(b.starts_at || '')));

  // جلب مفاتيح الاختبارات التي أتمها الطالب لكي يرى شرح الإجابات
  const keyMap = new Map<string, Row>();
  keyRowsTeacher.forEach(k => keyMap.set(k.quiz_id || k.id, k));
  const myAttemptedQuizIds = [...new Set(attemptRows.filter(a => a.student_id === me.id).map(a => String(a.quiz_id)))];
  const missingKeyIds = myAttemptedQuizIds.filter(qid => !keyMap.has(qid));
  if (missingKeyIds.length > 0) {
    const extraKeys = await Promise.all(
      missingKeyIds.map(async qid => {
        try {
          const s = await getDoc(doc(db, 'quiz_answer_keys', qid));
          return s.exists() ? mapDoc(s) : null;
        } catch {
          return null;
        }
      }),
    );
    extraKeys.forEach(k => { if (k) keyMap.set(k.quiz_id || k.id, k); });
  }

  // خريطة الأسماء والأدوار لكل من ظهر في البيانات
  const known = new Map<string, Row>();
  contacts.forEach(c => known.set(c.id, { id: c.id, display_name: c.name, role: c.role, avatar_url: c.avatar_url }));
  known.set(me.id, { id: me.id, display_name: me.display_name, role: me.role, avatar_url: me.avatar_url });

  const nm = (id: string) => known.get(id)?.display_name || 'مستخدم';
  const rl = (id: string): AppRole => (known.get(id)?.role as AppRole) || 'student';
  const av = (id: string) => known.get(id)?.avatar_url || undefined;

  // عدد الأعضاء لكل صف
  const counts: Record<string, number> = {};
  memberRows.forEach(m => {
    counts[m.class_id] = (counts[m.class_id] || 0) + 1;
  });

  // الوزارات والمجمعات والمدارس والصفوف
  const ministries: MinistryItem[] = [];
  const schools: SchoolItem[] = [];
  const classes: ClassItem[] = [];

  classRows.forEach(r => {
    const rawTheme = String(r.color_theme || '');
    const createdAt = toIso(r.created_at);
    if (rawTheme.startsWith(MINISTRY_PREFIX)) {
      const parts = rawTheme.slice(MINISTRY_PREFIX.length).split('|');
      const theme = parts[0] && parts[0].includes('from-') ? parts[0] : 'from-slate-800 to-slate-900';
      const region = parts.slice(1).join('|') || r.grade_level || 'عام';
      ministries.push({
        id: r.id,
        owner_id: r.teacher_id,
        owner_name: nm(r.teacher_id),
        name: r.title,
        region,
        description: r.description || '',
        join_code: r.join_code,
        colorTheme: theme,
        members_count: counts[r.id] ?? r.members_count ?? 1,
        created_at: createdAt,
      });
    } else if (rawTheme.startsWith(SCHOOL_PREFIX)) {
      const parts = rawTheme.slice(SCHOOL_PREFIX.length).split('|');
      const minPart = parts.find(p => p.startsWith('ministry:')) || '';
      const ministry_id = minPart.slice('ministry:'.length) || undefined;
      const themePart = parts.find(p => p.includes('from-')) || 'from-emerald-600 to-teal-700';
      const regionPart = parts.find(p => !p.startsWith('ministry:') && !p.includes('from-')) || '';
      schools.push({
        id: r.id,
        owner_id: r.teacher_id,
        owner_name: nm(r.teacher_id),
        ministry_id,
        name: r.title,
        stage: r.grade_level || 'تعليم عام',
        region: regionPart || r.subject || 'عام',
        description: r.description || '',
        join_code: r.join_code,
        colorTheme: themePart,
        members_count: counts[r.id] ?? r.members_count ?? 1,
        created_at: createdAt,
      });
    } else {
      const schoolMatch = rawTheme.match(/\|school:([^|]+)/);
      const school_id = schoolMatch ? schoolMatch[1] : undefined;
      classes.push({
        id: r.id,
        teacher_id: r.teacher_id,
        teacher_name: nm(r.teacher_id),
        school_id,
        title: r.title,
        subject: r.subject || '',
        grade_level: r.grade_level || '',
        join_code: r.join_code,
        description: r.description || '',
        class_type: r.class_type || 'class',
        is_archived: !!r.is_archived,
        members_count: counts[r.id] ?? r.members_count ?? 1,
        colorTheme: cleanTheme(rawTheme),
        created_at: createdAt,
      });
    }
  });

  const classById = new Map(classes.map(c => [c.id, c]));
  const spaceTitleById = new Map<string, string>([
    ...classes.map(c => [c.id, c.title] as [string, string]),
    ...schools.map(s => [s.id, s.name] as [string, string]),
    ...ministries.map(m => [m.id, m.name] as [string, string]),
  ]);

  const lessons: Lesson[] = lessonRows.map(r => ({
    id: r.id,
    class_id: r.class_id,
    teacher_id: r.teacher_id,
    teacher_name: nm(r.teacher_id),
    title: r.title,
    content: r.content || '',
    video_url: r.video_url || undefined,
    duration: r.duration || undefined,
    attachment_url: r.attachment_url || undefined,
    attachment_name: r.attachment_name || undefined,
    position: Number(r.position ?? 0),
    published_at: r.published_at || toIso(r.created_at),
  }));

  const courses: Course[] = classes
    .filter(c => c.class_type === 'class')
    .map(c => ({
      id: c.id,
      owner_id: c.teacher_id,
      owner_name: c.teacher_name,
      title: c.title,
      description: c.description,
      category: c.subject || 'عام',
      lessons_count: lessons.filter(l => l.class_id === c.id).length,
      students_count: c.members_count,
      rating: 0,
      image_url: coverFor(c.colorTheme, c.title),
    }));

  const submissions: Submission[] = subRows
    .map(r => ({
      id: r.id,
      assignment_id: r.assignment_id,
      student_id: r.student_id,
      student_name: nm(r.student_id),
      answer_text: r.answer_text || '',
      attachment_url: r.attachment_url || undefined,
      submitted_at: toIso(r.submitted_at),
      grade: r.grade != null ? Number(r.grade) : undefined,
      teacher_feedback: r.teacher_feedback || undefined,
      graded_at: r.grade != null ? toIso(r.submitted_at) : undefined,
    }))
    .sort((a, b) => b.submitted_at.localeCompare(a.submitted_at));

  const assignments: Assignment[] = assignRows.map(r => ({
    id: r.id,
    class_id: r.class_id,
    class_title: classById.get(r.class_id)?.title || '',
    teacher_id: r.teacher_id,
    teacher_name: nm(r.teacher_id),
    title: r.title,
    instructions: r.instructions || '',
    due_at: r.due_at || toIso(r.created_at),
    total_points: Number(r.total_points ?? 20),
    submissions_count: submissions.filter(s => s.assignment_id === r.id).length,
    created_at: toIso(r.created_at),
  }));

  const quizzes: Quiz[] = quizRows.map(r => {
    const keyDoc = keyMap.get(r.id);
    const keyEntries: Record<string, Row> = (keyDoc?.entries && typeof keyDoc.entries === 'object') ? keyDoc.entries : {};
    const questions: QuizQuestion[] = Array.isArray(r.questions)
      ? r.questions.map((q: Row, idx: number) => {
          const qid = String(q.id || `q_${idx}`);
          const k = keyEntries[qid];
          return {
            id: qid,
            type: (q.type || 'mcq') as QuizQuestionType,
            topic: typeof q.topic === 'string' ? q.topic : '',
            question: q.question || '',
            options: Array.isArray(q.options) ? q.options : [],
            correctOptionIndex: k ? Number(k.correctOptionIndex ?? -1) : -1,
            correctOptionIndices: k && Array.isArray(k.correctOptionIndices) ? k.correctOptionIndices : undefined,
            acceptedAnswers: k && Array.isArray(k.acceptedAnswers) ? k.acceptedAnswers : undefined,
            modelAnswer: k && typeof k.modelAnswer === 'string' ? k.modelAnswer : undefined,
            caseSensitive: Boolean(q.caseSensitive),
            explanation: k ? String(k.explanation || '') : '',
            points: Number(q.points) || 1,
          };
        })
      : [];

    const totalPts = questions.reduce((sum, qq) => sum + qq.points, 0);
    const quizAttempts: QuizAttempt[] = attemptRows
      .filter(a => a.quiz_id === r.id)
      .map(a => ({
        id: a.id,
        quiz_id: a.quiz_id,
        student_id: a.student_id,
        student_name: nm(a.student_id),
        answers: (a.answers && typeof a.answers === 'object' ? a.answers : {}) as Record<string, QuizAnswerValue>,
        score: Number(a.score ?? 0),
        totalPoints: totalPts,
        needsManualGrading: Boolean(a.needs_manual_grading),
        teacherFeedback: a.teacher_feedback || '',
        questionFeedback: (a.question_feedback && typeof a.question_feedback === 'object'
          ? a.question_feedback
          : {}) as Record<string, QuestionFeedbackItem>,
        submitted_at: toIso(a.submitted_at || r.created_at),
      }));
    const myAttempt = quizAttempts.find(a => a.student_id === me.id);

    return {
      id: r.id,
      class_id: r.class_id,
      class_title: classById.get(r.class_id)?.title || '',
      title: r.title,
      description: r.description || '',
      timeLimitMinutes: Number(r.time_limit_minutes ?? 10),
      questions,
      isPublished: !!r.is_published,
      attemptsCount: quizAttempts.length,
      attempted: !!myAttempt,
      myScore: myAttempt ? myAttempt.score : 0,
      myAnswers: myAttempt?.answers,
      needsManualGrading: myAttempt?.needsManualGrading,
      teacherFeedback: myAttempt?.teacherFeedback,
      questionFeedback: myAttempt?.questionFeedback,
      attempts: quizAttempts,
    };
  });

  const posts: Post[] = postRows.map(r => {
    const comments: PostComment[] = commentRows
      .filter(c => c.post_id === r.id)
      .map(c => ({
        id: c.id,
        post_id: c.post_id,
        author_id: c.author_id,
        author_name: nm(c.author_id),
        author_avatar: av(c.author_id),
        body: c.body,
        created_at: toIso(c.created_at),
      }));
    const likes = likeRows.filter(l => l.post_id === r.id);
    return {
      id: r.id,
      author_id: r.author_id,
      author_name: nm(r.author_id),
      author_role: rl(r.author_id),
      author_avatar: av(r.author_id),
      body: r.body || '',
      category: r.category || 'all',
      media_url: r.media_url || undefined,
      media_type: r.media_type || undefined,
      visibility: r.visibility || 'public',
      likes_count: likes.length,
      comments_count: comments.length,
      comments,
      is_liked: likes.some(l => l.user_id === me.id),
      is_saved: false,
      created_at: toIso(r.created_at),
    };
  });

  const stories: Story[] = storyRows.map(r => ({
    id: r.id,
    user_id: r.user_id,
    user_name: nm(r.user_id),
    user_role: rl(r.user_id),
    user_avatar: av(r.user_id),
    body: r.body,
    bgGradient: r.bg_gradient,
    created_at: toIso(r.created_at),
    expires_at: r.expires_at,
  }));

  const liveSessions: LiveSession[] = liveRows.map(r => ({
    id: r.id,
    host_id: r.host_id,
    host_name: nm(r.host_id),
    class_id: r.class_id || undefined,
    class_title: r.class_id ? classById.get(r.class_id)?.title : undefined,
    title: r.title,
    description: r.description || '',
    meeting_url: r.meeting_url || undefined,
    starts_at: r.starts_at,
    status: r.status,
    participants_count: 0,
  }));

  const messages: DirectMessage[] = [
    ...dmRows.map(r => ({
      id: r.id,
      sender_id: r.sender_id,
      sender_name: nm(r.sender_id),
      sender_role: rl(r.sender_id),
      recipient_id: r.recipient_id,
      recipient_name: nm(r.recipient_id),
      body: r.body || '',
      attachment: r.attachment_url
        ? attachmentOf(r.attachment_url, r.attachment_name || null, r.sender_id, toIso(r.created_at), nm)
        : undefined,
      reactions: {},
      created_at: toIso(r.created_at),
      read_at: r.read_at || undefined,
    } as DirectMessage)),
    ...cmRows.map(r => ({
      id: r.id,
      sender_id: r.sender_id,
      sender_name: nm(r.sender_id),
      sender_role: rl(r.sender_id),
      recipient_id: r.class_id,
      recipient_name: spaceTitleById.get(r.class_id) || '',
      channel_id: r.class_id,
      body: r.body || '',
      attachment: r.attachment_url
        ? attachmentOf(r.attachment_url, r.attachment_name || null, r.sender_id, toIso(r.created_at), nm)
        : undefined,
      reactions: {},
      created_at: toIso(r.created_at),
    } as DirectMessage)),
  ].sort((a, b) => a.created_at.localeCompare(b.created_at));

  const notifications: NotificationItem[] = notifRows
    .map(r => ({
      id: r.id,
      title: r.payload?.title || 'إشعار',
      body: r.payload?.body || '',
      kind: (['academic', 'social', 'live', 'grade'].includes(r.kind) ? r.kind : 'academic') as NotificationItem['kind'],
      created_at: toIso(r.created_at),
      read: !!r.read_at,
    }))
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const reports: ContentReport[] = reportRows
    .map(r => ({
      id: r.id,
      target_id: r.target_id,
      target_type: r.target_type === 'profile' ? 'user' : r.target_type,
      reporter_name: nm(r.reporter_id),
      reason: r.reason,
      details: [r.details, r.snapshot ? `«${r.snapshot}»` : ''].filter(Boolean).join(' — '),
      status: r.status,
      created_at: toIso(r.created_at),
    }))
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const myTaught = new Set(classes.filter(c => c.teacher_id === me.id).map(c => c.id));
  const classMembers: ClassMemberInfo[] = memberRows
    .filter(r => myTaught.has(r.class_id))
    .map(r => ({ class_id: r.class_id, user_id: r.user_id, name: nm(r.user_id), member_role: r.member_role }));

  const orgIdSet = new Set<string>([
    ...schools.map(s => s.id),
    ...ministries.map(m => m.id),
  ]);
  const orgMembers: ClassMemberInfo[] = memberRows
    .filter(r => orgIdSet.has(r.class_id))
    .map(r => ({ class_id: r.class_id, user_id: r.user_id, name: nm(r.user_id), member_role: r.member_role }));
  const myOrgIds = [...new Set([
    ...schools.filter(s => s.owner_id === me.id).map(s => s.id),
    ...ministries.filter(m => m.owner_id === me.id).map(m => m.id),
    ...orgMembers.filter(m => m.user_id === me.id).map(m => m.class_id),
  ])];

  const followingIds = followRows.filter(f => f.follower_id === me.id).map(f => String(f.followed_id));
  const followerIds = followRows.filter(f => f.followed_id === me.id).map(f => String(f.follower_id));
  const followRequests: FollowRequestItem[] = followReqRows
    .map(r => ({
      id: r.id,
      requester_id: r.requester_id,
      requester_name: nm(r.requester_id),
      requester_avatar: av(r.requester_id),
      requester_role: rl(r.requester_id),
      target_id: r.target_id,
      status: r.status,
      created_at: toIso(r.created_at),
    }))
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const myClassIds = [...new Set([
    ...classes.filter(c => c.teacher_id === me.id).map(c => c.id),
    ...memberRows.filter(r => r.user_id === me.id).map(r => String(r.class_id)),
  ])];

  return {
    classes, schools, ministries, myOrgIds, orgMembers,
    courses, lessons, quizzes, assignments, submissions, posts, stories, liveSessions,
    messages, notifications, reports, contacts, classMembers, myClassIds, followingIds, followerIds, followRequests,
  };
}

function attachmentOf(url: string, name: string | null, by: string, at: string, nm: (id: string) => string) {
  const fname = name || url.split('/').pop() || 'ملف';
  const ext = (fname.split('.').pop() || '').toLowerCase();
  const type = ['webm', 'ogg', 'mp3', 'wav', 'm4a', 'aac', 'opus'].includes(ext) ? 'audio'
    : ext === 'pdf' ? 'pdf'
    : ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext) ? 'image'
    : ['ts', 'js', 'py', 'java', 'html', 'css', 'sql', 'txt'].includes(ext) ? 'code' : 'doc';
  return { id: url, name: fname, size: '', type: type as 'pdf' | 'image' | 'doc' | 'code' | 'audio', url, uploaded_by: nm(by), uploaded_at: at };
}

/* ------------------------------------------------------------------ */
/* Realtime Subscription Helper                                        */
/* ------------------------------------------------------------------ */

export function subscribeRealtimeUpdates(uid: string, onChange: () => void): () => void {
  const unsubs: Array<() => void> = [];

  const watch = (path: string, q: any) => {
    let first = true;
    const u = onSnapshot(
      q,
      () => {
        if (first) {
          first = false;
          return;
        }
        onChange();
      },
      err => {
        if (String(err?.message || '').toLowerCase().includes('permission')) {
          handleFirestoreError(err, OperationType.LIST, path);
        }
      },
    );
    unsubs.push(u);
  };

  watch('live_sessions', query(collection(db, 'live_sessions'), where('status', 'in', ['scheduled', 'live', 'ended'])));
  watch('posts', query(collection(db, 'posts'), where('visibility', 'in', ['public', 'followers'])));
  watch('assignments', query(collection(db, 'assignments'), where('total_points', '>=', 1)));
  watch('quizzes', query(collection(db, 'quizzes'), where('is_published', 'in', [true, false])));

  return () => {
    unsubs.forEach(u => u());
  };
}

export function subscribeRealtimeMessagesAndNotifications(
  uid: string,
  getLookup: () => {
    me: Profile | null;
    contacts: ContactInfo[];
    spaceTitles: Map<string, string>;
  },
  callbacks: {
    onDirectMessages: (dms: DirectMessage[]) => void;
    onClassMessages: (cms: DirectMessage[]) => void;
    onNotifications: (notifs: NotificationItem[]) => void;
  },
): () => void {
  const resolveActor = (actorId: string) => {
    const { me, contacts } = getLookup();
    if (me && actorId === me.id) return { name: me.display_name, role: me.role };
    const hit = contacts.find(c => c.id === actorId);
    return { name: hit?.name || 'مستخدم', role: (hit?.role as AppRole) || 'student' };
  };

  let firstDm = true;
  const unsubDm = onSnapshot(
    query(collection(db, 'direct_messages'), where('participants', 'array-contains', uid), limit(500)),
    snap => {
      if (firstDm) {
        firstDm = false;
        return;
      }
      const mapped: DirectMessage[] = snap.docs.map(d => {
        const r = mapDoc(d);
        const sender = resolveActor(r.sender_id);
        const recipient = resolveActor(r.recipient_id);
        return {
          id: r.id,
          sender_id: r.sender_id,
          sender_name: sender.name,
          sender_role: sender.role,
          recipient_id: r.recipient_id,
          recipient_name: recipient.name,
          body: r.body || '',
          attachment: r.attachment_url
            ? attachmentOf(r.attachment_url, r.attachment_name || null, r.sender_id, toIso(r.created_at), id => resolveActor(id).name)
            : undefined,
          reactions: {},
          created_at: toIso(r.created_at),
          read_at: r.read_at || undefined,
        };
      });
      callbacks.onDirectMessages(mapped);
    },
    err => {
      if (String(err?.message || '').toLowerCase().includes('permission')) {
        handleFirestoreError(err, OperationType.LIST, 'direct_messages');
      }
    },
  );

  let firstCm = true;
  const unsubCm = onSnapshot(
    query(collection(db, 'class_messages'), where('class_id', '!=', ''), limit(500)),
    snap => {
      if (firstCm) {
        firstCm = false;
        return;
      }
      const { spaceTitles } = getLookup();
      const mapped: DirectMessage[] = snap.docs.map(d => {
        const r = mapDoc(d);
        const sender = resolveActor(r.sender_id);
        return {
          id: r.id,
          sender_id: r.sender_id,
          sender_name: sender.name,
          sender_role: sender.role,
          recipient_id: r.class_id,
          recipient_name: spaceTitles.get(r.class_id) || '',
          channel_id: r.class_id,
          body: r.body || '',
          attachment: r.attachment_url
            ? attachmentOf(r.attachment_url, r.attachment_name || null, r.sender_id, toIso(r.created_at), id => resolveActor(id).name)
            : undefined,
          reactions: {},
          created_at: toIso(r.created_at),
        };
      });
      callbacks.onClassMessages(mapped);
    },
    err => {
      if (String(err?.message || '').toLowerCase().includes('permission')) {
        handleFirestoreError(err, OperationType.LIST, 'class_messages');
      }
    },
  );

  let firstNotif = true;
  const unsubNotif = onSnapshot(
    query(collection(db, 'notifications'), where('user_id', '==', uid), limit(50)),
    snap => {
      if (firstNotif) {
        firstNotif = false;
        return;
      }
      const mapped: NotificationItem[] = snap.docs
        .map(d => {
          const r = mapDoc(d);
          return {
            id: r.id,
            title: r.payload?.title || 'إشعار',
            body: r.payload?.body || '',
            kind: (['academic', 'social', 'live', 'grade'].includes(r.kind) ? r.kind : 'academic') as NotificationItem['kind'],
            created_at: toIso(r.created_at),
            read: !!r.read_at,
          };
        })
        .sort((a, b) => b.created_at.localeCompare(a.created_at));
      callbacks.onNotifications(mapped);
    },
    err => {
      if (String(err?.message || '').toLowerCase().includes('permission')) {
        handleFirestoreError(err, OperationType.LIST, 'notifications');
      }
    },
  );

  return () => {
    unsubDm();
    unsubCm();
    unsubNotif();
  };
}

/* ------------------------------------------------------------------ */
/* Mutations                                                           */
/* ------------------------------------------------------------------ */

async function createClassRecord(payload: Record<string, any>, uid: string, memberRole: 'student' | 'assistant') {
  const joinCode = makeJoinCode();
  const clsRef = doc(collection(db, 'classes'));
  try {
    await setDoc(clsRef, {
      ...payload,
      teacher_id: uid,
      join_code: joinCode,
      is_archived: false,
      members_count: 1,
      created_at: serverTimestamp(),
    });
    await Promise.all([
      setDoc(doc(db, 'class_codes', joinCode), {
        join_code: joinCode,
        class_id: clsRef.id,
        teacher_id: uid,
        is_archived: false,
      }),
      setDoc(doc(db, 'class_members', `${clsRef.id}_${uid}`), {
        class_id: clsRef.id,
        user_id: uid,
        member_role: memberRole,
        joined_at: serverTimestamp(),
      }),
    ]);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'classes');
  }
}

export async function createClass(uid: string, c: ClassItem) {
  const encodedTheme = c.school_id ? `${cleanTheme(c.colorTheme)}|school:${c.school_id}` : cleanTheme(c.colorTheme);
  await createClassRecord(
    {
      title: c.title.slice(0, 120),
      subject: (c.subject || '').slice(0, 120),
      grade_level: (c.grade_level || '').slice(0, 120),
      description: (c.description || '').slice(0, 2000),
      class_type: c.class_type || 'class',
      color_theme: encodedTheme.slice(0, 250),
    },
    uid,
    'assistant',
  );
}

export async function createMinistry(
  uid: string,
  m: { name: string; region: string; description: string; colorTheme?: string },
) {
  const theme = m.colorTheme || 'from-slate-800 to-slate-900';
  const region = (m.region || 'عام').replace(/\|/g, ' ');
  await createClassRecord(
    {
      title: m.name.trim().slice(0, 120),
      subject: 'إشراف وزاري ومجمّع تعليمي',
      grade_level: region.slice(0, 120),
      description: (m.description.trim() || 'مظلة إشرافية لمتابعة المدارس والصفوف وتوجيه التعاميم التربوية.').slice(0, 2000),
      class_type: 'class',
      color_theme: `${MINISTRY_PREFIX}${theme}|${region}`.slice(0, 250),
    },
    uid,
    'assistant',
  );
}

export async function createSchool(
  uid: string,
  s: { name: string; stage: string; region: string; description: string; ministry_id?: string; colorTheme?: string },
) {
  const theme = s.colorTheme || 'from-emerald-600 to-teal-700';
  const region = (s.region || 'عام').replace(/\|/g, ' ');
  await createClassRecord(
    {
      title: s.name.trim().slice(0, 120),
      subject: region.slice(0, 120),
      grade_level: (s.stage.trim() || 'تعليم عام').slice(0, 120),
      description: (s.description.trim() || 'مؤسسة تعليمية لإدارة الصفوف والمعلمين والطلاب والاختبارات.').slice(0, 2000),
      class_type: 'class',
      color_theme: `${SCHOOL_PREFIX}ministry:${s.ministry_id || ''}|${theme}|${region}`.slice(0, 250),
    },
    uid,
    'assistant',
  );
}

export async function linkSchoolToMinistry(school: SchoolItem, ministryId: string) {
  const region = (school.region || 'عام').replace(/\|/g, ' ');
  const theme = cleanTheme(school.colorTheme);
  try {
    await updateDoc(doc(db, 'classes', school.id), {
      color_theme: `${SCHOOL_PREFIX}ministry:${ministryId || ''}|${theme}|${region}`.slice(0, 250),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `classes/${school.id}`);
  }
}

export async function linkClassToSchool(cls: ClassItem, schoolId: string) {
  const base = cleanTheme(cls.colorTheme);
  try {
    await updateDoc(doc(db, 'classes', cls.id), {
      color_theme: (schoolId ? `${base}|school:${schoolId}` : base).slice(0, 250),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `classes/${cls.id}`);
  }
}

export async function joinClass(code: string): Promise<boolean> {
  const uid = auth.currentUser?.uid;
  const cleanCode = (code || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  if (!uid || !cleanCode) return false;
  try {
    const codeSnap = await getDoc(doc(db, 'class_codes', cleanCode));
    if (!codeSnap.exists()) return false;
    const codeData = codeSnap.data() as Row;
    if (codeData.is_archived || !codeData.class_id) return false;
    const memberId = `${codeData.class_id}_${uid}`;
    const memberRef = doc(db, 'class_members', memberId);
    const existingMember = await getDoc(memberRef);
    if (!existingMember.exists()) {
      await setDoc(memberRef, {
        class_id: codeData.class_id,
        user_id: uid,
        member_role: 'student',
        joined_at: serverTimestamp(),
      });
      await updateDoc(doc(db, 'classes', codeData.class_id), {
        members_count: increment(1),
      }).catch(() => {});
    }
    return true;
  } catch {
    return false;
  }
}

export async function createLesson(uid: string, l: Lesson) {
  const payload: Record<string, any> = {
    class_id: l.class_id,
    teacher_id: uid,
    title: l.title.slice(0, 200),
    content: (l.content || '').slice(0, 20000),
    position: Math.max(0, Math.round(Number(l.position ?? 0)) || 0),
    published_at: new Date().toISOString(),
    created_at: serverTimestamp(),
  };
  if (l.video_url) payload.video_url = l.video_url.slice(0, 2000);
  if (l.duration) payload.duration = l.duration.slice(0, 40);
  if (l.attachment_url) payload.attachment_url = l.attachment_url.slice(0, 2000);
  if (l.attachment_name) payload.attachment_name = l.attachment_name.slice(0, 255);

  try {
    await addDoc(collection(db, 'lessons'), payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'lessons');
  }
}

export function normalizeQuizText(txt: string, caseSensitive = false): string {
  let v = (txt || '').trim().replace(/\s+/g, ' ');
  v = v.replace(/[\u064B-\u065F\u0670\u0640]/g, '');
  v = v.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
  return caseSensitive ? v : v.toLowerCase();
}

export async function createQuiz(uid: string, q: Quiz) {
  const quizRef = doc(collection(db, 'quizzes'));
  const sanitizedQuestions: Array<Record<string, any>> = [];
  const keyEntries: Record<string, any> = {};

  q.questions.forEach((qq, idx) => {
    const qid = qq.id && /^[a-zA-Z0-9_-]+$/.test(qq.id) ? qq.id : `q_${idx}_${Date.now()}`;
    sanitizedQuestions.push({
      id: qid,
      type: qq.type || 'mcq',
      topic: (qq.topic || '').trim(),
      question: qq.question,
      options: Array.isArray(qq.options) ? qq.options : [],
      caseSensitive: Boolean(qq.caseSensitive),
      points: Number(qq.points) || 1,
    });
    keyEntries[qid] = {
      type: qq.type || 'mcq',
      correctOptionIndex: qq.correctOptionIndex ?? 0,
      correctOptionIndices: qq.correctOptionIndices || [],
      acceptedAnswers: qq.acceptedAnswers || [],
      modelAnswer: qq.modelAnswer || '',
      caseSensitive: Boolean(qq.caseSensitive),
      explanation: qq.explanation || '',
      points: Number(qq.points) || 1,
    };
  });

  try {
    await setDoc(quizRef, {
      class_id: q.class_id,
      teacher_id: uid,
      title: q.title.slice(0, 200),
      description: (q.description || '').slice(0, 2000),
      time_limit_minutes: Math.max(1, Number(q.timeLimitMinutes) || 10),
      is_published: Boolean(q.isPublished),
      questions: sanitizedQuestions,
      created_at: serverTimestamp(),
    });
    await setDoc(doc(db, 'quiz_answer_keys', quizRef.id), {
      quiz_id: quizRef.id,
      teacher_id: uid,
      entries: keyEntries,
      created_at: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'quizzes');
  }
}

export interface QuizKeyEntry {
  type?: QuizQuestionType;
  correct?: number;
  correctIndices?: number[];
  acceptedAnswers?: string[];
  modelAnswer?: string;
  explanation: string;
  isCorrect?: boolean;
  pendingReview?: boolean;
}

export interface QuizResult {
  score: number;
  total: number;
  needsManualGrading?: boolean;
  key: Record<string, QuizKeyEntry>;
}

export async function submitQuiz(
  quizId: string,
  answers: Record<string, QuizAnswerValue>,
  questions: QuizQuestion[] = [],
): Promise<QuizResult> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('يجب تسجيل الدخول لإرسال الاختبار');

  const quizSnap = await getDoc(doc(db, 'quizzes', quizId));
  const quizData = quizSnap.exists() ? (quizSnap.data() as Row) : {};
  const teacherId = String(quizData.teacher_id || '');
  const attemptRef = doc(db, 'quiz_attempts', `${quizId}_${uid}`);

  try {
    await setDoc(attemptRef, {
      quiz_id: quizId,
      teacher_id: teacherId,
      student_id: uid,
      answers,
      score: 0,
      auto_graded: false,
      needs_manual_grading: false,
      submitted_at: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `quiz_attempts/${quizId}_${uid}`);
  }

  let keyEntries: Record<string, Row> = {};
  try {
    const keySnap = await getDoc(doc(db, 'quiz_answer_keys', quizId));
    if (keySnap.exists()) {
      keyEntries = (keySnap.data() as Row)?.entries || {};
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `quiz_answer_keys/${quizId}`);
  }

  const qList = questions.length > 0 ? questions : ((quizData.questions as QuizQuestion[]) || []);
  let score = 0;
  let total = 0;
  let needsManual = false;
  const resultKey: Record<string, QuizKeyEntry> = {};

  for (const q of qList) {
    const k = keyEntries[q.id] || {};
    const qType = (k.type || q.type || 'mcq') as QuizQuestionType;
    const pts = Number(k.points ?? q.points ?? 1);
    const caseSens = Boolean(k.caseSensitive ?? q.caseSensitive);
    const explanation = String(k.explanation ?? q.explanation ?? '');
    const val = answers[q.id];
    total += pts;

    if (qType === 'mcq' || qType === 'true_false') {
      const correct = Number(k.correctOptionIndex ?? q.correctOptionIndex ?? -1);
      const ok = typeof val === 'number' && val === correct;
      if (ok) score += pts;
      resultKey[q.id] = { type: qType, correct, explanation, isCorrect: ok };
    } else if (qType === 'multi_select') {
      const expected = [...((k.correctOptionIndices ?? q.correctOptionIndices ?? []) as number[])].sort((a, b) => a - b);
      const given = Array.isArray(val) ? [...new Set(val)].sort((a, b) => a - b) : [];
      const ok = expected.length > 0 && expected.length === given.length && expected.every((v, idx) => v === given[idx]);
      if (ok) score += pts;
      resultKey[q.id] = { type: 'multi_select', correctIndices: expected, explanation, isCorrect: ok };
    } else if (qType === 'short_answer' || qType === 'fill_blank') {
      const userStr = typeof val === 'string' ? normalizeQuizText(val, caseSens) : '';
      const accepted = (k.acceptedAnswers ?? q.acceptedAnswers ?? []) as string[];
      const ok = userStr !== '' && accepted.some(a => normalizeQuizText(a, caseSens) === userStr);
      if (ok) score += pts;
      resultKey[q.id] = { type: qType, acceptedAnswers: accepted, explanation, isCorrect: ok };
    } else if (qType === 'essay') {
      needsManual = true;
      resultKey[q.id] = {
        type: 'essay',
        modelAnswer: String(k.modelAnswer ?? q.modelAnswer ?? ''),
        explanation,
        pendingReview: true,
      };
    }
  }

  try {
    await updateDoc(attemptRef, {
      score,
      auto_graded: true,
      needs_manual_grading: needsManual,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `quiz_attempts/${quizId}_${uid}`);
  }

  return { score, total, needsManualGrading: needsManual, key: resultKey };
}

export async function uploadQuizAudioFeedback(userId: string, blobOrFile: Blob | File, extHint = 'webm'): Promise<string> {
  if (blobOrFile.size > 10 * 1024 * 1024) throw new Error('حجم التسجيل الصوتي أكبر من 10 ميجابايت');
  const rawName = blobOrFile instanceof File ? blobOrFile.name : `voice.${extHint}`;
  const ext = (rawName.split('.').pop() || extHint).toLowerCase().replace(/[^a-z0-9]/g, '') || 'webm';
  const storagePath = `nemvia/${userId}/quiz-feedback/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const contentType = blobOrFile.type || (ext === 'mp3' ? 'audio/mpeg' : ext === 'm4a' ? 'audio/mp4' : `audio/${ext}`);
  try {
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, blobOrFile, { contentType });
    return await getDownloadURL(storageRef);
  } catch (err: any) {
    throw new Error(err?.message || 'تعذّر رفع التسجيل الصوتي — تأكد من تفعيل Firebase Storage');
  }
}

export async function gradeQuizAttempt(
  attemptId: string,
  score: number,
  feedback: string,
  questionFeedback: Record<string, QuestionFeedbackItem> = {},
) {
  const attemptRef = doc(db, 'quiz_attempts', attemptId);
  try {
    const snap = await getDoc(attemptRef);
    await updateDoc(attemptRef, {
      score,
      needs_manual_grading: false,
      teacher_feedback: (feedback || '').slice(0, 4000),
      question_feedback: questionFeedback,
    });
    if (snap.exists()) {
      const data = snap.data() as Row;
      if (data.student_id) {
        await addDoc(collection(db, 'notifications'), {
          user_id: data.student_id,
          kind: 'grade',
          payload: {
            title: 'تم رصد درجة اختبارك',
            body: `الدرجة النهائية: ${score}${feedback ? ` — ${feedback.slice(0, 120)}` : ''}`,
          },
          created_at: serverTimestamp(),
        }).catch(() => {});
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `quiz_attempts/${attemptId}`);
  }
}

export interface QuizCategoryBreakdown {
  key: string;
  label: string;
  totalQuestions: number;
  correctQuestions: number;
  earnedPoints: number;
  maxPoints: number;
  accuracy: number;
}

export interface QuestionPerformanceEntry {
  question: QuizQuestion;
  index: number;
  type: QuizQuestionType;
  userAnswer: QuizAnswerValue | undefined;
  status: 'correct' | 'incorrect' | 'pending' | 'unanswered';
  earnedPoints: number;
  maxPoints: number;
  keyEntry?: QuizKeyEntry;
  teacherFeedback?: QuestionFeedbackItem;
}

export interface QuizPerformanceReport {
  totalScore: number;
  maxScore: number;
  percentage: number;
  gradeLabel: string;
  correctCount: number;
  incorrectCount: number;
  pendingCount: number;
  unansweredCount: number;
  byType: QuizCategoryBreakdown[];
  byTopic: QuizCategoryBreakdown[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  items: QuestionPerformanceEntry[];
}

const TYPE_AR_LABELS: Record<QuizQuestionType, string> = {
  mcq: 'اختيار من متعدد',
  true_false: 'صح أم خطأ',
  multi_select: 'تحديد متعدد',
  short_answer: 'إجابة قصيرة',
  fill_blank: 'أكمل الفراغ',
  essay: 'سؤال مقالي',
};

export function buildQuizPerformanceReport(
  quiz: Quiz,
  answers: Record<string, QuizAnswerValue> = {},
  result?: QuizResult | null,
  questionFeedback?: Record<string, QuestionFeedbackItem>,
): QuizPerformanceReport {
  const maxScore = result?.total ?? quiz.questions.reduce((sum, q) => sum + q.points, 0);
  const typeMap = new Map<QuizQuestionType, { totalQ: number; okQ: number; earned: number; max: number }>();
  const topicMap = new Map<string, { totalQ: number; okQ: number; earned: number; max: number }>();

  let correctCount = 0;
  let incorrectCount = 0;
  let pendingCount = 0;
  let unansweredCount = 0;
  let computedScore = 0;

  const items: QuestionPerformanceEntry[] = quiz.questions.map((q, index) => {
    const qType: QuizQuestionType = q.type || 'mcq';
    const userVal = answers[q.id];
    const keyEntry = result?.key?.[q.id];
    const qFb = questionFeedback?.[q.id] ?? quiz.questionFeedback?.[q.id];

    const hasAnswer =
      userVal !== undefined &&
      userVal !== null &&
      !(Array.isArray(userVal) && userVal.length === 0) &&
      !(typeof userVal === 'string' && userVal.trim() === '');

    let status: QuestionPerformanceEntry['status'] = 'incorrect';
    let earnedPoints = 0;

    if (qFb?.points_awarded !== undefined) {
      earnedPoints = Math.max(0, Math.min(q.points, Number(qFb.points_awarded)));
      if (earnedPoints >= q.points * 0.6) {
        status = 'correct';
        correctCount += 1;
      } else if (hasAnswer || earnedPoints > 0 || qType === 'essay') {
        status = 'incorrect';
        incorrectCount += 1;
      } else {
        status = 'unanswered';
        unansweredCount += 1;
      }
    } else if (!hasAnswer) {
      status = 'unanswered';
      unansweredCount += 1;
    } else if (qType === 'essay' || keyEntry?.pendingReview) {
      if (hasAnswer) {
        status = 'pending';
        pendingCount += 1;
      }
    } else if (keyEntry?.isCorrect !== undefined) {
      if (keyEntry.isCorrect) {
        status = 'correct';
        earnedPoints = q.points;
        correctCount += 1;
      } else if (hasAnswer) {
        status = 'incorrect';
        incorrectCount += 1;
      }
    } else if (hasAnswer) {
      if ((qType === 'mcq' || qType === 'true_false') && q.correctOptionIndex >= 0 && typeof userVal === 'number') {
        if (userVal === q.correctOptionIndex) {
          status = 'correct';
          earnedPoints = q.points;
          correctCount += 1;
        } else {
          status = 'incorrect';
          incorrectCount += 1;
        }
      } else if (qType === 'multi_select' && q.correctOptionIndices?.length) {
        const exp = [...q.correctOptionIndices].sort((a, b) => a - b);
        const got = Array.isArray(userVal) ? [...new Set(userVal)].sort((a, b) => a - b) : [];
        if (exp.length === got.length && exp.every((v, i) => v === got[i])) {
          status = 'correct';
          earnedPoints = q.points;
          correctCount += 1;
        } else {
          status = 'incorrect';
          incorrectCount += 1;
        }
      } else if ((qType === 'short_answer' || qType === 'fill_blank') && q.acceptedAnswers?.length) {
        const norm = typeof userVal === 'string' ? normalizeQuizText(userVal, q.caseSensitive) : '';
        if (norm && q.acceptedAnswers.some(a => normalizeQuizText(a, q.caseSensitive) === norm)) {
          status = 'correct';
          earnedPoints = q.points;
          correctCount += 1;
        } else {
          status = 'incorrect';
          incorrectCount += 1;
        }
      } else if (keyEntry?.correct !== undefined && typeof userVal === 'number') {
        if (userVal === keyEntry.correct) {
          status = 'correct';
          earnedPoints = q.points;
          correctCount += 1;
        } else {
          status = 'incorrect';
          incorrectCount += 1;
        }
      } else {
        status = 'pending';
        pendingCount += 1;
      }
    }

    computedScore += earnedPoints;

    if (status !== 'pending') {
      const tStat = typeMap.get(qType) || { totalQ: 0, okQ: 0, earned: 0, max: 0 };
      tStat.totalQ += 1;
      if (status === 'correct') tStat.okQ += 1;
      tStat.earned += earnedPoints;
      tStat.max += q.points;
      typeMap.set(qType, tStat);

      const topicName = (q.topic || '').trim();
      if (topicName) {
        const topStat = topicMap.get(topicName) || { totalQ: 0, okQ: 0, earned: 0, max: 0 };
        topStat.totalQ += 1;
        if (status === 'correct') topStat.okQ += 1;
        topStat.earned += earnedPoints;
        topStat.max += q.points;
        topicMap.set(topicName, topStat);
      }
    }

    return {
      question: q,
      index,
      type: qType,
      userAnswer: userVal,
      status,
      earnedPoints,
      maxPoints: q.points,
      keyEntry,
      teacherFeedback: qFb,
    };
  });

  const totalScore = result?.score ?? (quiz.attempted ? (quiz.myScore ?? computedScore) : computedScore);
  const percentage = maxScore > 0 ? Math.min(100, Math.round((totalScore / maxScore) * 100)) : 0;
  const gradeLabel =
    percentage >= 90 ? 'ممتاز'
      : percentage >= 80 ? 'جيد جداً'
      : percentage >= 70 ? 'جيد'
      : percentage >= 55 ? 'مقبول'
      : 'يحتاج إلى مراجعة ودعم';

  const byType: QuizCategoryBreakdown[] = [...typeMap.entries()].map(([t, s]) => ({
    key: t,
    label: TYPE_AR_LABELS[t] || t,
    totalQuestions: s.totalQ,
    correctQuestions: s.okQ,
    earnedPoints: s.earned,
    maxPoints: s.max,
    accuracy: s.max > 0 ? Math.round((s.earned / s.max) * 100) : 0,
  }));

  const byTopic: QuizCategoryBreakdown[] = [...topicMap.entries()].map(([topic, s]) => ({
    key: topic,
    label: topic,
    totalQuestions: s.totalQ,
    correctQuestions: s.okQ,
    earnedPoints: s.earned,
    maxPoints: s.max,
    accuracy: s.max > 0 ? Math.round((s.earned / s.max) * 100) : 0,
  }));

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  byTopic.forEach(tp => {
    if (tp.accuracy >= 75) strengths.push(`إتقان واضح لموضوع «${tp.label}» بنسبة ${tp.accuracy}% (${tp.correctQuestions}/${tp.totalQuestions})`);
    else if (tp.accuracy < 60) weaknesses.push(`تحتاج إلى تقوية في موضوع «${tp.label}» (${tp.accuracy}%)`);
  });

  byType.forEach(bt => {
    if (bt.accuracy >= 75) {
      strengths.push(`أداء متميز في أسئلة «${bt.label}» بدقة ${bt.accuracy}%`);
    } else if (bt.accuracy < 60) {
      weaknesses.push(`انخفاض الدقة في أسئلة «${bt.label}» (${bt.accuracy}% — ${bt.correctQuestions}/${bt.totalQuestions})`);
    }
  });

  if (unansweredCount > 0) {
    weaknesses.push(`تركت ${unansweredCount} ${unansweredCount === 1 ? 'سؤالاً' : 'أسئلة'} بدون إجابة قبل انتهاء الوقت`);
    recommendations.push('راقب مؤقت الاختبار ووزّع وقتك على جميع الأسئلة بحيث لا تترك سؤالاً فارغاً.');
  }

  if (byType.some(b => (b.key === 'short_answer' || b.key === 'fill_blank') && b.accuracy < 60)) {
    recommendations.push('راجع المصطلحات والتعريفات الأساسية بدقة لتحسين أدائك في الأسئلة الكتابية وإكمال الفراغ.');
  }
  if (byType.some(b => b.key === 'multi_select' && b.accuracy < 60)) {
    recommendations.push('في أسئلة التحديد المتعدد، تحقق من جميع الخيارات واحداً تلو الآخر ولا تكتفِ بأول إجابة صحيحة.');
  }
  if (byType.some(b => (b.key === 'mcq' || b.key === 'true_false') && b.accuracy < 60)) {
    recommendations.push('اقرأ صيغة السؤال حتى النهاية وانتبه لكلمات النفي أو الاستثناء قبل اختيار الإجابة.');
  }
  if (pendingCount > 0) {
    recommendations.push(`لديك ${pendingCount} سؤال/أسئلة مقالية بانتظار تصحيح المعلم وإضافة تغذيته الراجعة.`);
  }
  if (strengths.length === 0 && percentage >= 50) {
    strengths.push('بداية جيدة في هذا الاختبار مع استيعاب عدد من المفاهيم الأساسية.');
  }
  if (weaknesses.length === 0 && percentage >= 85) {
    recommendations.push('مستواك ممتاز! جرّب مساعدة زملائك أو الانتقال للدرس والتحدي التالي.');
  } else if (recommendations.length === 0) {
    recommendations.push('أعد قراءة التفسيرات العلمية للأسئلة الخاطئة ثم راجع الدرس المرتبط بها.');
  }

  return {
    totalScore,
    maxScore,
    percentage,
    gradeLabel,
    correctCount,
    incorrectCount,
    pendingCount,
    unansweredCount,
    byType,
    byTopic,
    strengths,
    weaknesses,
    recommendations,
    items,
  };
}

export async function createAssignment(
  uid: string,
  a: { class_id: string; title: string; instructions: string; due_at: string; total_points: number },
) {
  try {
    await addDoc(collection(db, 'assignments'), {
      class_id: a.class_id,
      teacher_id: uid,
      title: a.title.slice(0, 200),
      instructions: (a.instructions || '').slice(0, 10000),
      due_at: a.due_at || '',
      total_points: Math.max(1, Math.round(Number(a.total_points) || 20)),
      created_at: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'assignments');
  }
}

export async function submitAssignment(uid: string, s: Submission) {
  const subRef = doc(db, 'submissions', `${s.assignment_id}_${uid}`);
  try {
    const [existingSnap, assignSnap] = await Promise.all([
      getDoc(subRef),
      getDoc(doc(db, 'assignments', s.assignment_id)),
    ]);
    const assignData = assignSnap.exists() ? (assignSnap.data() as Row) : {};

    if (existingSnap.exists()) {
      const updatePayload: Record<string, any> = {
        answer_text: (s.answer_text || '').slice(0, 15000),
        submitted_at: serverTimestamp(),
      };
      if (s.attachment_url) updatePayload.attachment_url = s.attachment_url.slice(0, 2000);
      await updateDoc(subRef, updatePayload);
    } else {
      const createPayload: Record<string, any> = {
        assignment_id: s.assignment_id,
        class_id: String(assignData.class_id || ''),
        teacher_id: String(assignData.teacher_id || ''),
        student_id: uid,
        answer_text: (s.answer_text || '').slice(0, 15000),
        submitted_at: serverTimestamp(),
      };
      if (s.attachment_url) createPayload.attachment_url = s.attachment_url.slice(0, 2000);
      await setDoc(subRef, createPayload);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `submissions/${s.assignment_id}_${uid}`);
  }
}

export async function gradeSubmission(id: string, grade: number, feedback: string) {
  try {
    const subRef = doc(db, 'submissions', id);
    const snap = await getDoc(subRef);
    await updateDoc(subRef, {
      grade,
      teacher_feedback: (feedback || '').slice(0, 4000),
    });
    if (snap.exists()) {
      const data = snap.data() as Row;
      if (data.student_id) {
        await addDoc(collection(db, 'notifications'), {
          user_id: data.student_id,
          kind: 'grade',
          payload: {
            title: 'تم تصحيح واجبك',
            body: `الدرجة: ${grade}${feedback ? ` — ${feedback.slice(0, 120)}` : ''}`,
          },
          created_at: serverTimestamp(),
        }).catch(() => {});
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `submissions/${id}`);
  }
}

export async function createPost(uid: string, p: Post) {
  const payload: Record<string, any> = {
    author_id: uid,
    body: (p.body || '').slice(0, 10000),
    category: p.category || 'all',
    visibility: p.visibility || 'public',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
  if (p.media_url) payload.media_url = p.media_url.slice(0, 2000);
  if (p.media_type) payload.media_type = p.media_type;

  try {
    await addDoc(collection(db, 'posts'), payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'posts');
  }
}

export async function setLike(uid: string, postId: string, liked: boolean) {
  const likeRef = doc(db, 'post_likes', `${postId}_${uid}`);
  try {
    if (liked) {
      await setDoc(likeRef, { post_id: postId, user_id: uid, created_at: serverTimestamp() });
    } else {
      await deleteDoc(likeRef);
    }
  } catch (err) {
    handleFirestoreError(err, liked ? OperationType.CREATE : OperationType.DELETE, `post_likes/${postId}_${uid}`);
  }
}

export async function addComment(uid: string, postId: string, body: string) {
  try {
    await addDoc(collection(db, 'comments'), {
      post_id: postId,
      author_id: uid,
      body: body.slice(0, 3000),
      created_at: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'comments');
  }
}

export async function createStory(uid: string, s: Story) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  try {
    await addDoc(collection(db, 'stories'), {
      user_id: uid,
      body: s.body.slice(0, 500),
      bg_gradient: (s.bgGradient || 'from-sky-500 to-indigo-600').slice(0, 120),
      created_at: serverTimestamp(),
      expires_at: expiresAt,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'stories');
  }
}

export async function createLive(
  uid: string,
  l: { title: string; description: string; class_id?: string; meeting_url: string; starts_at: string },
) {
  const payload: Record<string, any> = {
    host_id: uid,
    title: l.title.slice(0, 200),
    description: (l.description || '').slice(0, 2000),
    starts_at: l.starts_at || new Date().toISOString(),
    status: 'scheduled',
    created_at: serverTimestamp(),
  };
  if (l.class_id) payload.class_id = l.class_id;
  if (l.meeting_url) payload.meeting_url = l.meeting_url.slice(0, 2000);
  try {
    await addDoc(collection(db, 'live_sessions'), payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'live_sessions');
  }
}

export async function setLiveStatus(id: string, status: 'scheduled' | 'live' | 'ended' | 'cancelled') {
  try {
    await updateDoc(doc(db, 'live_sessions', id), { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `live_sessions/${id}`);
  }
}

export async function sendMessage(uid: string, m: DirectMessage) {
  const att: Record<string, any> = {};
  if (m.attachment?.url) att.attachment_url = m.attachment.url.slice(0, 2000);
  if (m.attachment?.name) att.attachment_name = m.attachment.name.slice(0, 255);

  if (m.channel_id) {
    try {
      await addDoc(collection(db, 'class_messages'), {
        class_id: m.channel_id,
        sender_id: uid,
        body: (m.body || '').slice(0, 5000),
        ...att,
        created_at: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'class_messages');
    }
  } else {
    try {
      await addDoc(collection(db, 'direct_messages'), {
        sender_id: uid,
        recipient_id: m.recipient_id,
        participants: [uid, m.recipient_id],
        body: (m.body || '').slice(0, 5000),
        ...att,
        created_at: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'direct_messages');
    }
  }
}

export async function markNotificationRead(id: string) {
  try {
    await updateDoc(doc(db, 'notifications', id), { read_at: new Date().toISOString() });
  } catch {
    /* ignore */
  }
}

export async function markAllNotificationsRead(uid: string) {
  try {
    const snap = await getDocs(query(collection(db, 'notifications'), where('user_id', '==', uid)));
    const batch = writeBatch(db);
    const now = new Date().toISOString();
    let dirty = false;
    snap.docs.forEach(d => {
      if (!d.data().read_at) {
        batch.update(d.ref, { read_at: now });
        dirty = true;
      }
    });
    if (dirty) await batch.commit();
  } catch {
    /* ignore */
  }
}

export async function createReport(
  uid: string,
  r: { target_type: 'post' | 'profile' | 'comment' | 'message'; target_id: string; reason: string; details?: string; snapshot?: string },
) {
  try {
    await addDoc(collection(db, 'content_reports'), {
      reporter_id: uid,
      target_type: r.target_type,
      target_id: r.target_id,
      reason: r.reason.slice(0, 200),
      details: (r.details || '').slice(0, 2000),
      snapshot: (r.snapshot || '').slice(0, 500),
      status: 'open',
      created_at: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'content_reports');
  }
}

export async function setReportStatus(id: string, status: 'resolved' | 'dismissed') {
  try {
    await updateDoc(doc(db, 'content_reports', id), { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `content_reports/${id}`);
  }
}

export async function deletePost(id: string) {
  try {
    await deleteDoc(doc(db, 'posts', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `posts/${id}`);
  }
}

export async function updatePost(
  id: string,
  patch: { body?: string; category?: 'all' | 'questions' | 'notes' | 'announcements'; visibility?: 'public' | 'followers' | 'private' },
) {
  const clean: Record<string, any> = { updated_at: serverTimestamp() };
  if (patch.body !== undefined) clean.body = patch.body.slice(0, 10000);
  if (patch.category !== undefined) clean.category = patch.category;
  if (patch.visibility !== undefined) clean.visibility = patch.visibility;
  try {
    await updateDoc(doc(db, 'posts', id), clean);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `posts/${id}`);
  }
}

export async function deleteComment(id: string) {
  try {
    await deleteDoc(doc(db, 'comments', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `comments/${id}`);
  }
}

export async function deleteStory(id: string) {
  try {
    await deleteDoc(doc(db, 'stories', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `stories/${id}`);
  }
}

export async function followUser(meId: string, targetId: string, targetVisibility: 'public' | 'private' = 'public') {
  if (targetVisibility === 'private') {
    const reqRef = doc(db, 'follow_requests', `${meId}_${targetId}`);
    try {
      await setDoc(reqRef, {
        requester_id: meId,
        target_id: targetId,
        status: 'pending',
        created_at: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `follow_requests/${meId}_${targetId}`);
    }
  } else {
    const folRef = doc(db, 'follows', `${meId}_${targetId}`);
    try {
      await setDoc(folRef, {
        follower_id: meId,
        followed_id: targetId,
        created_at: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `follows/${meId}_${targetId}`);
    }
  }
}

export async function unfollowUser(meId: string, targetId: string) {
  try {
    await deleteDoc(doc(db, 'follows', `${meId}_${targetId}`));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `follows/${meId}_${targetId}`);
  }
}

export async function cancelFollowRequest(meId: string, targetId: string) {
  try {
    await deleteDoc(doc(db, 'follow_requests', `${meId}_${targetId}`));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `follow_requests/${meId}_${targetId}`);
  }
}

export async function respondFollowRequest(requestId: string, accept: boolean) {
  const reqRef = doc(db, 'follow_requests', requestId);
  try {
    const snap = await getDoc(reqRef);
    if (!snap.exists()) return;
    const req = snap.data() as Row;
    await updateDoc(reqRef, { status: accept ? 'accepted' : 'rejected' });
    if (accept && req.requester_id && req.target_id) {
      await setDoc(doc(db, 'follows', `${req.requester_id}_${req.target_id}`), {
        follower_id: req.requester_id,
        followed_id: req.target_id,
        created_at: serverTimestamp(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `follow_requests/${requestId}`);
  }
}

export async function adminStats(): Promise<Record<string, number> | null> {
  try {
    const [profilesSnap, classesSnap, postsSnap, reportsSnap] = await Promise.all([
      getDocs(query(collection(db, 'profiles'), where('visibility', 'in', ['public', 'private']))),
      getDocs(query(collection(db, 'classes'), where('class_type', 'in', ['class', 'study']))),
      getDocs(query(collection(db, 'posts'), where('visibility', 'in', ['public', 'followers']))),
      getDocs(query(collection(db, 'content_reports'), where('status', 'in', ['open', 'reviewing']))),
    ]);
    const profiles = profilesSnap.docs.map(d => d.data() as Row);
    return {
      users: profiles.length,
      students: profiles.filter(p => p.role === 'student').length,
      teachers: profiles.filter(p => p.role === 'teacher').length,
      classes: classesSnap.size,
      posts: postsSnap.size,
      open_reports: reportsSnap.size,
    };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Management actions                                                  */
/* ------------------------------------------------------------------ */

export async function deleteRow(table: 'lessons' | 'quizzes' | 'assignments' | 'classes' | 'live_sessions', id: string) {
  try {
    if (table === 'classes') {
      const snap = await getDoc(doc(db, 'classes', id));
      const code = snap.data()?.join_code;
      if (code) await deleteDoc(doc(db, 'class_codes', String(code))).catch(() => {});
    }
    if (table === 'quizzes') {
      await deleteDoc(doc(db, 'quiz_answer_keys', id)).catch(() => {});
    }
    await deleteDoc(doc(db, table, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${table}/${id}`);
  }
}

export async function leaveClass(uid: string, classId: string) {
  try {
    await deleteDoc(doc(db, 'class_members', `${classId}_${uid}`));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `class_members/${classId}_${uid}`);
  }
}

export async function removeMember(classId: string, userId: string) {
  try {
    await deleteDoc(doc(db, 'class_members', `${classId}_${userId}`));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `class_members/${classId}_${userId}`);
  }
}

export async function archiveClass(id: string, archived: boolean) {
  try {
    const snap = await getDoc(doc(db, 'classes', id));
    await updateDoc(doc(db, 'classes', id), { is_archived: archived });
    const code = snap.data()?.join_code;
    if (code) {
      await updateDoc(doc(db, 'class_codes', String(code)), { is_archived: archived }).catch(() => {});
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `classes/${id}`);
  }
}

export async function markDmRead(ids: string[]) {
  if (!ids.length) return;
  const now = new Date().toISOString();
  await Promise.all(
    ids.map(id => updateDoc(doc(db, 'direct_messages', id), { read_at: now }).catch(() => {})),
  );
}

export interface AdminUser { id: string; display_name: string; role: AppRole; is_suspended: boolean; created_at: string; }
export async function listUsers(q = ''): Promise<AdminUser[]> {
  try {
    const snap = await getDocs(
      query(collection(db, 'profiles'), where('visibility', 'in', ['public', 'private']), limit(100)),
    );
    const needle = q.trim().toLowerCase();
    return snap.docs
      .map(d => mapDoc(d))
      .filter(r => !needle || String(r.display_name || '').toLowerCase().includes(needle))
      .sort((a, b) => toIso(b.created_at).localeCompare(toIso(a.created_at)))
      .map(r => ({
        id: r.id,
        display_name: r.display_name || 'مستخدم',
        role: (r.role as AppRole) || 'student',
        is_suspended: !!r.is_suspended,
        created_at: toIso(r.created_at),
      }));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'profiles');
  }
}

export async function setUserRole(id: string, role: AppRole) {
  try {
    await updateDoc(doc(db, 'profiles', id), { role, updated_at: serverTimestamp() });
    const adminRef = doc(db, 'admins', id);
    if (role === 'admin') {
      await setDoc(adminRef, { uid: id, created_at: serverTimestamp() }, { merge: true });
    } else {
      await deleteDoc(adminRef).catch(() => {});
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `profiles/${id}`);
  }
}

export async function setSuspended(id: string, suspended: boolean) {
  try {
    await updateDoc(doc(db, 'profiles', id), { is_suspended: suspended, updated_at: serverTimestamp() });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `profiles/${id}`);
  }
}

export async function deleteOwnAccount() {
  const user = auth.currentUser;
  if (!user) throw new Error('يرجى تسجيل الدخول أولاً');
  const uid = user.uid;

  try {
    const ownedCollections = [
      ['posts', 'author_id'],
      ['comments', 'author_id'],
      ['stories', 'user_id'],
      ['post_likes', 'user_id'],
      ['notifications', 'user_id'],
      ['class_members', 'user_id'],
      ['follows', 'follower_id'],
      ['follows', 'followed_id'],
      ['question_bank', 'teacher_id'],
      ['guardian_reports', 'student_id'],
      ['live_attendance', 'user_id'],
      ['certificates', 'student_id'],
      ['polls', 'creator_id'],
      ['class_resources', 'uploader_id'],
    ] as const;

    for (const [colName, field] of ownedCollections) {
      const snap = await getDocs(query(collection(db, colName), where(field, '==', uid)));
      await Promise.all(snap.docs.map(d => deleteDoc(d.ref).catch(() => {})));
    }

    await Promise.all([
      deleteDoc(doc(db, 'profiles', uid)).catch(() => {}),
      deleteDoc(doc(db, 'users_private', uid)).catch(() => {}),
      deleteDoc(doc(db, 'admins', uid)).catch(() => {}),
      deleteDoc(doc(db, 'chat_presence', uid)).catch(() => {}),
    ]);

    await user.delete();
  } catch (err: any) {
    const code = String(err?.code || '');
    if (code === 'auth/requires-recent-login') {
      throw new Error('لتأكيد الحذف النهائي، يرجى تسجيل الخروج والدخول مجدداً ثم الضغط على حذف الحساب.');
    }
    throw new Error(err?.message || 'تعذّر حذف الحساب');
  }
}

/* ------------------------------------------------------------------ */
/* Cloud Question Bank                                                 */
/* ------------------------------------------------------------------ */

export interface CloudQuestionBankRecord {
  id: string;
  teacher_id: string;
  subject: string;
  q_type: QuizQuestionType;
  question: QuizQuestion;
  created_at: string;
}

export async function listCloudQuestionBank(teacherId: string): Promise<CloudQuestionBankRecord[]> {
  if (!teacherId) return [];
  try {
    const snap = await getDocs(
      query(collection(db, 'question_bank'), where('teacher_id', '==', teacherId), limit(250)),
    );
    return snap.docs
      .map(d => {
        const r = mapDoc(d);
        return {
          id: r.id,
          teacher_id: String(r.teacher_id || teacherId),
          subject: String(r.subject || 'عام'),
          q_type: (r.q_type as QuizQuestionType) || 'mcq',
          question: r.question as QuizQuestion,
          created_at: toIso(r.created_at),
        };
      })
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  } catch {
    return [];
  }
}

export async function saveQuestionsToCloudBank(
  teacherId: string,
  subject: string,
  questions: QuizQuestion[],
): Promise<CloudQuestionBankRecord[]> {
  if (!teacherId || !questions.length) return [];
  const cleanSubject = (subject || 'عام').trim().slice(0, 120) || 'عام';
  const created: CloudQuestionBankRecord[] = [];
  for (const q of questions) {
    const text = (q.question || '').trim().slice(0, 4000);
    if (!text) continue;
    const qType: QuizQuestionType = q.type || 'mcq';
    const docRef = doc(collection(db, 'question_bank'));
    const normalizedQ: QuizQuestion = {
      ...q,
      id: q.id || docRef.id,
      type: qType,
      question: text,
      topic: (q.topic || cleanSubject).slice(0, 120),
      options: Array.isArray(q.options) ? q.options.map(String) : [],
      correctOptionIndex: Number(q.correctOptionIndex ?? 0),
      explanation: (q.explanation || '').slice(0, 1500),
      points: Math.max(1, Math.round(Number(q.points) || 1)),
    };
    try {
      await setDoc(docRef, {
        teacher_id: teacherId,
        subject: (normalizedQ.topic || cleanSubject).slice(0, 120),
        q_type: qType,
        question: normalizedQ,
        created_at: serverTimestamp(),
      });
      created.push({
        id: docRef.id,
        teacher_id: teacherId,
        subject: normalizedQ.topic || cleanSubject,
        q_type: qType,
        question: normalizedQ,
        created_at: new Date().toISOString(),
      });
    } catch {
      /* keep going */
    }
  }
  return created;
}

export async function deleteCloudQuestionBankItem(itemId: string): Promise<void> {
  if (!itemId) return;
  try {
    await deleteDoc(doc(db, 'question_bank', itemId));
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Guardian / Parent Read-Only Portal                                  */
/* ------------------------------------------------------------------ */

function makeGuardianCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = 'GRD';
  for (let i = 0; i < 7; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function fetchMyGuardianReport(studentId: string): Promise<GuardianReport | null> {
  if (!studentId) return null;
  try {
    const snap = await getDocs(
      query(collection(db, 'guardian_reports'), where('student_id', '==', studentId), limit(1)),
    );
    if (snap.empty) return null;
    const r = mapDoc(snap.docs[0]);
    return {
      report_code: String(r.report_code || r.id),
      student_id: String(r.student_id || studentId),
      student_name: String(r.student_name || 'طالب'),
      avg_quiz_score: Number(r.avg_quiz_score ?? 0),
      completed_quizzes: Number(r.completed_quizzes ?? 0),
      submitted_assignments: Number(r.submitted_assignments ?? 0),
      points: Number(r.points ?? 0),
      streak_days: Number(r.streak_days ?? 0),
      classes_count: Number(r.classes_count ?? 0),
      recent_grades: Array.isArray(r.recent_grades) ? (r.recent_grades as GuardianGradeEntry[]) : [],
      updated_at: toIso(r.updated_at),
    };
  } catch {
    return null;
  }
}

export async function publishGuardianReport(
  me: Profile,
  summaryInput: {
    classesCount: number;
    quizzes: Quiz[];
    assignments: Assignment[];
    submissions: Submission[];
    existingCode?: string;
    rotateCode?: boolean;
  },
): Promise<GuardianReport> {
  const completedQuizzes = summaryInput.quizzes.filter(q => q.attempted);
  const mySubmissions = summaryInput.submissions.filter(s => s.student_id === me.id);

  const recentGrades: GuardianGradeEntry[] = [];
  let pctSum = 0;
  let pctCount = 0;

  completedQuizzes.forEach(q => {
    const maxScore = Math.max(1, q.questions.reduce((s, qq) => s + (qq.points || 1), 0));
    const score = Number(q.myScore ?? 0);
    pctSum += Math.min(100, Math.round((score / maxScore) * 100));
    pctCount += 1;
    recentGrades.push({
      title: String(q.title || 'اختبار').slice(0, 80),
      kind: 'اختبار',
      score,
      max_score: maxScore,
      status: q.needsManualGrading ? 'بانتظار مراجعة المعلم' : 'مكتمل',
    });
  });

  summaryInput.assignments.forEach(a => {
    const sub = mySubmissions.find(s => s.assignment_id === a.id);
    if (!sub) return;
    const maxScore = Math.max(1, Number(a.total_points) || 20);
    const hasGrade = sub.grade !== undefined && sub.grade !== null;
    if (hasGrade) {
      pctSum += Math.min(100, Math.round((Number(sub.grade) / maxScore) * 100));
      pctCount += 1;
    }
    recentGrades.push({
      title: String(a.title || 'واجب').slice(0, 80),
      kind: 'واجب',
      score: hasGrade ? Number(sub.grade) : 0,
      max_score: maxScore,
      status: hasGrade ? 'مرصود الدرجة' : 'تم التسليم',
    });
  });

  const avgScore = pctCount > 0 ? Math.round(pctSum / pctCount) : 0;
  const trimmedGrades = recentGrades.slice(0, 15);
  const oldCode = summaryInput.existingCode?.trim().toUpperCase();
  const code = !summaryInput.rotateCode && oldCode && oldCode.length >= 8 ? oldCode : makeGuardianCode();

  if (summaryInput.rotateCode && oldCode && oldCode !== code) {
    await deleteDoc(doc(db, 'guardian_reports', oldCode)).catch(() => {});
  }

  const payload = {
    report_code: code,
    student_id: me.id,
    student_name: me.display_name.slice(0, 80),
    avg_quiz_score: Math.max(0, Math.min(100, avgScore)),
    completed_quizzes: completedQuizzes.length,
    submitted_assignments: mySubmissions.length,
    points: Math.max(0, Math.round(Number(me.points) || 0)),
    streak_days: Math.max(0, Math.round(Number(me.streakDays) || 0)),
    classes_count: Math.max(0, Math.round(Number(summaryInput.classesCount) || 0)),
    recent_grades: trimmedGrades,
    updated_at: serverTimestamp(),
  };

  await setDoc(doc(db, 'guardian_reports', code), payload);

  return {
    ...payload,
    updated_at: new Date().toISOString(),
  };
}

export async function revokeGuardianReport(reportCode: string): Promise<void> {
  const clean = reportCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  if (!clean) return;
  await deleteDoc(doc(db, 'guardian_reports', clean));
}

export async function fetchGuardianReportByCode(code: string): Promise<GuardianReport | null> {
  const clean = (code || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  if (clean.length < 8 || clean.length > 16) return null;
  try {
    const snap = await getDoc(doc(db, 'guardian_reports', clean));
    if (!snap.exists()) return null;
    const r = snap.data() as Row;
    return {
      report_code: String(r.report_code || clean),
      student_id: String(r.student_id || ''),
      student_name: String(r.student_name || 'طالب NEMVIA'),
      avg_quiz_score: Number(r.avg_quiz_score ?? 0),
      completed_quizzes: Number(r.completed_quizzes ?? 0),
      submitted_assignments: Number(r.submitted_assignments ?? 0),
      points: Number(r.points ?? 0),
      streak_days: Number(r.streak_days ?? 0),
      classes_count: Number(r.classes_count ?? 0),
      recent_grades: Array.isArray(r.recent_grades) ? (r.recent_grades as GuardianGradeEntry[]) : [],
      updated_at: toIso(r.updated_at),
    };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Cloud Live Attendance                                               */
/* ------------------------------------------------------------------ */

export async function listLiveAttendance(sessionId: string): Promise<LiveAttendanceRecord[]> {
  if (!sessionId) return [];
  try {
    const snap = await getDocs(
      query(collection(db, 'live_attendance'), where('session_id', '==', sessionId)),
    );
    return snap.docs.map(d => {
      const r = d.data() as Row;
      return {
        session_id: String(r.session_id || sessionId),
        user_id: String(r.user_id || ''),
        user_name: String(r.user_name || 'طالب'),
        status: (['present', 'late', 'absent'].includes(r.status) ? r.status : 'present') as LiveAttendanceStatus,
        checked_at: r.checked_at ? String(r.checked_at) : undefined,
      };
    });
  } catch {
    return [];
  }
}

export async function upsertLiveAttendance(record: LiveAttendanceRecord): Promise<void> {
  if (!record.session_id || !record.user_id) return;
  const docId = `${record.session_id}_${record.user_id}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const payload: Record<string, any> = {
    session_id: record.session_id.slice(0, 128),
    user_id: record.user_id.slice(0, 128),
    user_name: (record.user_name || 'مستخدم').slice(0, 80),
    status: record.status,
    updated_at: serverTimestamp(),
  };
  if (record.checked_at) payload.checked_at = record.checked_at.slice(0, 64);
  try {
    await setDoc(doc(db, 'live_attendance', docId), payload);
  } catch {
    /* keep local cache fallback seamless */
  }
}

/* ------------------------------------------------------------------ */
/* WebRTC 1-on-1 Call Signaling                                        */
/* ------------------------------------------------------------------ */

function mapCallDoc(id: string, r: Row): CallSession {
  return {
    id,
    caller_id: String(r.caller_id || ''),
    caller_name: String(r.caller_name || 'مستخدم'),
    callee_id: String(r.callee_id || ''),
    callee_name: String(r.callee_name || 'مستخدم'),
    participants: Array.isArray(r.participants) ? r.participants.map(String) : [],
    call_type: r.call_type === 'video' ? 'video' : 'audio',
    status: (['ringing', 'accepted', 'rejected', 'ended', 'missed'].includes(r.status) ? r.status : 'ended') as CallStatus,
    offer: (r.offer && typeof r.offer === 'object' ? r.offer : { type: 'offer', sdp: '' }) as { type: string; sdp: string },
    answer: r.answer && typeof r.answer === 'object' ? (r.answer as { type: string; sdp: string }) : undefined,
    created_at: toIso(r.created_at),
    updated_at: toIso(r.updated_at),
  };
}

export async function createCallOffer(params: {
  callerId: string;
  callerName: string;
  calleeId: string;
  calleeName: string;
  callType: CallType;
  offer: { type: string; sdp: string };
}): Promise<string> {
  const callRef = doc(collection(db, 'calls'));
  try {
    await setDoc(callRef, {
      caller_id: params.callerId,
      caller_name: (params.callerName || 'مستخدم').slice(0, 80),
      callee_id: params.calleeId,
      callee_name: (params.calleeName || 'مستخدم').slice(0, 80),
      participants: [params.callerId, params.calleeId],
      call_type: params.callType,
      status: 'ringing',
      offer: { type: String(params.offer.type || 'offer'), sdp: String(params.offer.sdp || '') },
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    return callRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'calls');
  }
}

export async function acceptCallWithAnswer(
  callId: string,
  answer: { type: string; sdp: string },
): Promise<void> {
  try {
    await updateDoc(doc(db, 'calls', callId), {
      status: 'accepted',
      answer: { type: String(answer.type || 'answer'), sdp: String(answer.sdp || '') },
      updated_at: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `calls/${callId}`);
  }
}

export async function updateCallStatus(
  callId: string,
  status: Extract<CallStatus, 'rejected' | 'ended' | 'missed'>,
): Promise<void> {
  try {
    await updateDoc(doc(db, 'calls', callId), {
      status,
      updated_at: serverTimestamp(),
    });
  } catch {
    /* ignore if already ended */
  }
}

export async function addCallIceCandidate(
  callId: string,
  senderId: string,
  candidate: Record<string, any>,
): Promise<void> {
  try {
    await addDoc(collection(db, 'calls', callId, 'candidates'), {
      sender_id: senderId,
      candidate,
      created_at: serverTimestamp(),
    });
  } catch {
    /* ignore non-fatal ICE write */
  }
}

export function subscribeIncomingCalls(
  uid: string,
  onIncoming: (call: CallSession | null) => void,
): () => void {
  if (!uid) return () => {};
  return onSnapshot(
    query(collection(db, 'calls'), where('participants', 'array-contains', uid), limit(20)),
    snap => {
      const nowMs = Date.now();
      const activeRinging = snap.docs
        .map(d => mapCallDoc(d.id, d.data() as Row))
        .filter(c => c.callee_id === uid && c.status === 'ringing')
        .filter(c => nowMs - new Date(c.created_at).getTime() < 90 * 1000)
        .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
      onIncoming(activeRinging || null);
    },
    err => {
      if (String(err?.message || '').toLowerCase().includes('permission')) {
        handleFirestoreError(err, OperationType.LIST, 'calls');
      }
    },
  );
}

export function subscribeCallSession(
  callId: string,
  onUpdate: (call: CallSession | null) => void,
): () => void {
  if (!callId) return () => {};
  return onSnapshot(
    doc(db, 'calls', callId),
    snap => {
      if (!snap.exists()) {
        onUpdate(null);
        return;
      }
      onUpdate(mapCallDoc(snap.id, snap.data() as Row));
    },
    err => {
      if (String(err?.message || '').toLowerCase().includes('permission')) {
        handleFirestoreError(err, OperationType.GET, `calls/${callId}`);
      }
    },
  );
}

export function subscribeCallCandidates(
  callId: string,
  myUid: string,
  onRemoteCandidate: (cand: RTCIceCandidateInit) => void,
): () => void {
  if (!callId) return () => {};
  const seen = new Set<string>();
  return onSnapshot(
    collection(db, 'calls', callId, 'candidates'),
    snap => {
      snap.docChanges().forEach(change => {
        if (change.type !== 'added') return;
        if (seen.has(change.doc.id)) return;
        seen.add(change.doc.id);
        const r = change.doc.data() as Row;
        if (r.sender_id !== myUid && r.candidate) {
          onRemoteCandidate(r.candidate as RTCIceCandidateInit);
        }
      });
    },
    err => {
      if (String(err?.message || '').toLowerCase().includes('permission')) {
        handleFirestoreError(err, OperationType.LIST, `calls/${callId}/candidates`);
      }
    },
  );
}

/* ------------------------------------------------------------------ */
/* QR-Verified Academic Certificates                                   */
/* ------------------------------------------------------------------ */

function makeCertificateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = 'CERT';
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function issueVerifiedCertificate(params: {
  student: Profile;
  title?: string;
  issuerName?: string;
  existingCode?: string;
}): Promise<VerifiedCertificate> {
  const oldCode = (params.existingCode || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  const code = oldCode.length >= 8 && oldCode.length <= 16 ? oldCode : makeCertificateCode();
  const nowIso = new Date().toISOString();
  const payload = {
    cert_code: code,
    student_id: params.student.id,
    student_name: params.student.display_name.slice(0, 80),
    title: (params.title || 'شهادة التفوق والمثابرة الأكاديمية — منصة NEMVIA').trim().slice(0, 140),
    issuer_name: (params.issuerName || 'محمد جمال نعمه — إدارة منصة NEMVIA').trim().slice(0, 80),
    points: Math.max(0, Math.round(Number(params.student.points) || 0)),
    streak_days: Math.max(0, Math.round(Number(params.student.streakDays) || 0)),
    issued_at: nowIso,
    updated_at: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'certificates', code), payload);
    return {
      ...payload,
      updated_at: nowIso,
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `certificates/${code}`);
  }
}

export async function fetchVerifiedCertificate(code: string): Promise<VerifiedCertificate | null> {
  const clean = (code || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  if (clean.length < 8 || clean.length > 16) return null;
  try {
    const snap = await getDoc(doc(db, 'certificates', clean));
    if (!snap.exists()) return null;
    const r = snap.data() as Row;
    return {
      cert_code: String(r.cert_code || clean),
      student_id: String(r.student_id || ''),
      student_name: String(r.student_name || 'طالب NEMVIA'),
      title: String(r.title || 'شهادة إنجاز أكاديمية'),
      issuer_name: String(r.issuer_name || 'منصة NEMVIA التعليمية'),
      points: Number(r.points ?? 0),
      streak_days: Number(r.streak_days ?? 0),
      issued_at: String(r.issued_at || toIso(r.updated_at)),
      updated_at: toIso(r.updated_at),
    };
  } catch {
    return null;
  }
}

export async function revokeVerifiedCertificate(code: string): Promise<void> {
  const clean = (code || '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  if (!clean) return;
  await deleteDoc(doc(db, 'certificates', clean));
}

/* ------------------------------------------------------------------ */
/* Chat Online & Typing Presence                                       */
/* ------------------------------------------------------------------ */

export async function updateChatPresence(
  uid: string,
  state: { is_online: boolean; typing_to?: string },
): Promise<void> {
  if (!uid) return;
  try {
    await setDoc(doc(db, 'chat_presence', uid), {
      user_id: uid,
      is_online: Boolean(state.is_online),
      typing_to: (state.typing_to || '').slice(0, 128),
      updated_at: serverTimestamp(),
    });
  } catch {
    /* non-fatal presence update */
  }
}

export function subscribeChatPresence(
  onUpdate: (map: Record<string, ChatPresence>) => void,
): () => void {
  return onSnapshot(
    query(collection(db, 'chat_presence'), where('is_online', 'in', [true, false]), limit(250)),
    snap => {
      const next: Record<string, ChatPresence> = {};
      snap.docs.forEach(d => {
        const r = d.data() as Row;
        const uid = String(r.user_id || d.id);
        next[uid] = {
          user_id: uid,
          is_online: Boolean(r.is_online),
          typing_to: String(r.typing_to || ''),
          updated_at: toIso(r.updated_at),
        };
      });
      onUpdate(next);
    },
    err => {
      if (String(err?.message || '').toLowerCase().includes('permission')) {
        handleFirestoreError(err, OperationType.LIST, 'chat_presence');
      }
    },
  );
}

/* ------------------------------------------------------------------ */
/* Interactive Polls & Per-User Atomic Votes                           */
/* ------------------------------------------------------------------ */

export async function createPoll(params: {
  scopeType: PollScopeType;
  scopeId: string;
  creatorId: string;
  creatorName: string;
  question: string;
  options: string[];
}): Promise<string> {
  const cleanOptions = params.options.map(o => o.trim()).filter(Boolean).slice(0, 6);
  if (cleanOptions.length < 2) throw new Error('أدخل خيارين على الأقل للتصويت.');
  const pollRef = doc(collection(db, 'polls'));
  try {
    await setDoc(pollRef, {
      scope_type: params.scopeType,
      scope_id: params.scopeId.slice(0, 128),
      creator_id: params.creatorId,
      creator_name: (params.creatorName || 'مستخدم').slice(0, 80),
      question: params.question.trim().slice(0, 300),
      options: cleanOptions,
      created_at: serverTimestamp(),
    });
    return pollRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'polls');
  }
}

export async function castPollVote(pollId: string, userId: string, optionIndex: number): Promise<void> {
  if (!pollId || !userId) return;
  try {
    await setDoc(doc(db, 'polls', pollId, 'votes', userId), {
      user_id: userId,
      option_index: Math.max(0, Math.min(5, Math.round(optionIndex))),
      updated_at: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `polls/${pollId}/votes/${userId}`);
  }
}

export async function deletePoll(pollId: string): Promise<void> {
  if (!pollId) return;
  try {
    const votesSnap = await getDocs(collection(db, 'polls', pollId, 'votes'));
    await Promise.all(votesSnap.docs.map(d => deleteDoc(d.ref).catch(() => {})));
    await deleteDoc(doc(db, 'polls', pollId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `polls/${pollId}`);
  }
}

export function subscribePolls(
  scopeType: PollScopeType,
  scopeId: string,
  onUpdate: (polls: PollItem[]) => void,
): () => void {
  if (!scopeId) {
    onUpdate([]);
    return () => {};
  }

  let pollsList: PollItem[] = [];
  const votesByPoll = new Map<string, PollVoteItem[]>();
  const voteUnsubs = new Map<string, () => void>();

  const emit = () => {
    onUpdate(
      pollsList
        .map(p => ({ ...p, votes: votesByPoll.get(p.id) || [] }))
        .sort((a, b) => b.created_at.localeCompare(a.created_at)),
    );
  };

  const unsubPolls = onSnapshot(
    query(
      collection(db, 'polls'),
      where('scope_type', '==', scopeType),
      where('scope_id', '==', scopeId),
      limit(30),
    ),
    snap => {
      const nextIds = new Set<string>();
      pollsList = snap.docs.map(d => {
        const r = d.data() as Row;
        nextIds.add(d.id);
        return {
          id: d.id,
          scope_type: (r.scope_type === 'class' ? 'class' : 'community') as PollScopeType,
          scope_id: String(r.scope_id || scopeId),
          creator_id: String(r.creator_id || ''),
          creator_name: String(r.creator_name || 'عضو'),
          question: String(r.question || ''),
          options: Array.isArray(r.options) ? r.options.map(String) : [],
          created_at: toIso(r.created_at),
        };
      });

      // Clean removed poll listeners
      for (const [pid, unsub] of voteUnsubs.entries()) {
        if (!nextIds.has(pid)) {
          unsub();
          voteUnsubs.delete(pid);
          votesByPoll.delete(pid);
        }
      }

      // Attach per-poll vote listeners
      pollsList.forEach(p => {
        if (voteUnsubs.has(p.id)) return;
        const vUnsub = onSnapshot(
          query(collection(db, 'polls', p.id, 'votes'), where('user_id', '!=', ''), limit(250)),
          vSnap => {
            votesByPoll.set(
              p.id,
              vSnap.docs.map(vd => {
                const vr = vd.data() as Row;
                return {
                  user_id: String(vr.user_id || vd.id),
                  option_index: Number(vr.option_index ?? 0),
                  updated_at: toIso(vr.updated_at),
                };
              }),
            );
            emit();
          },
          () => {},
        );
        voteUnsubs.set(p.id, vUnsub);
      });

      emit();
    },
    err => {
      if (String(err?.message || '').toLowerCase().includes('permission')) {
        handleFirestoreError(err, OperationType.LIST, 'polls');
      }
    },
  );

  return () => {
    unsubPolls();
    voteUnsubs.forEach(u => u());
    voteUnsubs.clear();
  };
}

/* ------------------------------------------------------------------ */
/* Class Library Resources (Books, Summaries, Worksheets, Links)       */
/* ------------------------------------------------------------------ */

function mapClassResourceDoc(id: string, r: Row): ClassResource {
  const kindRaw = String(r.kind || 'summary');
  const kind: ClassResourceKind = (['book', 'summary', 'worksheet', 'link', 'video'].includes(kindRaw)
    ? kindRaw
    : 'summary') as ClassResourceKind;
  return {
    id,
    class_id: String(r.class_id || ''),
    uploader_id: String(r.uploader_id || ''),
    uploader_name: String(r.uploader_name || 'معلم'),
    title: String(r.title || ''),
    unit_name: String(r.unit_name || 'موارد عامة'),
    kind,
    description: r.description ? String(r.description) : undefined,
    file_url: r.file_url ? String(r.file_url) : undefined,
    file_name: r.file_name ? String(r.file_name) : undefined,
    file_size: r.file_size ? String(r.file_size) : undefined,
    external_url: r.external_url ? String(r.external_url) : undefined,
    created_at: toIso(r.created_at),
  };
}

export function subscribeClassResources(
  classId: string,
  onUpdate: (items: ClassResource[]) => void,
): () => void {
  if (!classId) {
    onUpdate([]);
    return () => {};
  }
  return onSnapshot(
    query(collection(db, 'class_resources'), where('class_id', '==', classId), limit(250)),
    snap => {
      const items = snap.docs
        .map(d => mapClassResourceDoc(d.id, d.data() as Row))
        .sort((a, b) => b.created_at.localeCompare(a.created_at));
      onUpdate(items);
    },
    err => {
      if (String(err?.message || '').toLowerCase().includes('permission')) {
        handleFirestoreError(err, OperationType.LIST, 'class_resources');
      }
    },
  );
}

export async function createClassResource(params: {
  classId: string;
  uploaderId: string;
  uploaderName: string;
  title: string;
  unitName: string;
  kind: ClassResourceKind;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  externalUrl?: string;
}): Promise<string> {
  const title = params.title.trim().slice(0, 200);
  const unitName = (params.unitName.trim() || 'موارد عامة').slice(0, 100);
  if (!title) throw new Error('يرجى إدخال عنوان الملف أو الملزمة.');
  if (!params.classId) throw new Error('معرّف الصف غير صالح.');

  const payload: Record<string, any> = {
    class_id: params.classId.slice(0, 128),
    uploader_id: params.uploaderId.slice(0, 128),
    uploader_name: (params.uploaderName.trim() || 'عضو الصف').slice(0, 80),
    title,
    unit_name: unitName,
    kind: params.kind,
    created_at: serverTimestamp(),
  };
  if (params.description?.trim()) payload.description = params.description.trim().slice(0, 2000);
  if (params.fileUrl?.trim()) payload.file_url = params.fileUrl.trim().slice(0, 2000);
  if (params.fileName?.trim()) payload.file_name = params.fileName.trim().slice(0, 255);
  if (params.fileSize?.trim()) payload.file_size = params.fileSize.trim().slice(0, 40);
  if (params.externalUrl?.trim()) payload.external_url = params.externalUrl.trim().slice(0, 2000);

  const resRef = doc(collection(db, 'class_resources'));
  try {
    await setDoc(resRef, payload);
    return resRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'class_resources');
  }
}

export async function updateClassResource(
  resourceId: string,
  updates: {
    title: string;
    unitName: string;
    kind: ClassResourceKind;
    description?: string;
    externalUrl?: string;
  },
): Promise<void> {
  if (!resourceId) return;
  const payload: Record<string, any> = {
    title: updates.title.trim().slice(0, 200),
    unit_name: (updates.unitName.trim() || 'موارد عامة').slice(0, 100),
    kind: updates.kind,
    description: (updates.description || '').trim().slice(0, 2000),
    external_url: (updates.externalUrl || '').trim().slice(0, 2000),
  };
  try {
    await updateDoc(doc(db, 'class_resources', resourceId), payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `class_resources/${resourceId}`);
  }
}

export async function deleteClassResource(resourceId: string): Promise<void> {
  if (!resourceId) return;
  try {
    await deleteDoc(doc(db, 'class_resources', resourceId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `class_resources/${resourceId}`);
  }
}
