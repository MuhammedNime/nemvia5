import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { onAuthStateChanged, sendEmailVerification, signOut, type User } from 'firebase/auth';
import { Home, BookOpen, Users, MessageSquare, Loader2, CheckCircle2, AlertCircle, X, ShieldAlert, MailCheck } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppHeader } from './components/navigation/AppHeader';
import { AppSidebar } from './components/navigation/AppSidebar';
import { HubDrawerModal } from './components/navigation/HubDrawerModal';
import { HomeView } from './components/views/HomeView';
import { LegalContent } from './components/views/LegalView';

const ClassesView = lazy(() => import('./components/views/ClassesView').then(m => ({ default: m.ClassesView })));
const CoursesView = lazy(() => import('./components/views/CoursesView').then(m => ({ default: m.CoursesView })));
const AssignmentsView = lazy(() => import('./components/views/AssignmentsView').then(m => ({ default: m.AssignmentsView })));
const CommunityView = lazy(() => import('./components/views/CommunityView').then(m => ({ default: m.CommunityView })));
const LiveClassroomView = lazy(() => import('./components/views/LiveClassroomView').then(m => ({ default: m.LiveClassroomView })));
const MessagesView = lazy(() => import('./components/views/MessagesView').then(m => ({ default: m.MessagesView })));
const StudyToolsView = lazy(() => import('./components/views/StudyToolsView').then(m => ({ default: m.StudyToolsView })));
const AIStudioView = lazy(() => import('./components/views/AIStudioView').then(m => ({ default: m.AIStudioView })));
const AdminView = lazy(() => import('./components/views/AdminView').then(m => ({ default: m.AdminView })));
const ProfileView = lazy(() => import('./components/views/ProfileView').then(m => ({ default: m.ProfileView })));
const LegalView = lazy(() => import('./components/views/LegalView').then(m => ({ default: m.LegalView })));
const SettingsView = lazy(() => import('./components/views/SettingsView').then(m => ({ default: m.SettingsView })));
const CalendarView = lazy(() => import('./components/views/CalendarView').then(m => ({ default: m.CalendarView })));
const GradebookView = lazy(() => import('./components/views/GradebookView').then(m => ({ default: m.GradebookView })));
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { ReportModal, ReportTarget } from './components/ReportModal';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { AppInstallPromptBanner } from './components/pwa/AppInstallPromptBanner';
import { PullToRefresh } from './components/PullToRefresh';
import { auth } from './lib/firebase';
import * as api from './lib/api';
import { AppData } from './lib/api';
import { UI_COPY, useAppSettings } from './lib/settings';
import { initNativeAndroidShell, isNativeApp } from './lib/native';
import {
  bindAudioUnlock,
  ChimeKind,
  initNativeNotifications,
  playNotificationChime,
  showBrowserNotification,
} from './lib/notifications';
import {
  Profile, ClassItem, SchoolItem, Lesson, Submission, Quiz, QuizQuestion, QuizAnswerValue, QuestionFeedbackItem, Post, Story, DirectMessage,
} from './types';

const EMPTY: AppData = {
  classes: [], schools: [], ministries: [], myOrgIds: [], orgMembers: [],
  courses: [], lessons: [], quizzes: [], assignments: [], submissions: [], posts: [],
  stories: [], liveSessions: [], messages: [], notifications: [], reports: [], contacts: [], classMembers: [],
  followingIds: [], followerIds: [], followRequests: [],
};

