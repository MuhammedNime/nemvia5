import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Send,
  Paperclip,
  FileText,
  Image as ImageIcon,
  Download,
  Users,
  User,
  FolderLock,
  Search,
  Plus,
  X,
  Check,
  Code2,
  CheckCheck,
  ShieldCheck,
  Flag,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { AppRole, ChatAttachment, DirectMessage, ClassItem, ContactInfo } from '../../types';
import { UploadedFile } from '../../lib/api';
import type { ReportTarget } from '../ReportModal';

interface MessagesViewProps {
  currentUserId: string;
  currentUserName: string;
  currentRole: AppRole;
  messages: DirectMessage[];
  onSendMessage: (msg: DirectMessage) => void;
  groups: ClassItem[];
  contacts: ContactInfo[];
  onCreateGroup: (c: ClassItem) => void;
  onSearchContacts: (q: string) => Promise<ContactInfo[]>;
  onUpload: (f: File, folder: string) => Promise<UploadedFile>;
  onReport: (t: ReportTarget) => void;
  onMarkRead: (ids: string[]) => void;
  initialPeerId?: string | null;
  onClearInitialPeer?: () => void;
}

interface ConversationThread {
  id: string;
  type: 'group' | 'dm';
  title: string;
  subtitle: string;
  avatarText: string;
  membersCount?: number;
  unreadCount: number;
  lastMessage?: DirectMessage;
  lastTimestamp: number;
}

function formatThreadTime(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('ar', { day: 'numeric', month: 'short' });
}

function formatDayLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === now.toDateString()) return 'اليوم';
  if (d.toDateString() === yesterday.toDateString()) return 'أمس';
  return d.toLocaleDateString('ar', { weekday: 'short', day: 'numeric', month: 'long' });
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  currentUserId,
  currentUserName,
  currentRole,
  messages,
  onSendMessage,
  groups,
  contacts: contactProps,
  onCreateGroup,
  onSearchContacts,
  onUpload,
  onReport,
  onMarkRead,
  initialPeerId,
  onClearInitialPeer,
}) => {
  const [activeTargetId, setActiveTargetId] = useState<string>(initialPeerId || groups[0]?.id || '');
  const [activeTargetType, setActiveTargetType] = useState<'group' | 'dm'>(
    initialPeerId ? 'dm' : groups.length ? 'group' : 'dm',
  );
  // Mobile drill-down pane: 'list' shows only conversations; 'chat' shows only the opened thread
  const [mobilePane, setMobilePane] = useState<'list' | 'chat'>(initialPeerId ? 'chat' : 'list');
  const [listFilter, setListFilter] = useState<'all' | 'group' | 'dm'>('all');

  useEffect(() => {
    if (initialPeerId) {
      setActiveTargetType('dm');
      setActiveTargetId(initialPeerId);
      setMobilePane('chat');
      onClearInitialPeer?.();
    }
  }, [initialPeerId, onClearInitialPeer]);

  const [contactQuery, setContactQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ContactInfo[] | null>(null);
  const [uploading, setUploading] = useState(false);

  // Vault Drawer state
  const [showFilesVault, setShowFilesVault] = useState(false);
  const [vaultFilter, setVaultFilter] = useState<'all' | 'pdf' | 'image' | 'code'>('all');
  const [vaultSearch, setVaultSearch] = useState('');

  // Composer state
  const [inputText, setInputText] = useState('');
  const [pendingFile, setPendingFile] = useState<ChatAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // New Group Modal
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  const roleLabel = (r: AppRole) => (r === 'teacher' ? 'معلم' : r === 'admin' ? 'الإدارة' : 'طالب');

  useEffect(() => {
    if (!contactQuery.trim()) {
      setSearchResults(null);
      return;
    }
    const t = setTimeout(async () => setSearchResults(await onSearchContacts(contactQuery)), 280);
    return () => clearTimeout(t);
  }, [contactQuery, onSearchContacts]);

  // Merge contacts from props + anyone we exchanged DMs with
  const mergedContacts = useMemo(() => {
    const map = new Map<string, ContactInfo>();
    contactProps.forEach(c => map.set(c.id, c));
    messages.forEach(m => {
      if (m.channel_id) return;
      const otherId = m.sender_id === currentUserId ? m.recipient_id : m.sender_id;
      const otherName = m.sender_id === currentUserId ? m.recipient_name : m.sender_name;
      const otherRole = m.sender_id === currentUserId ? 'student' : m.sender_role;
      if (otherId && !map.has(otherId)) {
        map.set(otherId, { id: otherId, name: otherName || 'مستخدم', role: (otherRole as AppRole) || 'student' });
      }
    });
    return searchResults ?? Array.from(map.values());
  }, [contactProps, messages, currentUserId, searchResults]);

  // Build unified, activity-sorted conversation list
  const threads: ConversationThread[] = useMemo(() => {
    const q = contactQuery.trim().toLowerCase();

    const groupThreads: ConversationThread[] = groups
      .filter(g => !q || g.title.toLowerCase().includes(q) || (g.subject || '').toLowerCase().includes(q))
      .map(c => {
        const grpMsgs = messages.filter(m => m.channel_id === c.id || m.recipient_id === c.id);
        const lastMessage = grpMsgs[grpMsgs.length - 1];
        const lastTimestamp = lastMessage ? new Date(lastMessage.created_at).getTime() : 0;
        return {
          id: c.id,
          type: 'group',
          title: c.title,
          subtitle: c.class_type === 'study' ? 'مجموعة دراسة' : `صف · ${c.members_count} عضو`,
          avatarText: c.class_type === 'study' ? '📚' : '🎓',
          membersCount: c.members_count,
          unreadCount: 0,
          lastMessage,
          lastTimestamp,
        };
      });

    const dmThreads: ConversationThread[] = mergedContacts
      .filter(c => c.id !== currentUserId)
      .filter(c => !q || c.name.toLowerCase().includes(q))
      .map(c => {
        const dmMsgs = messages.filter(
          m =>
            !m.channel_id &&
            ((m.sender_id === currentUserId && m.recipient_id === c.id) ||
              (m.sender_id === c.id && m.recipient_id === currentUserId)),
        );
        const lastMessage = dmMsgs[dmMsgs.length - 1];
        const lastTimestamp = lastMessage ? new Date(lastMessage.created_at).getTime() : 0;
        const unreadCount = dmMsgs.filter(m => m.sender_id === c.id && m.recipient_id === currentUserId && !m.read_at).length;
        return {
          id: c.id,
          type: 'dm',
          title: c.name,
          subtitle: roleLabel(c.role),
          avatarText: c.name.slice(0, 1),
          unreadCount,
          lastMessage,
          lastTimestamp,
        };
      });

    const combined =
      listFilter === 'group'
        ? groupThreads
        : listFilter === 'dm'
          ? dmThreads
          : [...dmThreads, ...groupThreads];

    return combined.sort((a, b) => {
      if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount;
      if (b.lastTimestamp !== a.lastTimestamp) return b.lastTimestamp - a.lastTimestamp;
      return a.title.localeCompare(b.title, 'ar');
    });
  }, [groups, mergedContacts, messages, currentUserId, contactQuery, listFilter]);

  const activeThread = useMemo(
    () =>
      threads.find(t => t.id === activeTargetId && t.type === activeTargetType) ||
      (activeTargetType === 'group'
        ? groups.find(g => g.id === activeTargetId)
          ? {
              id: activeTargetId,
              type: 'group' as const,
              title: groups.find(g => g.id === activeTargetId)!.title,
              subtitle: `${groups.find(g => g.id === activeTargetId)!.members_count} عضواً`,
              avatarText: '🎓',
              unreadCount: 0,
              lastTimestamp: 0,
            }
          : null
        : mergedContacts.find(c => c.id === activeTargetId)
          ? {
              id: activeTargetId,
              type: 'dm' as const,
              title: mergedContacts.find(c => c.id === activeTargetId)!.name,
              subtitle: roleLabel(mergedContacts.find(c => c.id === activeTargetId)!.role),
              avatarText: mergedContacts.find(c => c.id === activeTargetId)!.name.slice(0, 1),
              unreadCount: 0,
              lastTimestamp: 0,
            }
          : null),
    [threads, activeTargetId, activeTargetType, groups, mergedContacts],
  );

  // If no target selected on desktop yet, pick top thread once available
  useEffect(() => {
    if (!activeTargetId && threads.length > 0) {
      setActiveTargetId(threads[0].id);
      setActiveTargetType(threads[0].type);
    }
  }, [activeTargetId, threads]);

  const activeTitle = activeThread?.title || 'اختر محادثة';
  const activeSubtitle = activeThread?.subtitle || 'ابدأ التواصل مع معلميك وزملائك';

  // Mark incoming unread messages in opened DM as read
  const unreadIds = useMemo(
    () =>
      activeTargetType === 'dm' && activeTargetId && (mobilePane === 'chat' || (typeof window !== 'undefined' && window.innerWidth >= 768))
        ? messages
            .filter(m => !m.channel_id && m.sender_id === activeTargetId && m.recipient_id === currentUserId && !m.read_at)
            .map(m => m.id)
        : [],
    [messages, activeTargetType, activeTargetId, currentUserId, mobilePane],
  );

  useEffect(() => {
    if (unreadIds.length) onMarkRead(unreadIds);
  }, [unreadIds.join(',')]);

  const currentMessages = useMemo(
    () =>
      messages.filter(m => {
        if (!activeTargetId) return false;
        if (activeTargetType === 'group') {
          return m.channel_id === activeTargetId || m.recipient_id === activeTargetId;
        }
        return (
          !m.channel_id &&
          ((m.sender_id === currentUserId && m.recipient_id === activeTargetId) ||
            (m.sender_id === activeTargetId && m.recipient_id === currentUserId))
        );
      }),
    [messages, activeTargetId, activeTargetType, currentUserId],
  );

  // Auto-scroll to latest message on conversation switch or new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTargetId, activeTargetType, currentMessages.length, mobilePane]);

  const conversationFiles: ChatAttachment[] = currentMessages
    .filter(m => Boolean(m.attachment))
    .map(m => m.attachment as ChatAttachment);

  const filteredVaultFiles = conversationFiles.filter(f => {
    if (vaultFilter !== 'all' && f.type !== vaultFilter) return false;
    if (vaultSearch.trim() && !f.name.toLowerCase().includes(vaultSearch.toLowerCase())) return false;
    return true;
  });

  const totalUnread = useMemo(
    () => messages.filter(m => !m.channel_id && m.recipient_id === currentUserId && !m.read_at).length,
    [messages, currentUserId],
  );

  const openThread = (thread: ConversationThread) => {
    setActiveTargetId(thread.id);
    setActiveTargetType(thread.type);
    setShowFilesVault(false);
    setMobilePane('chat');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const up = await onUpload(file, 'chat');
      setPendingFile({
        id: `att-${Date.now()}`,
        name: up.name,
        size: up.size,
        type: up.type,
        url: up.url,
        uploaded_by: currentUserName,
        uploaded_at: new Date().toISOString(),
      });
    } catch {
      /* toast handled upstream */
    }
    setUploading(false);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTargetId) return;
    if (!inputText.trim() && !pendingFile) return;

    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      sender_id: currentUserId,
      sender_name: currentUserName,
      sender_role: currentRole,
      recipient_id: activeTargetId,
      recipient_name: activeTitle,
      channel_id: activeTargetType === 'group' ? activeTargetId : undefined,
      body: inputText.trim() || (pendingFile ? `أرفق ملفاً: ${pendingFile.name}` : ''),
      attachment: pendingFile || undefined,
      reactions: {},
      created_at: new Date().toISOString(),
    };

    onSendMessage(newMsg);
    setInputText('');
    setPendingFile(null);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    onCreateGroup({
      id: 'new',
      teacher_id: currentUserId,
      teacher_name: currentUserName,
      title: newGroupName.trim(),
      subject: '',
      grade_level: '',
      join_code: '',
      class_type: 'study',
      is_archived: false,
      members_count: 1,
      description: newGroupDesc.trim() || 'مجموعة دراسية نشطة لمشاركة الأفكار والملفات.',
      colorTheme: 'blue',
      created_at: new Date().toISOString(),
    });
    setShowNewGroupModal(false);
    setNewGroupName('');
    setNewGroupDesc('');
  };

  return (
    <div className="animate-in fade-in">
      {/* Main Clean Split Workspace */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col md:flex-row h-[calc(100dvh-10.5rem)] md:h-[calc(100dvh-7.5rem)] min-h-[500px]">
        {/* ======================== PANE 1: CONVERSATIONS LIST ======================== */}
        <aside
          className={`${
            mobilePane === 'list' ? 'flex' : 'hidden md:flex'
          } w-full md:w-80 lg:w-96 md:border-l border-slate-200 bg-white flex-col shrink-0 min-h-0 flex-1 md:flex-initial`}
        >
          {/* List Header */}
          <div className="p-4 border-b border-slate-200 space-y-3 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="font-black text-slate-900 text-base whitespace-nowrap">المحادثات</h2>
                {totalUnread > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-black tabular-nums">
                    {totalUnread}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowNewGroupModal(true)}
                className="min-h-[38px] px-3 py-1.5 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl text-xs inline-flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>مجموعة جديدة</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={contactQuery}
                onChange={e => setContactQuery(e.target.value)}
                placeholder="ابحث عن شخص أو مجموعة..."
                className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
              />
            </div>

            {/* Clean Segmented Filter Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'dm', label: 'الأفراد' },
                { id: 'group', label: 'المجموعات' },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setListFilter(tab.id as any)}
                  className={`min-h-[36px] py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    listFilter === tab.id ? 'bg-white text-[#1677c7] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {threads.length === 0 ? (
              <div className="p-8 text-center space-y-2 text-slate-400 text-xs">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-bold text-slate-600">لا توجد محادثات مطابقة</p>
                <p>جرّب البحث باسم آخر أو أنشئ مجموعة دراسة جديدة.</p>
              </div>
            ) : (
              threads.map(thread => {
                const isSelected = activeTargetId === thread.id && activeTargetType === thread.type;
                const previewText = thread.lastMessage
                  ? thread.lastMessage.sender_id === currentUserId
                    ? `أنت: ${thread.lastMessage.body}`
                    : thread.type === 'group'
                      ? `${thread.lastMessage.sender_name}: ${thread.lastMessage.body}`
                      : thread.lastMessage.body
                  : thread.subtitle;

                return (
                  <button
                    key={`${thread.type}:${thread.id}`}
                    type="button"
                    onClick={() => openThread(thread)}
                    className={`w-full min-h-[68px] px-4 py-3 text-right transition-colors flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 md:border-r-2 md:border-r-[#1677c7]'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                        thread.type === 'group'
                          ? 'bg-sky-50 border border-sky-200 text-lg'
                          : 'bg-[#0f233a] text-white'
                      }`}
                    >
                      {thread.avatarText}
                    </div>

                    {/* Title + Last Preview */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs sm:text-sm truncate ${thread.unreadCount > 0 ? 'font-black text-slate-900' : 'font-bold text-slate-800'}`}>
                          {thread.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 tabular-nums">
                          {formatThreadTime(thread.lastMessage?.created_at)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs truncate ${thread.unreadCount > 0 ? 'font-bold text-slate-700' : 'text-slate-500'}`}>
                          {previewText}
                        </span>
                        {thread.unreadCount > 0 ? (
                          <span className="min-w-5 h-5 px-1.5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 tabular-nums">
                            {thread.unreadCount}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {thread.type === 'group' ? 'مجموعة' : 'فردي'}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ======================== PANE 2: ACTIVE CHAT THREAD ======================== */}
        <section
          className={`${
            mobilePane === 'chat' ? 'flex' : 'hidden md:flex'
          } flex-1 flex-col min-w-0 min-h-0 bg-slate-50/40 relative`}
        >
          {!activeThread ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#1677c7] flex items-center justify-center">
                <MessageSquare className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-slate-900 text-base">اختر محادثة أو مجموعة للبدء</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  اضغط على أي اسم أو مجموعة من القائمة لفتح سجل الرسائل والملفات الخاصة بها.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Thread Top Bar with Dedicated Mobile Back Button */}
              <div className="px-3 sm:px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFilesVault(false);
                      setMobilePane('list');
                    }}
                    className="md:hidden min-h-[44px] min-w-[44px] -mr-1 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center justify-center cursor-pointer shrink-0"
                    aria-label="العودة للمحادثات"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                      activeThread.type === 'group'
                        ? 'bg-sky-50 border border-sky-200 text-lg'
                        : 'bg-[#0f233a] text-white'
                    }`}
                  >
                    {activeThread.avatarText}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-black text-slate-900 text-sm truncate">{activeTitle}</h3>
                    <p className="text-[11px] text-slate-500 truncate">{activeSubtitle}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFilesVault(v => !v)}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    showFilesVault
                      ? 'bg-[#1677c7] text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  title="عرض الملفات المتبادلة في هذه المحادثة"
                >
                  <FolderLock className="w-4 h-4" />
                  <span className="hidden sm:inline">خزينة الملفات</span>
                  <span className="tabular-nums">({conversationFiles.length})</span>
                </button>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 min-h-0">
                {currentMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#1677c7] flex items-center justify-center">
                      {activeThread.type === 'group' ? <Users className="w-6 h-6" /> : <User className="w-6 h-6" />}
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">لا توجد رسائل بعد مع {activeTitle}</h4>
                    <p className="text-xs text-slate-500 max-w-xs">
                      اكتب رسالتك الأولى في الأسفل أو أرفق ملفاً لمشاركته فوراً.
                    </p>
                  </div>
                ) : (
                  currentMessages.map((msg, idx) => {
                    const isMine = msg.sender_id === currentUserId;
                    const isTeacher = msg.sender_role === 'teacher';
                    const isAdmin = msg.sender_role === 'admin';
                    const dayLbl = formatDayLabel(msg.created_at);
                    const prevDayLbl = idx > 0 ? formatDayLabel(currentMessages[idx - 1].created_at) : '';
                    const showDayDivider = idx === 0 || dayLbl !== prevDayLbl;

                    return (
                      <React.Fragment key={msg.id}>
                        {showDayDivider && dayLbl && (
                          <div className="flex justify-center py-1">
                            <span className="px-3 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-500">
                              {dayLbl}
                            </span>
                          </div>
                        )}

                        <div
                          className={`flex flex-col ${isMine ? 'items-end mr-auto' : 'items-start ml-auto'} space-y-1 max-w-[85%] sm:max-w-lg`}
                        >
                          {/* Sender Meta */}
                          <div className="flex items-center gap-1.5 px-1 text-[11px]">
                            {!isMine && (
                              <span className="font-bold text-slate-700">{msg.sender_name}</span>
                            )}
                            {!isMine && isAdmin && (
                              <span className="text-indigo-700 text-[10px] font-bold inline-flex items-center gap-0.5">
                                <ShieldCheck className="w-3 h-3" />
                                <span>الإدارة</span>
                              </span>
                            )}
                            {!isMine && isTeacher && (
                              <span className="text-amber-700 text-[10px] font-bold">· معلم</span>
                            )}
                            <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                              {new Date(msg.created_at).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMine && !msg.channel_id && (
                              <span className={msg.read_at ? 'text-[#1677c7]' : 'text-slate-400'} title={msg.read_at ? 'تمت القراءة' : 'تم الإرسال'}>
                                {msg.read_at ? <CheckCheck className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                              </span>
                            )}
                            {!isMine && !msg.channel_id && (
                              <button
                                type="button"
                                onClick={() => onReport({ type: 'message', id: msg.id, label: 'رسالة', snapshot: msg.body.slice(0, 200) })}
                                title="إبلاغ عن الرسالة"
                                className="text-slate-400 hover:text-rose-600 cursor-pointer p-0.5"
                              >
                                <Flag className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {/* Message Bubble */}
                          <div
                            className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm space-y-2 leading-relaxed ${
                              isMine
                                ? 'bg-[#1677c7] text-white rounded-tl-xs'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-tr-xs'
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{msg.body}</p>

                            {msg.attachment && (
                              <div
                                className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                                  isMine
                                    ? 'bg-white/10 border-white/20 text-white'
                                    : 'bg-slate-50 border-slate-200 text-slate-900'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center shrink-0">
                                    {msg.attachment.type === 'image' && <ImageIcon className="w-4 h-4 text-emerald-500" />}
                                    {msg.attachment.type === 'pdf' && <FileText className="w-4 h-4 text-rose-500" />}
                                    {msg.attachment.type === 'code' && <Code2 className="w-4 h-4 text-amber-500" />}
                                    {msg.attachment.type === 'doc' && <FileText className="w-4 h-4 text-sky-500" />}
                                  </div>
                                  <div className="min-w-0">
                                    <span className="font-bold text-xs truncate block">{msg.attachment.name}</span>
                                    <span className="text-[10px] opacity-75 block">{msg.attachment.size}</span>
                                  </div>
                                </div>

                                <a
                                  href={msg.attachment.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  download={msg.attachment.name}
                                  className={`p-2 rounded-lg transition-colors shrink-0 ${
                                    isMine ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-200 text-[#1677c7]'
                                  }`}
                                  title="تحميل / فتح الملف"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Pending File Attachment Preview */}
              {pendingFile && (
                <div className="px-4 py-2.5 bg-sky-50 border-t border-sky-200 flex items-center justify-between text-xs shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-[#1677c7] shrink-0" />
                    <span className="font-bold text-slate-800 truncate">{pendingFile.name}</span>
                    <span className="text-[10px] text-slate-500 shrink-0">({pendingFile.size})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPendingFile(null)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 cursor-pointer shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Message Composer */}
              <form onSubmit={handleSend} className="p-2.5 sm:p-3.5 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*,.pdf,.doc,.docx,.txt,.ts,.js,.py"
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="إرفاق ملف أو صورة"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder={`اكتب رسالتك إلى ${activeTitle}...`}
                  className="flex-1 min-h-[44px] px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#1677c7]"
                />

                <button
                  type="submit"
                  disabled={uploading || (!inputText.trim() && !pendingFile)}
                  className="min-h-[44px] px-4 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">إرسال</span>
                </button>
              </form>
            </>
          )}
        </section>

        {/* ======================== PANE 3: FILES VAULT DRAWER ======================== */}
        {showFilesVault && activeThread && (
          <aside className="fixed inset-0 z-50 md:static md:z-auto md:w-80 border-r border-slate-200 bg-white md:bg-slate-50 flex flex-col shrink-0 animate-in fade-in">
            <div className="p-4 border-b border-slate-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderLock className="w-4 h-4 text-[#1677c7]" />
                  <span className="font-black text-slate-900 text-xs">ملفات {activeTitle}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilesVault(false)}
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={vaultSearch}
                  onChange={e => setVaultSearch(e.target.value)}
                  placeholder="بحث في الملفات..."
                  className="w-full pr-8 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'pdf', label: 'PDF' },
                  { id: 'image', label: 'صور' },
                  { id: 'code', label: 'كود' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setVaultFilter(tab.id as any)}
                    className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      vaultFilter === tab.id ? 'bg-white text-[#1677c7] shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {filteredVaultFiles.length > 0 ? (
                filteredVaultFiles.map(file => (
                  <div
                    key={file.id}
                    className="p-3 bg-white rounded-2xl border border-slate-200 space-y-2 hover:border-[#1677c7] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#1677c7] flex items-center justify-center shrink-0">
                          {file.type === 'pdf' && <FileText className="w-4 h-4 text-rose-500" />}
                          {file.type === 'image' && <ImageIcon className="w-4 h-4 text-emerald-500" />}
                          {file.type === 'code' && <Code2 className="w-4 h-4 text-amber-500" />}
                          {file.type === 'doc' && <FileText className="w-4 h-4 text-sky-500" />}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-slate-900 block truncate" title={file.name}>
                            {file.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">{file.size}</span>
                        </div>
                      </div>

                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        download={file.name}
                        className="p-2 bg-slate-100 hover:bg-[#1677c7] hover:text-white text-slate-600 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="تحميل الملف"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{file.uploaded_by}</span>
                      <span>{new Date(file.uploaded_at).toLocaleDateString('ar')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs space-y-1">
                  <FolderLock className="w-8 h-8 mx-auto text-slate-300" />
                  <p>لا توجد ملفات مطابقة في هذه المحادثة</p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* CREATE NEW STUDY GROUP MODAL */}
      {showNewGroupModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setShowNewGroupModal(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-xs animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-[#1677c7] flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">إنشاء مجموعة دراسية جديدة</h3>
              </div>
              <button type="button" onClick={() => setShowNewGroupModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المجموعة الدراسية:</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  placeholder="مثال: نادي الرياضيات المتقدمة، حلقة اللغة العربية..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">وصف المجموعة والهدف منها:</label>
                <textarea
                  value={newGroupDesc}
                  onChange={e => setNewGroupDesc(e.target.value)}
                  placeholder="شرح بسيط لما ستناقشه هذه المجموعة وكيف ستساعد الطلاب..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] min-h-[70px]"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] py-2.5 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>إنشاء وتفعيل المجموعة فوراً</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
