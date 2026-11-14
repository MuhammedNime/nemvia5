import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit3,
  FileText,
  Film,
  Flag,
  Globe,
  Heart,
  Loader2,
  Lock,
  MessageCircle,
  MessageSquare,
  Paperclip,
  RefreshCw,
  Reply,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { AppRole, ContactInfo, FollowRequestItem, Post, PostComment, Story } from '../../types';
import { UploadedFile } from '../../lib/api';
import type { ReportTarget } from '../ReportModal';

interface CommunityViewProps {
  currentRole: AppRole;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
  posts: Post[];
  stories: Story[];
  contacts: ContactInfo[];
  followingIds: string[];
  followerIds: string[];
  followRequests: FollowRequestItem[];
  openReportsCount?: number;
  onAddPost: (post: Post) => void;
  onUpdatePost: (
    postId: string,
    patch: { body?: string; category?: 'all' | 'questions' | 'notes' | 'announcements'; visibility?: 'public' | 'followers' | 'private' },
  ) => Promise<boolean> | void;
  onDeletePost: (postId: string) => void;
  onAddStory: (story: Story) => void;
  onDeleteStory: (storyId: string) => Promise<boolean> | void;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, comment: PostComment) => void;
  onDeleteComment: (commentId: string) => Promise<boolean> | void;
  onFollowUser: (targetId: string, visibility: 'public' | 'private') => Promise<boolean> | void;
  onUnfollowUser: (targetId: string) => Promise<boolean> | void;
  onCancelFollowRequest: (targetId: string) => Promise<boolean> | void;
  onRespondFollowRequest: (requestId: string, accept: boolean) => Promise<boolean> | void;
  onStartChat: (userId: string) => void;
  onNavigate?: (section: string) => void;
  onRefresh?: () => Promise<void>;
  onUpload: (f: File, folder: string) => Promise<UploadedFile>;
  onReport: (target: ReportTarget) => void;
}

const STORY_GRADIENTS = [
  { id: 'blue', label: 'أزرق أكاديمي', cls: 'from-blue-900 via-indigo-900 to-slate-900' },
  { id: 'purple', label: 'بنفسجي', cls: 'from-purple-900 via-pink-900 to-slate-900' },
  { id: 'emerald', label: 'أخضر زمردي', cls: 'from-emerald-900 via-teal-900 to-slate-900' },
  { id: 'amber', label: 'ذهبي دافئ', cls: 'from-amber-900 via-orange-900 to-slate-900' },
  { id: 'cyan', label: 'سماوي عميق', cls: 'from-cyan-900 via-sky-900 to-slate-900' },
  { id: 'rose', label: 'وردي داكن', cls: 'from-rose-900 via-red-900 to-slate-900' },
];

type CommunitySectionTab = 'feed' | 'following' | 'saved' | 'members';
type CategoryFilter = 'all' | 'questions' | 'notes' | 'announcements';
type SortMode = 'latest' | 'top';
type MembersFilter = 'all' | 'teachers' | 'following' | 'followers';

function formatRelativeTime(iso: string): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (diffSec < 60) return 'الآن';
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `منذ ${min} د`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `منذ ${hrs} س`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `منذ ${days} ي`;
  return new Date(iso).toLocaleDateString('ar', { day: 'numeric', month: 'short' });
}