export default function App() {
  const { settings } = useAppSettings();
  const ui = UI_COPY[settings.lang];
  const appDir = settings.lang === 'ar' ? 'rtl' : 'ltr';
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [data, setData] = useState<AppData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSectionRaw] = useState('home');
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null);
  const [hubOpen, setHubOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatPeerId, setChatPeerId] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [liveAlert, setLiveAlert] = useState<{ title: string; body: string; targetSection?: string } | null>(null);
  const [confirmState, setConfirmState] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const profileRef = useRef<Profile | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const hydratedRef = useRef(false);
  const alertTimerRef = useRef<number | undefined>(undefined);
  const backExitTimeRef = useRef<number>(0);
  const uiStateRef = useRef({ activeSection: 'home', hubOpen: false, searchOpen: false, hasReport: false, hasConfirm: false });
  profileRef.current = profile;
  uiStateRef.current = {
    activeSection,
    hubOpen,
    searchOpen,
    hasReport: Boolean(reportTarget),
    hasConfirm: Boolean(confirmState),
  };

  const notify = useCallback((msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const sectionHistoryRef = useRef<string[]>([]);
  const setActiveSection = useCallback((next: string) => {
    setActiveSectionRaw(prev => {
      if (prev === next) return prev;
      sectionHistoryRef.current = [...sectionHistoryRef.current.slice(-15), prev];
      if (!isNativeApp() && prev === 'home' && next !== 'home' && typeof window !== 'undefined') {
        try {
          window.history.pushState({ nemviaHomeGuard: true }, '');
        } catch {
          /* ignore */
        }
      }
      return next;
    });
  }, []);

  const refreshRef = useRef<() => Promise<void>>(async () => {});

  useEffect(() => {
    bindAudioUnlock();
    void initNativeNotifications();

    const onOpenSection = (ev: Event) => {
      const target = (ev as CustomEvent<{ targetSection?: string }>).detail?.targetSection;
      if (target) setActiveSection(target);
    };
    const onPopState = () => {
      if (isNativeApp()) return;
      const cur = uiStateRef.current;
      if (cur.hasConfirm) { setConfirmState(null); return; }
      if (cur.hasReport) { setReportTarget(null); return; }
      if (cur.searchOpen) { setSearchOpen(false); return; }
      if (cur.hubOpen) { setHubOpen(false); return; }
      if (cur.activeSection !== 'home') {
        setActiveSectionRaw('home');
        sectionHistoryRef.current = [];
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(v => !v);
      }
    };
    const onVisibility = () => {
      if (!document.hidden) void refreshRef.current();
    };
    window.addEventListener('nemvia:open-section', onOpenSection);
    window.addEventListener('popstate', onPopState);
    window.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVisibility);
    const cleanupNative = initNativeAndroidShell({
      initialTheme: settings.theme,
      onResume: () => { void refreshRef.current(); },
      onBackButton: () => {
        const cur = uiStateRef.current;
        if (cur.hasConfirm) { setConfirmState(null); return true; }
        if (cur.hasReport) { setReportTarget(null); return true; }
        if (cur.searchOpen) { setSearchOpen(false); return true; }
        if (cur.hubOpen) { setHubOpen(false); return true; }
        if (cur.activeSection !== 'home') {
          sectionHistoryRef.current = [];
          setActiveSectionRaw('home');
          return true;
        }
        const now = Date.now();
        if (now - backExitTimeRef.current < 2000) return false;
        backExitTimeRef.current = now;
        notify('اضغط زر الرجوع مرة أخرى للخروج من التطبيق', true);
        return true;
      },
    });
    return () => {
      window.removeEventListener('nemvia:open-section', onOpenSection);
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVisibility);
      cleanupNative();
    };
  }, [notify, setActiveSection]);

  const seedSeenIds = useCallback((d: AppData) => {
    const s = seenIdsRef.current;
    d.messages.forEach(m => s.add(`msg:${m.id}`));
    d.notifications.forEach(n => s.add(`notif:${n.id}`));
    d.liveSessions.forEach(ls => { if (ls.status === 'live') s.add(`live:${ls.id}`); });
    d.assignments.forEach(a => s.add(`asg:${a.id}`));
    d.quizzes.forEach(q => s.add(`quiz:${q.id}`));
  }, []);

  const triggerIncomingAlert = useCallback((opts: {
    id: string;
    title: string;
    body: string;
    chime: ChimeKind;
    targetSection?: string;
  }) => {
    if (seenIdsRef.current.has(opts.id)) return;
    seenIdsRef.current.add(opts.id);
    playNotificationChime(opts.chime);
    showBrowserNotification(opts.title, opts.body, opts.id, opts.targetSection);
    setLiveAlert({ title: opts.title, body: opts.body, targetSection: opts.targetSection });
    window.clearTimeout(alertTimerRef.current);
    alertTimerRef.current = window.setTimeout(() => setLiveAlert(null), 6000);
  }, []);

  /* ---------------- Auth session ---------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setFirebaseUser(user);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const refresh = useCallback(async () => {
    const me = profileRef.current;
    if (!me) return;
    const fresh = await api.loadAll(me);
    if (hydratedRef.current) {
      for (const m of fresh.messages) {
        const key = `msg:${m.id}`;
        if (!seenIdsRef.current.has(key)) {
          if (m.sender_id !== me.id) {
            triggerIncomingAlert({
              id: key,
              title: m.channel_id ? `رسالة جديدة في ${m.recipient_name || 'الصف'}` : `رسالة جديدة من ${m.sender_name}`,
              body: m.body || (m.attachment ? `مرفق: ${m.attachment.name}` : 'رسالة جديدة'),
              chime: 'message',
              targetSection: 'messages',
            });
          } else {
            seenIdsRef.current.add(key);
          }
        }
      }
      for (const n of fresh.notifications) {
        const key = `notif:${n.id}`;
        if (!seenIdsRef.current.has(key)) {
          if (!n.read) {
            const target = n.kind === 'grade' ? 'courses' : n.kind === 'live' ? 'live' : n.kind === 'social' ? 'community' : 'assignments';
            triggerIncomingAlert({
              id: key,
              title: n.title,
              body: n.body,
              chime: n.kind === 'grade' ? 'grade' : 'alert',
              targetSection: target,
            });
          } else {
            seenIdsRef.current.add(key);
          }
        }
      }
      for (const ls of fresh.liveSessions) {
        const key = `live:${ls.id}`;
        if (ls.status === 'live' && !seenIdsRef.current.has(key)) {
          if (ls.host_id !== me.id) {
            triggerIncomingAlert({
              id: key,
              title: 'حصة مباشرة بدأت الآن',
              body: `${ls.title} — ${ls.host_name}`,
              chime: 'alert',
              targetSection: 'live',
            });
          } else {
            seenIdsRef.current.add(key);
          }
        }
      }
      for (const a of fresh.assignments) {
        const key = `asg:${a.id}`;
        if (!seenIdsRef.current.has(key)) {
          if (a.teacher_id !== me.id) {
            triggerIncomingAlert({
              id: key,
              title: 'واجب جديد',
              body: `${a.title} (${a.class_title})`,
              chime: 'alert',
              targetSection: 'assignments',
            });
          } else {
            seenIdsRef.current.add(key);
          }
        }
      }
      for (const q of fresh.quizzes) {
        const key = `quiz:${q.id}`;
        if (!seenIdsRef.current.has(key)) {
          const ownerId = fresh.classes.find(c => c.id === q.class_id)?.teacher_id;
          if (ownerId && ownerId !== me.id) {
            triggerIncomingAlert({
              id: key,
              title: 'اختبار جديد متاح',
              body: `${q.title} (${q.class_title})`,
              chime: 'alert',
              targetSection: 'courses',
            });
          } else {
            seenIdsRef.current.add(key);
          }
        }
      }
    } else {
      seedSeenIds(fresh);
      hydratedRef.current = true;
    }
    setData(fresh);
  }, [seedSeenIds, triggerIncomingAlert]);

  const refreshProfile = useCallback(async () => {
    const uid = firebaseUser?.uid;
    if (!uid) return;
    const p = await api.fetchOwnProfile(uid);
    if (p) setProfile(p);
  }, [firebaseUser?.uid]);

  refreshRef.current = async () => {
    await Promise.all([refresh(), refreshProfile()]);
  };

  const loadUserSession = useCallback(async (uid: string, isCancelled?: () => boolean) => {
    setLoading(true);
    setProfileError(null);
    try {
      const p = await api.fetchOwnProfile(uid);
      if (isCancelled?.()) return;
      if (!p) {
        setProfileError('تعذّر العثور على ملفك الشخصي أو إنشاؤه.');
        return;
      }
      await api.touchStreak();
      profileRef.current = p;
      setProfile(p);
      const loaded = await api.loadAll(p);
      if (isCancelled?.()) return;
      seedSeenIds(loaded);
      hydratedRef.current = true;
      setData(loaded);
    } catch (err: any) {
      console.error('[NEMVIA] Load error:', err);
      if (isCancelled?.()) return;
      let detail = String(err?.message || 'تعذّر تحميل بيانات حسابك.');
      if (detail.startsWith('{')) {
        try {
          const parsed = JSON.parse(detail);
          detail = `${parsed.path ? `[${parsed.path}] ` : ''}${parsed.error || detail}`;
        } catch {
          /* keep raw */
        }
      }
      setProfileError(detail);
    } finally {
      if (!isCancelled?.()) setLoading(false);
    }
  }, [seedSeenIds]);

  const [verifyBusy, setVerifyBusy] = useState(false);
  const [verifyNotice, setVerifyNotice] = useState<string | null>(null);
  const [verifyTick, setVerifyTick] = useState(0);

  // عند تغيّر المستخدم: حمّل الملف الشخصي ثم كل البيانات
  useEffect(() => {
    const uid = firebaseUser?.uid;
    seenIdsRef.current.clear();
    hydratedRef.current = false;
    if (!uid || !firebaseUser?.emailVerified) {
      setProfile(null);
      setData(EMPTY);
      setProfileError(null);
      return;
    }
    let cancelled = false;
    void loadUserSession(uid, () => cancelled);
    return () => { cancelled = true; };
  }, [firebaseUser?.uid, firebaseUser?.emailVerified, verifyTick, loadUserSession]);

  // تحديث لحظي للرسائل والإشعارات والحصص مع تنبيه صوتي تلقائي + فحص دوري احتياطي
  useEffect(() => {
    if (!authReady || !profile) return;
    let timer: number | undefined;
    const bump = () => { window.clearTimeout(timer); timer = window.setTimeout(() => { void refresh(); }, 180); };
    const unsubRealtime = api.subscribeRealtimeUpdates(profile.id, bump);
    const poll = window.setInterval(() => {
      if (!document.hidden) void refresh();
    }, 15000);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(poll);
      unsubRealtime();
    };
  }, [authReady, profile?.id, refresh]);

  useEffect(() => {
    if (profile?.role === 'admin') api.adminStats().then(setStats);
  }, [profile?.id, profile?.role, data.reports.length]);

  /* ---------------- Action helper ---------------- */
  const run = useCallback(async (fn: () => Promise<unknown>, okMsg?: string): Promise<boolean> => {
    try {
      await fn();
      await refresh();
      if (okMsg) notify(okMsg);
      return true;
    } catch (e: any) {
      notify(e?.message || 'تعذّر تنفيذ العملية', false);
      return false;
    }
  }, [refresh, notify]);

  const uid = profile?.id || '';

  const upload = async (file: File, folder: string) => {
    try { return await api.uploadFile(uid, file, folder); }
    catch (e: any) { notify(e.message || 'فشل رفع الملف', false); throw e; }
  };

  /* ---------------- Handlers passed to views ---------------- */
  const handleAddClass = (c: ClassItem) => { void run(() => api.createClass(uid, c), 'تم إنشاء المساحة بنجاح'); };
  const handleJoinClass = async (code: string) => {
    const ok = await api.joinClass(code);
    if (ok) await refresh();
    return ok;
  };
  const handleCreateMinistry = (m: { name: string; region: string; description: string; colorTheme?: string }) =>
    run(() => api.createMinistry(uid, m), 'تم إنشاء الوزارة / المجمع التعليمي');
  const handleCreateSchool = (s: { name: string; stage: string; region: string; description: string; ministry_id?: string; colorTheme?: string }) =>
    run(() => api.createSchool(uid, s), 'تم إنشاء المدرسة / المعهد بنجاح');
  const handleLinkSchoolMinistry = (school: SchoolItem, ministryId: string) =>
    run(() => api.linkSchoolToMinistry(school, ministryId), ministryId ? 'تم ربط المدرسة بالوزارة/المجمع' : 'تم فك ارتباط المدرسة');
  const handleLinkClassSchool = (cls: ClassItem, schoolId: string) =>
    run(() => api.linkClassToSchool(cls, schoolId), schoolId ? 'تم ربط الصف بالمدرسة' : 'تم فك ارتباط الصف');
  const handleSendDirective = (orgId: string, orgName: string, body: string) =>
    run(() => api.sendMessage(uid, {
      id: 'new',
      sender_id: uid,
      sender_name: profile?.display_name || '',
      recipient_id: orgId,
      recipient_name: orgName,
      channel_id: orgId,
      body,
      created_at: new Date().toISOString(),
    }), 'تم نشر التعميم بنجاح');
  const handleRemoveOrgMember = (orgId: string, userId: string) =>
    run(() => api.removeMember(orgId, userId), 'تمت إزالة العضو');
  const handleLeaveOrg = (orgId: string) =>
    run(() => api.leaveClass(uid, orgId), 'تمت المغادرة');
  const handleDeleteOrg = (orgId: string) =>
    run(() => api.deleteRow('classes', orgId), 'تم الحذف بنجاح');
  const handleAddLesson = (l: Lesson) => { void run(() => api.createLesson(uid, l), 'تم نشر الدرس'); };
  const handleAddQuiz = (q: Quiz) => { void run(() => api.createQuiz(uid, q), 'تم نشر الاختبار'); };
  const handleSubmitQuiz = async (quizId: string, answers: Record<string, QuizAnswerValue>, questions: QuizQuestion[]) => {
    try {
      const res = await api.submitQuiz(quizId, answers, questions);
      void refresh();
      return res;
    } catch (e: any) {
      notify(e.message || 'تعذّر إرسال الاختبار', false);
      throw e;
    }
  };
  const handleGradeQuizAttempt = (
    attemptId: string,
    score: number,
    feedback: string,
    questionFeedback?: Record<string, QuestionFeedbackItem>,
  ) =>
    run(() => api.gradeQuizAttempt(attemptId, score, feedback, questionFeedback), 'تم حفظ الدرجة والتغذية الراجعة وإشعار الطالب');
  const handleRewardPoints = async (points: number) => {
    const total = await api.awardPoints(points);
    if (total !== null) setProfile(p => (p ? { ...p, points: total } : p));
  };
  const handleCreateAssignment = (a: Parameters<typeof api.createAssignment>[1]) =>
    run(() => api.createAssignment(uid, a), 'تم نشر الواجب');
  const handleSubmitAssignment = (s: Submission) => { void run(() => api.submitAssignment(uid, s), 'تم تسليم الواجب'); };
  const handleGradeSubmission = (id: string, grade: number, feedback: string) => {
    void run(() => api.gradeSubmission(id, grade, feedback), 'تم رصد الدرجة');
  };
  const handleAddPost = (p: Post) => { void run(() => api.createPost(uid, p), 'تم نشر المنشور'); };
  const handleUpdatePost = (
    postId: string,
    patch: { body?: string; category?: 'all' | 'questions' | 'notes' | 'announcements'; visibility?: 'public' | 'followers' | 'private' },
  ) => run(() => api.updatePost(postId, patch), 'تم تحديث المنشور');
  const handleAddStory = (s: Story) => { void run(() => api.createStory(uid, s), 'تم نشر القصة'); };
  const handleDeleteStory = (storyId: string) => run(() => api.deleteStory(storyId), 'تم حذف القصة');
  const handleToggleLike = (postId: string) => {
    const post = data.posts.find(p => p.id === postId);
    if (!post) return;
    // تحديث فوري للواجهة ثم مزامنة
    setData(d => ({
      ...d,
      posts: d.posts.map(p => p.id === postId
        ? { ...p, is_liked: !p.is_liked, likes_count: p.likes_count + (p.is_liked ? -1 : 1) } : p),
    }));
    api.setLike(uid, postId, !post.is_liked).catch(e => { notify(e.message, false); void refresh(); });
  };
  const handleAddComment = (postId: string, c: { body: string }) => { void run(() => api.addComment(uid, postId, c.body)); };
  const handleDeleteComment = (commentId: string) => run(() => api.deleteComment(commentId), 'تم حذف التعليق');
  const handleDeletePost = (id: string) => { void run(() => api.deletePost(id), 'تم حذف المنشور'); };
  const handleFollowUser = (targetId: string, visibility: 'public' | 'private') =>
    run(() => api.followUser(uid, targetId, visibility), visibility === 'private' ? 'تم إرسال طلب المتابعة' : 'تمت المتابعة');
  const handleUnfollowUser = (targetId: string) => run(() => api.unfollowUser(uid, targetId), 'تم إلغاء المتابعة');
  const handleCancelFollowRequest = (targetId: string) => run(() => api.cancelFollowRequest(uid, targetId), 'تم إلغاء طلب المتابعة');
  const handleRespondFollowRequest = (requestId: string, accept: boolean) =>
    run(() => api.respondFollowRequest(requestId, accept), accept ? 'تم قبول طلب المتابعة' : 'تم رفض الطلب');
  const handleStartChat = (userId: string) => {
    setChatPeerId(userId);
    setActiveSection('messages');
  };
  const handlePullRefresh = useCallback(async () => {
    await Promise.all([refresh(), refreshProfile()]);
  }, [refresh, refreshProfile]);
  const handleScheduleLive = (l: Parameters<typeof api.createLive>[1]) =>
    run(() => api.createLive(uid, l), 'تمت جدولة الحصة');
  const handleLiveStatus = (id: string, status: 'live' | 'ended' | 'cancelled') =>
    run(() => api.setLiveStatus(id, status));
  const handleSendMessage = (m: DirectMessage) => { void run(() => api.sendMessage(uid, m)); };
  const handleMarkNotificationRead = (id: string) => {
    setData(d => ({ ...d, notifications: d.notifications.map(n => (n.id === id ? { ...n, read: true } : n)) }));
    void api.markNotificationRead(id);
  };
  const handleMarkAllNotificationsRead = () => {
    setData(d => ({ ...d, notifications: d.notifications.map(n => ({ ...n, read: true })) }));
    void api.markAllNotificationsRead(uid);
  };
  const handleResolveReport = (id: string) => { void run(() => api.setReportStatus(id, 'resolved'), 'تمت معالجة البلاغ'); };
  const handleDismissReport = (id: string) => { void run(() => api.setReportStatus(id, 'dismissed'), 'تم تجاهل البلاغ'); };
  const handleCreateReport = async (r: { reason: string; details: string }) => {
    if (!reportTarget) return;
    const ok = await run(() => api.createReport(uid, {
      target_type: reportTarget.type === 'user' ? 'profile' : reportTarget.type,
      target_id: reportTarget.id, reason: r.reason, details: r.details, snapshot: reportTarget.snapshot,
    }), 'شكراً لك، تم إرسال البلاغ للإدارة');
    if (ok) setReportTarget(null);
  };
  const handleSaveProfile = (patch: { display_name: string; bio: string; visibility: 'public' | 'private'; avatar_url?: string }) =>
    run(async () => { await api.updateProfile(uid, patch); await refreshProfile(); }, 'تم حفظ ملفك الشخصي');
  const askConfirm = useCallback((message: string, onConfirm: () => void) => {
    setConfirmState({ message, onConfirm });
  }, []);
  const handleDelete = (table: 'lessons' | 'quizzes' | 'assignments' | 'classes' | 'live_sessions', label: string) =>
    (id: string) => {
      askConfirm(`حذف ${label} نهائياً؟`, () => { void run(() => api.deleteRow(table, id), `تم حذف ${label}`); });
    };
  const handleLeaveClass = (classId: string) => {
    askConfirm('هل تريد مغادرة هذا الصف؟', () => { void run(() => api.leaveClass(uid, classId), 'تمت مغادرة الصف'); });
  };
  const handleRemoveMember = (classId: string, userId: string) => {
    askConfirm('إزالة هذا العضو من الصف؟', () => { void run(() => api.removeMember(classId, userId), 'تمت إزالة العضو'); });
  };
  const handleArchiveClass = (classId: string, archived: boolean) => { void run(() => api.archiveClass(classId, archived), archived ? 'تمت أرشفة الصف' : 'تم إلغاء الأرشفة'); };
  const handleMarkDmRead = (ids: string[]) => {
    if (!ids.length) return;
    setData(d => ({ ...d, messages: d.messages.map(m => (ids.includes(m.id) ? { ...m, read_at: new Date().toISOString() } : m)) }));
    void api.markDmRead(ids);
  };
  const handleSetRole = (id: string, role: 'student' | 'teacher' | 'admin') => run(() => api.setUserRole(id, role), 'تم تغيير الدور');
  const handleSetSuspended = (id: string, v: boolean) => run(() => api.setSuspended(id, v), v ? 'تم إيقاف الحساب' : 'تم إلغاء الإيقاف');
  const handleSignOut = async () => {
    await signOut(auth);
    setActiveSection('home');
  };
  const handleDeleteAccount = async () => {
    await api.deleteOwnAccount();
    await signOut(auth).catch(() => {});
    setActiveSection('home');
    notify('تم حذف حسابك وجميع بياناتك نهائياً');
  };

  /* ---------------- Public Legal Route (Play Store Requirement) ---------------- */
  if (typeof window !== 'undefined' && (window.location.pathname === '/privacy' || window.location.pathname === '/terms')) {
    const publicTab = window.location.pathname === '/terms' ? 'terms' : 'privacy';
    return (
      <div className="min-h-[100dvh] bg-slate-50 p-4 sm:p-8 font-['Cairo',sans-serif]" dir="rtl">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h1 className="text-xl font-black text-slate-900">NEMVIA — {publicTab === 'privacy' ? 'سياسة الخصوصية' : 'شروط الاستخدام'}</h1>
              <p className="text-xs text-slate-500">منصة نيمفيا التعليمية والمجتمع الأكاديمي</p>
            </div>
            <a href="/" className="px-4 py-2 rounded-xl bg-[#1677c7] text-white text-xs font-bold">العودة للمنصة</a>
          </div>
          <LegalContent tab={publicTab} />
        </div>
      </div>
    );
  }

  /* ---------------- Gates ---------------- */
  if (!authReady) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-[#1677c7]" /></div>;
  }
  if (!firebaseUser) return <AuthScreen />;
  if (!firebaseUser.emailVerified) {
    const checkVerified = async () => {
      setVerifyBusy(true);
      setVerifyNotice(null);
      try {
        await firebaseUser.reload();
        await firebaseUser.getIdToken(true);
        if (auth.currentUser?.emailVerified) {
          setFirebaseUser(auth.currentUser);
          setVerifyTick(v => v + 1);
        } else {
          setVerifyNotice('لم يتم تأكيد البريد الإلكتروني بعد. افتح رسالة التفعيل في بريدك واضغط على الرابط ثم أعد المحاولة.');
        }
      } catch (err: any) {
        setVerifyNotice(err?.message || 'تعذّر التحقق من حالة التفعيل الآن.');
      } finally {
        setVerifyBusy(false);
      }
    };
    const resendVerification = async () => {
      setVerifyBusy(true);
      setVerifyNotice(null);
      try {
        await sendEmailVerification(firebaseUser);
        setVerifyNotice('تم إرسال رابط التفعيل مجدداً. راجع صندوق الوارد أو الرسائل غير المرغوب فيها (Spam).');
      } catch (err: any) {
        setVerifyNotice(err?.message || 'تعذّر إعادة إرسال الرابط، انتظر لحظات وحاول مجدداً.');
      } finally {
        setVerifyBusy(false);
      }
    };
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-slate-50 font-['Cairo',sans-serif]" dir="rtl">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-50 text-[#1677c7] border border-sky-200 flex items-center justify-center">
            <MailCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-black text-slate-900">تأكيد البريد الإلكتروني</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              لحماية حسابك وبياناتك، أرسلنا رابط تفعيل إلى{' '}
              <span className="font-mono font-bold text-slate-900" dir="ltr">{firebaseUser.email}</span>.
              افتح الرابط ثم اضغط «تم التفعيل — متابعة».
            </p>
          </div>
          {verifyNotice && (
            <p className="text-xs font-bold text-[#1677c7] bg-sky-50 border border-sky-200 rounded-xl p-3">{verifyNotice}</p>
          )}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              disabled={verifyBusy}
              onClick={checkVerified}
              className="w-full min-h-[44px] py-2.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white rounded-xl font-bold text-xs cursor-pointer"
            >
              {verifyBusy ? 'جاري التحقق...' : 'تم التفعيل — متابعة الدخول'}
            </button>
            <button
              type="button"
              disabled={verifyBusy}
              onClick={resendVerification}
              className="w-full min-h-[44px] py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-800 rounded-xl font-bold text-xs cursor-pointer"
            >
              إعادة إرسال رابط التفعيل
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full py-2 text-xs font-bold text-slate-500 hover:text-rose-600 cursor-pointer"
            >
              تسجيل الخروج / تغيير الحساب
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (profileError) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-4 p-6 text-center bg-slate-50" dir="rtl">
        <AlertCircle className="w-10 h-10 text-rose-500" />
        <p className="font-bold text-slate-800 max-w-md">تعذّر تحميل بيانات حسابك من الخادم.</p>
        <p className="text-xs text-slate-500 max-w-md break-words" dir="auto">{profileError}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => firebaseUser?.uid && void loadUserSession(firebaseUser.uid)}
            className="px-5 py-2.5 bg-[#1677c7] text-white rounded-xl font-bold text-sm cursor-pointer"
          >
            إعادة المحاولة
          </button>
          <button onClick={handleSignOut} className="px-5 py-2.5 bg-slate-200 text-slate-800 rounded-xl font-bold text-sm cursor-pointer">
            تسجيل الخروج
          </button>
        </div>
      </div>
    );
  }
  if (!profile || loading) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-[#1677c7]" /></div>;
  }

  if (profile.is_suspended) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-4 p-6 text-center bg-slate-50" dir="rtl">
        <ShieldAlert className="w-12 h-12 text-rose-500" />
        <h2 className="text-lg font-black text-slate-900">تم إيقاف حسابك</h2>
        <p className="text-sm text-slate-600 max-w-sm">خالفت شروط الاستخدام أو صدر بحقك بلاغ. إن كنت تعتقد أن هذا خطأ تواصل مع إدارة المنصة.</p>
        <button onClick={handleSignOut} className="px-5 py-2.5 bg-[#1677c7] text-white rounded-xl font-bold text-sm cursor-pointer">تسجيل الخروج</button>
      </div>
    );
  }

  const role = profile.role;
  const section = activeSection === 'admin' && role !== 'admin' ? 'home' : activeSection;
  const unreadMessages = data.messages.filter(m => !m.channel_id && m.recipient_id === uid && !m.read_at).length;
  const myPending = role === 'student'
    ? data.assignments.filter(a => !data.submissions.some(s => s.assignment_id === a.id && s.student_id === uid)).length
    : 0;

  return (
    <div dir={appDir} className="min-h-[100dvh] bg-[#f8fafc] text-slate-800 flex flex-col font-['Cairo',sans-serif] selection:bg-[#1677c7]/20 selection:text-[#0f233a]">
      <AppHeader
        currentProfile={profile}
        activeSection={section}
        currentRole={role}
        notifications={data.notifications}
        unreadMessagesCount={unreadMessages}
        pendingAssignmentsCount={myPending}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onSelectSection={setActiveSection}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenHub={() => setHubOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <div className="hidden lg:block">
          <AppSidebar
            activeSection={section}
            onSelectSection={setActiveSection}
            onOpenHub={() => setHubOpen(true)}
            currentRole={role}
            currentProfile={profile}
          />
        </div>

        <main className="flex-1 p-3 sm:p-5 lg:p-6 min-w-0 pb-24 md:pb-8">
          <PullToRefresh
            enabled={['home', 'community', 'classes', 'schools', 'ministries', 'courses', 'assignments', 'calendar', 'grades'].includes(section)}
            onRefresh={handlePullRefresh}
          >
            <ErrorBoundary resetKey={section} onGoHome={() => setActiveSection('home')}>
              <Suspense fallback={<div className="py-16 flex items-center justify-center"><Loader2 className="w-7 h-7 animate-spin text-[#1677c7]" /></div>}>
            {section === 'home' && (
              <HomeView currentProfile={profile} classes={data.classes} schools={data.schools} ministries={data.ministries}
                assignments={data.assignments} quizzes={data.quizzes} liveSessions={data.liveSessions} posts={data.posts} onNavigate={setActiveSection} />
            )}

          {['classes', 'schools', 'ministries'].includes(section) && (
            <ClassesView currentRole={role} currentUserId={uid} currentUserName={profile.display_name}
              classes={data.classes} schools={data.schools} ministries={data.ministries}
              quizzes={data.quizzes} assignments={data.assignments} messages={data.messages}
              myOrgIds={data.myOrgIds} orgMembers={data.orgMembers}
              initialTab={section === 'schools' ? 'schools' : section === 'ministries' ? 'ministries' : 'classes'}
              members={data.classMembers} onAddClass={handleAddClass} onJoinClass={handleJoinClass}
              onLeaveClass={handleLeaveClass} onDeleteClass={handleDelete('classes', 'الصف')} onArchiveClass={handleArchiveClass}
              onRemoveMember={handleRemoveMember}
              onCreateMinistry={handleCreateMinistry} onCreateSchool={handleCreateSchool}
              onLinkSchoolToMinistry={handleLinkSchoolMinistry} onLinkClassToSchool={handleLinkClassSchool}
              onSendDirective={handleSendDirective} onRemoveOrgMember={handleRemoveOrgMember}
              onLeaveOrg={handleLeaveOrg} onDeleteOrg={handleDeleteOrg} />
          )}

          {section === 'courses' && (
            <CoursesView currentRole={role} currentUserId={uid} currentUserName={profile.display_name} courses={data.courses}
              lessons={data.lessons} quizzes={data.quizzes} classes={data.classes} schools={data.schools} ministries={data.ministries}
              assignments={data.assignments} submissions={data.submissions}
              onAddQuiz={handleAddQuiz} onAddLesson={handleAddLesson} onSubmitQuiz={handleSubmitQuiz}
              onGradeQuizAttempt={handleGradeQuizAttempt}
              onRewardPoints={handleRewardPoints} onUpload={upload}
              onDeleteLesson={handleDelete('lessons', 'الدرس')} onDeleteQuiz={handleDelete('quizzes', 'الاختبار')} />
          )}

          {section === 'ai' && (
            <AIStudioView
              currentProfile={profile}
              lessons={data.lessons}
              quizzes={data.quizzes}
              onRewardXP={handleRewardPoints}
            />
          )}

          {['tools', 'flashcards', 'pomodoro', 'grapher', 'certificate', 'badges'].includes(section) && (
            <StudyToolsView currentProfile={profile} onRewardXP={handleRewardPoints}
              initialTab={section === 'tools' ? 'flashcards' : (section as any)} />
          )}

          {section === 'assignments' && (
            <AssignmentsView currentRole={role} currentUserId={uid} currentUserName={profile.display_name}
              assignments={data.assignments} submissions={data.submissions} classes={data.classes}
              onSubmitAssignment={handleSubmitAssignment} onGradeSubmission={handleGradeSubmission}
              onCreateAssignment={handleCreateAssignment} onUpload={upload} onDeleteAssignment={handleDelete('assignments', 'الواجب')} />
          )}

          {section === 'community' && (
            <CommunityView
              currentRole={role}
              currentUserId={uid}
              currentUserName={profile.display_name}
              currentUserAvatar={profile.avatar_url}
              posts={data.posts}
              stories={data.stories}
              contacts={data.contacts}
              followingIds={data.followingIds}
              followerIds={data.followerIds}
              followRequests={data.followRequests}
              openReportsCount={data.reports.length}
              onAddPost={handleAddPost}
              onUpdatePost={handleUpdatePost}
              onDeletePost={handleDeletePost}
              onAddStory={handleAddStory}
              onDeleteStory={handleDeleteStory}
              onToggleLike={handleToggleLike}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              onFollowUser={handleFollowUser}
              onUnfollowUser={handleUnfollowUser}
              onCancelFollowRequest={handleCancelFollowRequest}
              onRespondFollowRequest={handleRespondFollowRequest}
              onStartChat={handleStartChat}
              onNavigate={setActiveSection}
              onRefresh={handlePullRefresh}
              onUpload={upload}
              onReport={(t: ReportTarget) => setReportTarget(t)}
            />
          )}

          {section === 'live' && (
            <LiveClassroomView currentRole={role} currentUserId={uid} currentUserName={profile.display_name}
              sessions={data.liveSessions} classes={data.classes} classMembers={data.classMembers}
              onScheduleSession={handleScheduleLive} onSetStatus={handleLiveStatus} />
          )}

          {section === 'calendar' && (
            <CalendarView currentRole={role} currentUserId={uid} assignments={data.assignments}
              submissions={data.submissions} liveSessions={data.liveSessions} onNavigate={setActiveSection} />
          )}

          {section === 'grades' && (
            <GradebookView currentRole={role} currentUserId={uid} currentUserName={profile.display_name}
              classes={data.classes} classMembers={data.classMembers} quizzes={data.quizzes}
              assignments={data.assignments} submissions={data.submissions} onNavigate={setActiveSection} />
          )}

          {section === 'messages' && (
            <MessagesView currentUserId={uid} currentUserName={profile.display_name} currentRole={role}
              messages={data.messages} groups={data.classes} contacts={data.contacts}
              onSendMessage={handleSendMessage}
              onCreateGroup={(c: ClassItem) => handleAddClass(c)}
              onSearchContacts={(q: string) => api.searchContacts(uid, q)}
              onUpload={upload} onMarkRead={handleMarkDmRead}
              initialPeerId={chatPeerId}
              onClearInitialPeer={() => setChatPeerId(null)}
              onReport={(t: ReportTarget) => setReportTarget(t)} />
          )}

          {section === 'admin' && role === 'admin' && (
            <AdminView stats={stats} reports={data.reports} currentUserId={uid} onResolveReport={handleResolveReport} onDismissReport={handleDismissReport}
              onListUsers={api.listUsers} onSetRole={handleSetRole} onSetSuspended={handleSetSuspended} />
          )}

          {section === 'profile' && (
            <ProfileView profile={profile} email={firebaseUser.email || ''} classesCount={data.classes.length}
              onSave={handleSaveProfile} onUpload={upload} onSignOut={handleSignOut} onDeleteAccount={handleDeleteAccount} />
          )}

          {section === 'settings' && (
            <SettingsView currentProfile={profile} onNotify={notify} />
          )}

          {section === 'legal' && <LegalView />}
            </Suspense>
            </ErrorBoundary>
          </PullToRefresh>
        </main>
      </div>

      {/* Clean 4-tab Thumb-Friendly Mobile Bottom Bar (<14% sticky cap) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 min-h-14 pb-[env(safe-area-inset-bottom)] px-2 grid grid-cols-4 items-center">
        {[
          { id: 'home', label: ui.mobile.home, icon: Home },
          { id: 'courses', label: settings.lang === 'en' ? 'Study' : settings.lang === 'fr' ? 'Étude' : 'الدراسة', icon: BookOpen },
          { id: 'community', label: ui.mobile.community, icon: Users },
          { id: 'messages', label: ui.mobile.messages, icon: MessageSquare, badge: unreadMessages },
        ].map(item => {
          const Icon = item.icon;
          const isActive = section === item.id;
          return (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              className={`relative min-h-[44px] flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-colors cursor-pointer ${isActive ? 'text-[#1677c7]' : 'text-slate-500'}`}>
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {!!item.badge && <span className="absolute top-1 right-4 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] flex items-center justify-center tabular-nums">{item.badge}</span>}
            </button>
          );
        })}
      </div>

      <HubDrawerModal
        open={hubOpen}
        activeSection={section}
        currentProfile={profile}
        currentRole={role}
        unreadMessagesCount={unreadMessages}
        pendingAssignmentsCount={myPending}
        onSelectSection={setActiveSection}
        onSignOut={handleSignOut}
        onClose={() => setHubOpen(false)}
      />
      <GlobalSearchModal open={searchOpen} data={data} onClose={() => setSearchOpen(false)} onNavigate={setActiveSection} />
      <ReportModal target={reportTarget} onClose={() => setReportTarget(null)} onSubmit={handleCreateReport} />
      <AppInstallPromptBanner />
      <OfflineIndicator />

      {liveAlert && (
        <div
          onClick={() => {
            if (liveAlert.targetSection) setActiveSection(liveAlert.targetSection);
            setLiveAlert(null);
          }}
          className="fixed top-20 left-4 right-4 sm:right-auto sm:w-96 z-[65] bg-white border border-sky-200 rounded-2xl shadow-xl p-4 flex items-start justify-between gap-3 cursor-pointer hover:border-[#1677c7] transition-all"
          dir="rtl"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#1677c7] flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0 space-y-0.5 text-xs">
            <p className="font-black text-slate-900 truncate">{liveAlert.title}</p>
            <p className="text-slate-600 line-clamp-2 leading-relaxed">{liveAlert.body}</p>
            {liveAlert.targetSection && (
              <span className="inline-block text-[11px] font-bold text-[#1677c7] pt-0.5">
                انقر للانتقال الآن ←
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setLiveAlert(null);
            }}
            className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {confirmState && (
        <div className="fixed inset-0 z-[75] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setConfirmState(null)}>
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200" onClick={e => e.stopPropagation()} dir={appDir}>
            <h3 className="font-black text-base text-slate-900">تأكيد الإجراء</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{confirmState.message}</p>
            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={() => setConfirmState(null)} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer">
                إلغاء
              </button>
              <button type="button" onClick={() => { const fn = confirmState.onConfirm; setConfirmState(null); fn(); }} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black cursor-pointer">
                تأكيد
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2 text-white ${toast.ok ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          {toast.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