function storyRemainingLabel(expiresAt: string): string {
  const hrs = Math.max(1, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 3600000));
  return `متبقي ${hrs} س`;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  currentRole,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  posts,
  stories,
  contacts,
  followingIds,
  followerIds,
  followRequests,
  openReportsCount = 0,
  onAddPost,
  onUpdatePost,
  onDeletePost,
  onAddStory,
  onDeleteStory,
  onToggleLike,
  onAddComment,
  onDeleteComment,
  onFollowUser,
  onUnfollowUser,
  onCancelFollowRequest,
  onRespondFollowRequest,
  onStartChat,
  onNavigate,
  onRefresh,
  onUpload,
  onReport,
}) => {
  const [sectionTab, setSectionTab] = useState<CommunitySectionTab>('feed');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshingBtn, setRefreshingBtn] = useState(false);

  // Composer state
  const [postText, setPostText] = useState('');
  const [postCategory, setPostCategory] = useState<'all' | 'questions' | 'notes' | 'announcements'>('questions');
  const [postVisibility, setPostVisibility] = useState<'public' | 'followers' | 'private'>('public');
  const [postAttachment, setPostAttachment] = useState<{ url: string; name: string; mediaType: 'image' | 'video' | 'document' } | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const mediaInputRef = useRef<HTMLInputElement | null>(null);

  // Post editing & inline delete confirmation
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState('');
  const [editCategory, setEditCategory] = useState<'all' | 'questions' | 'notes' | 'announcements'>('questions');
  const [editVisibility, setEditVisibility] = useState<'public' | 'followers' | 'private'>('public');
  const [savingEdit, setSavingEdit] = useState(false);
  const [confirmDeletePostId, setConfirmDeletePostId] = useState<string | null>(null);
  const [confirmDeleteCommentId, setConfirmDeleteCommentId] = useState<string | null>(null);

  // Story state
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [showStoryComposer, setShowStoryComposer] = useState(false);
  const [newStoryText, setNewStoryText] = useState('');
  const [newStoryGradient, setNewStoryGradient] = useState(STORY_GRADIENTS[0].cls);
  const [confirmDeleteStory, setConfirmDeleteStory] = useState(false);

  // Comments state (independent text per post + quick reply)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const commentRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Saved bookmarks persisted per user in localStorage
  const storageKey = `nemvia:saved_posts:${currentUserId}`;
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(savedPosts));
    } catch { /* ignore storage quota */ }
  }, [savedPosts, storageKey]);

  // Share copied indicator & Lightbox & Author modal
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [inspectMemberId, setInspectMemberId] = useState<string | null>(null);
  const [membersFilter, setMembersFilter] = useState<MembersFilter>('all');
  const [memberSearch, setMemberSearch] = useState('');
  const [busyFollowId, setBusyFollowId] = useState<string | null>(null);

  const followingSet = useMemo(() => new Set(followingIds), [followingIds]);
  const followerSet = useMemo(() => new Set(followerIds), [followerIds]);
  const incomingRequests = useMemo(
    () => followRequests.filter(r => r.target_id === currentUserId && r.status === 'pending'),
    [followRequests, currentUserId],
  );
  const outgoingRequestTargets = useMemo(
    () => new Set(followRequests.filter(r => r.requester_id === currentUserId && r.status === 'pending').map(r => r.target_id)),
    [followRequests, currentUserId],
  );
  const contactById = useMemo(() => {
    const m = new Map<string, ContactInfo>();
    contacts.forEach(c => m.set(c.id, c));
    return m;
  }, [contacts]);

  // Filtered & sorted posts
  const visiblePosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = posts.filter(p => {
      if (sectionTab === 'following' && p.author_id !== currentUserId && !followingSet.has(p.author_id)) {
        return false;
      }
      if (sectionTab === 'saved' && !savedPosts[p.id]) {
        return false;
      }
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      if (q) {
        const hay = `${p.body} ${p.author_name} ${p.comments.map(c => c.body).join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortMode === 'top') {
      return [...list].sort((a, b) => (b.likes_count + b.comments_count * 2) - (a.likes_count + a.comments_count * 2));
    }
    return list;
  }, [posts, sectionTab, selectedCategory, searchQuery, sortMode, currentUserId, followingSet, savedPosts]);

  // Filtered members list
  const visibleMembers = useMemo(() => {
    const q = memberSearch.trim().toLowerCase();
    return contacts.filter(c => {
      if (membersFilter === 'teachers' && c.role === 'student') return false;
      if (membersFilter === 'following' && !followingSet.has(c.id)) return false;
      if (membersFilter === 'followers' && !followerSet.has(c.id)) return false;
      if (q && !`${c.name} ${c.bio || ''}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [contacts, membersFilter, memberSearch, followingSet, followerSet]);

  const savedCount = useMemo(() => posts.filter(p => savedPosts[p.id]).length, [posts, savedPosts]);

  const handleMediaSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadingMedia(true);
    try {
      const up = await onUpload(file, 'posts');
      const mediaType: 'image' | 'video' | 'document' = file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
          ? 'video'
          : 'document';
      setPostAttachment({ url: up.url, name: up.name, mediaType });
    } catch {
      /* toast handled by parent */
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim() && !postAttachment) return;
    const newP: Post = {
      id: `post-${Date.now()}`,
      author_id: currentUserId,
      author_name: currentUserName,
      author_role: currentRole,
      author_avatar: currentUserAvatar,
      body: postText.trim(),
      category: postCategory,
      media_url: postAttachment?.url,
      media_type: postAttachment?.mediaType,
      visibility: postVisibility,
      likes_count: 0,
      comments_count: 0,
      comments: [],
      is_liked: false,
      created_at: new Date().toISOString(),
    };
    onAddPost(newP);
    setPostText('');
    setPostAttachment(null);
    setPostVisibility('public');
  };

  const startEditPost = (post: Post) => {
    setEditingPostId(post.id);
    setEditBody(post.body);
    setEditCategory(post.category);
    setEditVisibility(post.visibility);
    setConfirmDeletePostId(null);
  };

  const saveEditPost = async (postId: string) => {
    if (!editBody.trim()) return;
    setSavingEdit(true);
    try {
      await onUpdatePost(postId, {
        body: editBody.trim(),
        category: editCategory,
        visibility: editVisibility,
      });
      setEditingPostId(null);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryText.trim()) return;
    const newS: Story = {
      id: `str-${Date.now()}`,
      user_id: currentUserId,
      user_name: currentUserName,
      user_role: currentRole,
      user_avatar: currentUserAvatar,
      body: newStoryText.trim(),
      bgGradient: newStoryGradient,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    onAddStory(newS);
    setNewStoryText('');
    setShowStoryComposer(false);
  };

  const handleSendComment = (postId: string) => {
    const body = (commentInputs[postId] || '').trim();
    if (!body) return;
    const newC: PostComment = {
      id: `cmt-${Date.now()}`,
      post_id: postId,
      author_id: currentUserId,
      author_name: currentUserName,
      author_avatar: currentUserAvatar,
      body,
      created_at: new Date().toISOString(),
    };
    onAddComment(postId, newC);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
  };

  const handleQuickReply = (postId: string, authorName: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
    setCommentInputs(prev => {
      const curr = prev[postId] || '';
      const prefix = `@${authorName} `;
      return { ...prev, [postId]: curr.startsWith(prefix) ? curr : `${prefix}${curr}` };
    });
    window.setTimeout(() => {
      commentRefs.current[postId]?.focus();
    }, 60);
  };

  const handleSharePost = async (post: Post) => {
    const shareText = `${post.author_name} في مجتمع NEMVIA:\n${post.body}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'مشاركة من NEMVIA', text: shareText });
        return;
      } catch { /* fallback to clipboard */ }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedPostId(post.id);
      window.setTimeout(() => setCopiedPostId(null), 2000);
    } catch { /* ignore */ }
  };

  const handleFollowAction = async (targetId: string, visibility: 'public' | 'private' = 'public') => {
    setBusyFollowId(targetId);
    try {
      if (followingSet.has(targetId)) {
        await onUnfollowUser(targetId);
      } else if (outgoingRequestTargets.has(targetId)) {
        await onCancelFollowRequest(targetId);
      } else {
        await onFollowUser(targetId, visibility);
      }
    } finally {
      setBusyFollowId(null);
    }
  };

  const handleManualRefresh = async () => {
    if (!onRefresh || refreshingBtn) return;
    setRefreshingBtn(true);
    try {
      await onRefresh();
    } finally {
      setRefreshingBtn(false);
    }
  };

  const roleText = (r: AppRole) => (r === 'teacher' ? 'أستاذ' : r === 'admin' ? 'إدارة المنصة' : 'طالب');
  const categoryLabel = (c: Post['category']) =>
    c === 'questions' ? 'سؤال علمي' : c === 'notes' ? 'ملخص ونصيحة' : c === 'announcements' ? 'إعلان رسمي' : 'مناقشة عامة';

  const inspectedMember: ContactInfo | null = useMemo(() => {
    if (!inspectMemberId) return null;
    if (inspectMemberId === currentUserId) {
      return { id: currentUserId, name: currentUserName, role: currentRole, avatar_url: currentUserAvatar };
    }
    const found = contactById.get(inspectMemberId);
    if (found) return found;
    const p = posts.find(x => x.author_id === inspectMemberId);
    if (p) return { id: p.author_id, name: p.author_name, role: p.author_role, avatar_url: p.author_avatar };
    return null;
  }, [inspectMemberId, currentUserId, currentUserName, currentRole, currentUserAvatar, contactById, posts]);

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* FULLSCREEN IMAGE LIGHTBOX */}
      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <button
            type="button"
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightboxUrl}
            alt="معاينة كاملة"
            onClick={e => e.stopPropagation()}
            className="max-h-[88vh] max-w-full rounded-2xl object-contain"
          />
        </div>
      )}

      {/* MEMBER PROFILE MODAL */}
      {inspectedMember && (
        <div
          onClick={() => setInspectMemberId(null)}
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {inspectedMember.avatar_url ? (
                  <img src={inspectedMember.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-base shrink-0">
                    {inspectedMember.name.slice(0, 1)}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-black text-base text-slate-900 truncate">{inspectedMember.name}</h3>
                  <p className="text-xs text-slate-500">
                    {roleText(inspectedMember.role)}
                    {inspectedMember.points !== undefined ? ` · ${inspectedMember.points} XP` : ''}
                    {inspectedMember.visibility === 'private' ? ' · حساب خاص' : ''}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectMemberId(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {inspectedMember.bio && (
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {inspectedMember.bio}
              </p>
            )}

            <div className="text-xs text-slate-500 flex items-center gap-4 tabular-nums">
              <span>{posts.filter(p => p.author_id === inspectedMember.id).length} منشور</span>
              {followerSet.has(inspectedMember.id) && <span>يتابعك</span>}
            </div>

            {inspectedMember.id !== currentUserId && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={busyFollowId === inspectedMember.id}
                  onClick={() => handleFollowAction(inspectedMember.id, inspectedMember.visibility === 'private' ? 'private' : 'public')}
                  className={`flex-1 min-h-[42px] px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    followingSet.has(inspectedMember.id)
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      : outgoingRequestTargets.has(inspectedMember.id)
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-[#1677c7] hover:bg-[#125fa0] text-white'
                  }`}
                >
                  {followingSet.has(inspectedMember.id) ? (
                    <><UserCheck className="w-4 h-4" /><span>متابَع (إلغاء)</span></>
                  ) : outgoingRequestTargets.has(inspectedMember.id) ? (
                    <><Check className="w-4 h-4" /><span>طلب متابعة مرسل</span></>
                  ) : (
                    <><UserPlus className="w-4 h-4" /><span>{inspectedMember.visibility === 'private' ? 'طلب متابعة' : 'متابعة'}</span></>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const id = inspectedMember.id;
                    setInspectMemberId(null);
                    onStartChat(id);
                  }}
                  className="flex-1 min-h-[42px] px-4 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>مراسلة مباشرة</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 24-HOUR STORIES VIEWER MODAL */}
      {activeStoryIndex !== null && stories[activeStoryIndex] && (
        <div className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-sm w-full h-[540px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-5 text-white border border-white/15 animate-in zoom-in-95">
            <div className={`absolute inset-0 bg-gradient-to-br ${stories[activeStoryIndex].bgGradient} -z-10`} />

            {/* Segmented Progress & Header */}
            <div className="space-y-3 z-10">
              <div className="flex gap-1">
                {stories.map((st, idx) => (
                  <div key={st.id} className="h-1 flex-1 rounded-full bg-white/25 overflow-hidden">
                    <div className={`h-full rounded-full ${idx <= activeStoryIndex ? 'bg-white w-full' : 'w-0'}`} />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {stories[activeStoryIndex].user_avatar ? (
                    <img src={stories[activeStoryIndex].user_avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs shrink-0">
                      {stories[activeStoryIndex].user_name.slice(0, 1)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="font-bold text-xs block truncate">{stories[activeStoryIndex].user_name}</span>
                    <span className="text-[10px] text-white/75">
                      {roleText(stories[activeStoryIndex].user_role)} · {storyRemainingLabel(stories[activeStoryIndex].expires_at)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {(stories[activeStoryIndex].user_id === currentUserId || currentRole === 'admin') && (
                    confirmDeleteStory ? (
                      <button
                        type="button"
                        onClick={async () => {
                          const targetId = stories[activeStoryIndex].id;
                          setConfirmDeleteStory(false);
                          setActiveStoryIndex(null);
                          await onDeleteStory(targetId);
                        }}
                        className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[11px] font-bold cursor-pointer"
                      >
                        تأكيد الحذف
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteStory(true)}
                        title="حذف القصة"
                        className="w-8 h-8 rounded-full bg-black/35 hover:bg-rose-600/80 text-white flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => { setActiveStoryIndex(null); setConfirmDeleteStory(false); }}
                    className="w-8 h-8 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Story Body */}
            <div className="my-auto text-center px-3 py-6">
              <p className="text-lg sm:text-xl font-bold leading-relaxed whitespace-pre-wrap">
                {stories[activeStoryIndex].body}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between z-10 pt-3 border-t border-white/15 text-xs text-white/80">
              <button
                type="button"
                onClick={() => { setConfirmDeleteStory(false); setActiveStoryIndex(Math.max(0, activeStoryIndex - 1)); }}
                disabled={activeStoryIndex === 0}
                className="min-h-[36px] px-2 disabled:opacity-30 cursor-pointer flex items-center gap-1 font-bold"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابقة</span>
              </button>
              <span className="tabular-nums">{activeStoryIndex + 1} / {stories.length}</span>
              <button
                type="button"
                onClick={() => { setConfirmDeleteStory(false); setActiveStoryIndex(Math.min(stories.length - 1, activeStoryIndex + 1)); }}
                disabled={activeStoryIndex === stories.length - 1}
                className="min-h-[36px] px-2 disabled:opacity-30 cursor-pointer flex items-center gap-1 font-bold"
              >
                <span>التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP COMMUNITY NAVIGATION & MODERATION BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none" data-no-pull="true">
          {[
            { id: 'feed', label: 'الخلاصة', count: posts.length },
            { id: 'following', label: 'متابَعتي', count: followingIds.length },
            { id: 'saved', label: 'المحفوظات', count: savedCount },
            { id: 'members', label: 'الأعضاء والمتابعة', count: incomingRequests.length > 0 ? incomingRequests.length : contacts.length, badge: incomingRequests.length },
          ].map(tab => {
            const active = sectionTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSectionTab(tab.id as CommunitySectionTab)}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer ${
                  active ? 'bg-[#1677c7] text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 ? (
                  <span className={`min-w-4 h-4 px-1 rounded-full text-[10px] font-black flex items-center justify-center tabular-nums ${
                    active ? 'bg-white text-[#1677c7]' : 'bg-rose-600 text-white'
                  }`}>
                    {tab.badge}
                  </span>
                ) : (
                  <span className={`text-[10px] tabular-nums ${active ? 'text-white/80' : 'text-slate-400'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {currentRole === 'admin' && openReportsCount > 0 && onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="min-h-[36px] px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{openReportsCount} بلاغ للمراجعة</span>
            </button>
          )}
          {onRefresh && (
            <button
              type="button"
              onClick={handleManualRefresh}
              title="تحديث المنشورات"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${refreshingBtn ? 'animate-spin text-[#1677c7]' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* MEMBERS & CONNECTIONS TAB */}
      {sectionTab === 'members' ? (
        <div className="space-y-5">
          {/* Incoming Follow Requests */}
          {incomingRequests.length > 0 && (
            <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3">
              <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#1677c7]" />
                <span>طلبات المتابعة الواردة ({incomingRequests.length})</span>
              </h3>
              <div className="divide-y divide-slate-100">
                {incomingRequests.map(req => (
                  <div key={req.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {req.requester_avatar ? (
                        <img src={req.requester_avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {req.requester_name.slice(0, 1)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-slate-900 truncate">{req.requester_name}</p>
                        <p className="text-[11px] text-slate-500">{roleText(req.requester_role)} · {formatRelativeTime(req.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onRespondFollowRequest(req.id, true)}
                        className="min-h-[36px] px-3 rounded-xl bg-[#1677c7] text-white font-bold text-xs cursor-pointer"
                      >
                        قبول
                      </button>
                      <button
                        type="button"
                        onClick={() => onRespondFollowRequest(req.id, false)}
                        className="min-h-[36px] px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                      >
                        رفض
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Directory Controls */}
          <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-black text-sm text-slate-900">دليل أعضاء المجتمع</h2>
                <p className="text-xs text-slate-500 tabular-nums">
                  تتابع {followingIds.length} · يتابعك {followerIds.length} · {contacts.length} عضو متاح
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={memberSearch}
                  onChange={e => setMemberSearch(e.target.value)}
                  placeholder="ابحث عن طالب أو معلم..."
                  className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'الجميع' },
                { id: 'teachers', label: 'المعلمون والإدارة' },
                { id: 'following', label: `أتابعهم (${followingIds.length})` },
                { id: 'followers', label: `يتابعونني (${followerIds.length})` },
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setMembersFilter(f.id as MembersFilter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    membersFilter === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {visibleMembers.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">لا توجد نتائج مطابقة في هذا التصنيف.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {visibleMembers.map(member => {
                  const isFollowing = followingSet.has(member.id);
                  const isPending = outgoingRequestTargets.has(member.id);
                  return (
                    <div key={member.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => setInspectMemberId(member.id)}
                          className="shrink-0 cursor-pointer"
                        >
                          {member.avatar_url ? (
                            <img src={member.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                              {member.name.slice(0, 1)}
                            </div>
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => setInspectMemberId(member.id)}
                            className="font-bold text-xs text-slate-900 hover:text-[#1677c7] truncate block text-start cursor-pointer"
                          >
                            {member.name}
                          </button>
                          <p className="text-[11px] text-slate-500">
                            {roleText(member.role)}
                            {member.points !== undefined ? ` · ${member.points} XP` : ''}
                            {followerSet.has(member.id) ? ' · يتابعك' : ''}
                          </p>
                          {member.bio && <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{member.bio}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={busyFollowId === member.id}
                          onClick={() => handleFollowAction(member.id, member.visibility === 'private' ? 'private' : 'public')}
                          className={`flex-1 min-h-[38px] px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                            isFollowing
                              ? 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-100'
                              : isPending
                                ? 'bg-amber-50 border border-amber-200 text-amber-800'
                                : 'bg-[#1677c7] hover:bg-[#125fa0] text-white'
                          }`}
                        >
                          {isFollowing ? (
                            <><UserCheck className="w-3.5 h-3.5" /><span>متابَع</span></>
                          ) : isPending ? (
                            <><Check className="w-3.5 h-3.5" /><span>طلب مرسل</span></>
                          ) : (
                            <><UserPlus className="w-3.5 h-3.5" /><span>{member.visibility === 'private' ? 'طلب متابعة' : 'متابعة'}</span></>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => onStartChat(member.id)}
                          className="min-h-[38px] px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>مراسلة</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      ) : (
        <>
          {/* STORIES CAROUSEL (Shown on Main Feed) */}
          {sectionTab === 'feed' && (
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>القصص اليومية (24 ساعة)</span>
                </span>
                <span className="text-[11px] text-slate-400 tabular-nums">{stories.length} قصة نشطة</span>
              </div>

              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none" data-no-pull="true">
                <button
                  type="button"
                  onClick={() => setShowStoryComposer(v => !v)}
                  className="shrink-0 w-28 h-40 rounded-2xl bg-white border-2 border-dashed border-slate-300 hover:border-[#1677c7] p-3 flex flex-col justify-between items-center text-center cursor-pointer transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-[#1677c7] text-white flex items-center justify-center font-bold text-lg mt-2">
                    +
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">أضف قصة</span>
                    <span className="text-[10px] text-slate-500">تختفي بعد 24س</span>
                  </div>
                </button>

                {stories.map((st, i) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => { setConfirmDeleteStory(false); setActiveStoryIndex(i); }}
                    className={`shrink-0 w-28 h-40 rounded-2xl bg-gradient-to-br ${st.bgGradient} text-white p-3 flex flex-col justify-between text-start cursor-pointer hover:opacity-95 transition-opacity`}
                  >
                    <div className="flex items-center gap-1.5">
                      {st.user_avatar ? (
                        <img src={st.user_avatar} alt="" className="w-6 h-6 rounded-full object-cover ring-2 ring-white/50 shrink-0" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold ring-2 ring-white/50 shrink-0">
                          {st.user_name.slice(0, 1)}
                        </div>
                      )}
                      <span className="text-[10px] font-bold truncate">{st.user_name}</span>
                    </div>
                    <p className="text-[11px] font-semibold leading-relaxed line-clamp-4">{st.body}</p>
                    <span className="text-[9px] text-white/75">{storyRemainingLabel(st.expires_at)}</span>
                  </button>
                ))}
              </div>

              {showStoryComposer && (
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900">إنشاء قصة سريعة (24 ساعة)</h4>
                    <button type="button" onClick={() => setShowStoryComposer(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleCreateStory} className="space-y-3">
                    <input
                      type="text"
                      maxLength={300}
                      value={newStoryText}
                      onChange={e => setNewStoryText(e.target.value)}
                      placeholder="شارك إنجازاً دراسياً، تذكيراً سريعاً، أو سؤالاً لزملائك..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
                      required
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {STORY_GRADIENTS.map(g => (
                          <button
                            key={g.id}
                            type="button"
                            title={g.label}
                            onClick={() => setNewStoryGradient(g.cls)}
                            className={`w-6 h-6 rounded-full bg-gradient-to-br ${g.cls} cursor-pointer ${
                              newStoryGradient === g.cls ? 'ring-2 ring-offset-2 ring-[#1677c7]' : 'opacity-75 hover:opacity-100'
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        type="submit"
                        className="min-h-[38px] px-4 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl text-xs cursor-pointer"
                      >
                        نشر القصة
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </section>
          )}

          {/* FULL-POWER POST COMPOSER */}
          {sectionTab === 'feed' && (
            <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {currentUserAvatar ? (
                    <img src={currentUserAvatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {currentUserName.slice(0, 1)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-slate-900 block truncate">{currentUserName}</span>
                    <span className="text-[11px] text-slate-500">انشر سؤالاً، ملخصاً، ملفاً، أو فيديو تعليمي</span>
                  </div>
                </div>

                {/* Visibility selector */}
                <select
                  value={postVisibility}
                  onChange={e => setPostVisibility(e.target.value as 'public' | 'followers' | 'private')}
                  aria-label="الخصوصية"
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 outline-none"
                >
                  <option value="public">عام للجميع</option>
                  <option value="followers">المتابعون فقط</option>
                  <option value="private">خاص بي</option>
                </select>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-3">
                <textarea
                  value={postText}
                  onChange={e => setPostText(e.target.value)}
                  placeholder="ماذا تريد أن تشارك أو تناقش مع زملائك ومعلميك اليوم؟"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#1677c7] min-h-[88px] leading-relaxed"
                />

                {/* Uploaded Media Preview */}
                {postAttachment && (
                  <div className="relative inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 max-w-full">
                    {postAttachment.mediaType === 'image' && (
                      <img src={postAttachment.url} alt="" className="max-h-44 rounded-lg object-cover" />
                    )}
                    {postAttachment.mediaType === 'video' && (
                      <div className="flex items-center gap-2 px-2 py-1 text-xs font-bold text-slate-700">
                        <Film className="w-4 h-4 text-[#1677c7]" />
                        <span className="truncate max-w-[200px]">{postAttachment.name}</span>
                      </div>
                    )}
                    {postAttachment.mediaType === 'document' && (
                      <div className="flex items-center gap-2 px-2 py-1 text-xs font-bold text-slate-700">
                        <FileText className="w-4 h-4 text-[#1677c7]" />
                        <span className="truncate max-w-[200px]">{postAttachment.name}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setPostAttachment(null)}
                      className="w-7 h-7 rounded-full bg-slate-900/80 text-white flex items-center justify-center cursor-pointer shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={postCategory}
                      onChange={e => setPostCategory(e.target.value as Post['category'])}
                      className="min-h-[38px] px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs outline-none"
                    >
                      <option value="questions">سؤال علمي</option>
                      <option value="notes">ملخص أو نصيحة</option>
                      <option value="all">مناقشة عامة</option>
                      {(currentRole === 'teacher' || currentRole === 'admin') && (
                        <option value="announcements">إعلان رسمي</option>
                      )}
                    </select>

                    <input
                      type="file"
                      ref={mediaInputRef}
                      onChange={handleMediaSelect}
                      accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploadingMedia}
                      onClick={() => mediaInputRef.current?.click()}
                      className="min-h-[38px] px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-60"
                    >
                      {uploadingMedia ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1677c7]" />
                      ) : (
                        <Paperclip className="w-3.5 h-3.5 text-[#1677c7]" />
                      )}
                      <span>{uploadingMedia ? 'جاري الرفع...' : 'صورة / فيديو / ملف'}</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={uploadingMedia || (!postText.trim() && !postAttachment)}
                    className="min-h-[40px] px-5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-50 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>نشر</span>
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* FEED SEARCH, CATEGORY FILTER & SORT BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl overflow-x-auto scrollbar-none" data-no-pull="true">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'questions', label: 'أسئلة' },
                { id: 'notes', label: 'ملخصات' },
                { id: 'announcements', label: 'إعلانات' },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id as CategoryFilter)}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-52">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="بحث في المنشورات..."
                  className="w-full pr-8 pl-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
                />
              </div>

              <select
                value={sortMode}
                onChange={e => setSortMode(e.target.value as SortMode)}
                className="px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
              >
                <option value="latest">الأحدث</option>
                <option value="top">الأكثر تفاعلاً</option>
              </select>
            </div>
          </div>

          {/* POSTS FEED */}
          <div className="space-y-4">
            {visiblePosts.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">
                  {sectionTab === 'following'
                    ? 'لا توجد منشورات بعد في قائمة المتابَعين'
                    : sectionTab === 'saved'
                      ? 'لا توجد منشورات محفوظة بعد'
                      : 'لا توجد منشورات مطابقة للبحث'}
                </p>
                {sectionTab === 'following' && (
                  <button
                    type="button"
                    onClick={() => setSectionTab('members')}
                    className="mt-2 px-4 py-2 rounded-xl bg-[#1677c7] text-white font-bold text-xs cursor-pointer"
                  >
                    استكشاف الأعضاء ومتابعتهم
                  </button>
                )}
              </div>
            )}

            {visiblePosts.map(post => {
              const isCommentsOpen = Boolean(expandedComments[post.id]);
              const isSaved = Boolean(savedPosts[post.id]);
              const canManagePost = post.author_id === currentUserId || currentRole === 'admin';
              const isEditing = editingPostId === post.id;
              const isFollowingAuthor = followingSet.has(post.author_id);
              const isPendingAuthor = outgoingRequestTargets.has(post.author_id);
              const authorContact = contactById.get(post.author_id);

              return (
                <article key={post.id} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3.5">
                  {/* Post Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={() => setInspectMemberId(post.author_id)}
                        className="shrink-0 cursor-pointer"
                      >
                        {post.author_avatar ? (
                          <img src={post.author_avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-sky-100 text-[#1677c7] flex items-center justify-center font-black text-sm">
                            {post.author_name.slice(0, 1)}
                          </div>
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setInspectMemberId(post.author_id)}
                            className="font-bold text-slate-900 text-sm hover:text-[#1677c7] truncate cursor-pointer"
                          >
                            {post.author_name}
                          </button>

                          {post.author_id !== currentUserId && (
                            <button
                              type="button"
                              disabled={busyFollowId === post.author_id}
                              onClick={() => handleFollowAction(post.author_id, authorContact?.visibility === 'private' ? 'private' : 'public')}
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-lg cursor-pointer transition-colors ${
                                isFollowingAuthor
                                  ? 'text-slate-500 hover:text-slate-800'
                                  : isPendingAuthor
                                    ? 'text-amber-700'
                                    : 'text-[#1677c7] hover:bg-sky-50'
                              }`}
                            >
                              {isFollowingAuthor ? 'متابَع ✓' : isPendingAuthor ? 'قيد الطلب' : '+ متابعة'}
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <span>{roleText(post.author_role)}</span>
                          <span>·</span>
                          <span>{categoryLabel(post.category)}</span>
                          <span>·</span>
                          <span className="tabular-nums">{formatRelativeTime(post.created_at)}</span>
                          <span>·</span>
                          {post.visibility === 'private' ? (
                            <Lock className="w-3 h-3 inline" aria-label="خاص" />
                          ) : post.visibility === 'followers' ? (
                            <Users className="w-3 h-3 inline" aria-label="للمتابعين" />
                          ) : (
                            <Globe className="w-3 h-3 inline" aria-label="عام" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Top-right Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {canManagePost && (
                        <>
                          <button
                            type="button"
                            onClick={() => (isEditing ? setEditingPostId(null) : startEditPost(post))}
                            title="تعديل المنشور"
                            className="w-8 h-8 rounded-lg text-slate-400 hover:text-[#1677c7] hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {confirmDeletePostId === post.id ? (
                            <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1">
                              <button
                                type="button"
                                onClick={() => { setConfirmDeletePostId(null); onDeletePost(post.id); }}
                                className="text-[11px] font-bold text-rose-700 cursor-pointer"
                              >
                                حذف
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeletePostId(null)}
                                className="text-[11px] font-bold text-slate-500 cursor-pointer"
                              >
                                إلغاء
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeletePostId(post.id)}
                              title="حذف المنشور"
                              className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}

                      {post.author_id !== currentUserId && (
                        <button
                          type="button"
                          onClick={() => onReport({ type: 'post', id: post.id, label: 'منشور', snapshot: post.body.slice(0, 200) })}
                          title="إبلاغ عن المنشور"
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                        >
                          <Flag className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSavedPosts(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                        title={isSaved ? 'إزالة من المحفوظات' : 'حفظ المنشور'}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                          isSaved ? 'text-[#1677c7] bg-sky-50' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#1677c7]' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Post Content or Inline Editor */}
                  {isEditing ? (
                    <div className="space-y-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <textarea
                        value={editBody}
                        onChange={e => setEditBody(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#1677c7] min-h-[80px]"
                      />
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <select
                            value={editCategory}
                            onChange={e => setEditCategory(e.target.value as Post['category'])}
                            className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                          >
                            <option value="questions">سؤال علمي</option>
                            <option value="notes">ملخص أو نصيحة</option>
                            <option value="all">مناقشة عامة</option>
                            {(currentRole === 'teacher' || currentRole === 'admin') && <option value="announcements">إعلان رسمي</option>}
                          </select>
                          <select
                            value={editVisibility}
                            onChange={e => setEditVisibility(e.target.value as Post['visibility'])}
                            className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                          >
                            <option value="public">عام</option>
                            <option value="followers">المتابعون</option>
                            <option value="private">خاص</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingPostId(null)}
                            className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-bold cursor-pointer"
                          >
                            إلغاء
                          </button>
                          <button
                            type="button"
                            disabled={savingEdit || !editBody.trim()}
                            onClick={() => saveEditPost(post.id)}
                            className="px-3 py-1.5 rounded-lg bg-[#1677c7] text-white font-bold cursor-pointer disabled:opacity-60"
                          >
                            {savingEdit ? 'حفظ...' : 'حفظ التعديل'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    post.body && (
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                        {post.body}
                      </p>
                    )
                  )}

                  {/* Rich Media Display */}
                  {post.media_url && (
                    post.media_type === 'video' ? (
                      <video
                        src={post.media_url}
                        controls
                        playsInline
                        className="w-full max-h-96 rounded-xl border border-slate-200 bg-black"
                      />
                    ) : post.media_type === 'document' ? (
                      <a
                        href={post.media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-sky-100 text-[#1677c7] flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-slate-900 block truncate">ملف مرفق</span>
                            <span className="text-[11px] text-slate-500">اضغط لفتح أو تحميل المستند</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#1677c7] shrink-0">فتح</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setLightboxUrl(post.media_url!)}
                        className="w-full rounded-xl overflow-hidden border border-slate-200 max-h-96 bg-slate-50 flex items-center justify-center cursor-zoom-in"
                      >
                        <img
                          src={post.media_url}
                          alt="مرفق منشور"
                          className="max-h-96 w-auto object-contain"
                        />
                      </button>
                    )
                  )}

                  {/* Engagement Bar */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-3 sm:gap-5">
                      <button
                        type="button"
                        onClick={() => onToggleLike(post.id)}
                        className={`min-h-[36px] px-2 rounded-lg flex items-center gap-1.5 font-bold cursor-pointer transition-colors ${
                          post.is_liked ? 'text-rose-600 bg-rose-50/70' : 'text-slate-600 hover:bg-slate-100 hover:text-rose-600'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-rose-500' : ''}`} />
                        <span className="tabular-nums">{post.likes_count}</span>
                        <span className="hidden sm:inline">إعجاب</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !isCommentsOpen }))}
                        className={`min-h-[36px] px-2 rounded-lg flex items-center gap-1.5 font-bold cursor-pointer transition-colors ${
                          isCommentsOpen ? 'text-[#1677c7] bg-sky-50' : 'text-slate-600 hover:bg-slate-100 hover:text-[#1677c7]'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="tabular-nums">{post.comments.length}</span>
                        <span className="hidden sm:inline">تعليقات</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSharePost(post)}
                      className="min-h-[36px] px-2.5 rounded-lg flex items-center gap-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-bold cursor-pointer transition-colors"
                    >
                      {copiedPostId === post.id ? (
                        <><Check className="w-3.5 h-3.5 text-emerald-600" /><span className="text-emerald-700">تم النسخ</span></>
                      ) : (
                        <><Share2 className="w-3.5 h-3.5" /><span>مشاركة</span></>
                      )}
                    </button>
                  </div>

                  {/* Comments Thread */}
                  {isCommentsOpen && (
                    <div className="pt-3 border-t border-slate-100 space-y-3 bg-slate-50/60 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 p-4 sm:p-5 rounded-b-2xl">
                      {post.comments.length === 0 ? (
                        <p className="text-[11px] text-slate-400 text-center py-2">كن أول من يضيف تعليقاً علمياً أو رداً.</p>
                      ) : (
                        <div className="space-y-2">
                          {post.comments.map(c => {
                            const canDeleteComment = c.author_id === currentUserId || currentRole === 'admin';
                            return (
                              <div key={c.id} className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setInspectMemberId(c.author_id)}
                                    className="font-bold text-slate-900 hover:text-[#1677c7] cursor-pointer"
                                  >
                                    {c.author_name}
                                  </button>
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400 shrink-0">
                                    <span>{formatRelativeTime(c.created_at)}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleQuickReply(post.id, c.author_name)}
                                      title="رد"
                                      className="text-slate-400 hover:text-[#1677c7] cursor-pointer"
                                    >
                                      <Reply className="w-3.5 h-3.5" />
                                    </button>
                                    {canDeleteComment && (
                                      confirmDeleteCommentId === c.id ? (
                                        <button
                                          type="button"
                                          onClick={async () => {
                                            setConfirmDeleteCommentId(null);
                                            await onDeleteComment(c.id);
                                          }}
                                          className="text-rose-600 font-bold cursor-pointer"
                                        >
                                          تأكيد
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => setConfirmDeleteCommentId(c.id)}
                                          title="حذف التعليق"
                                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      )
                                    )}
                                    {c.author_id !== currentUserId && (
                                      <button
                                        type="button"
                                        onClick={() => onReport({ type: 'comment', id: c.id, label: 'تعليق', snapshot: c.body.slice(0, 200) })}
                                        title="إبلاغ عن التعليق"
                                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                                      >
                                        <Flag className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{c.body}</p>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          handleSendComment(post.id);
                        }}
                        className="flex gap-2"
                      >
                        <input
                          ref={el => { commentRefs.current[post.id] = el; }}
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="اكتب تعليقك أو ردك..."
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
                        />
                        <button
                          type="submit"
                          className="min-h-[38px] px-4 bg-[#1677c7] hover:bg-[#125fa0] text-white rounded-xl text-xs font-bold cursor-pointer shrink-0"
                        >
                          إرسال
                        </button>
                      </form>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
