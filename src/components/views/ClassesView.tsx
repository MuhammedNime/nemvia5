import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Building2,
  Landmark,
  Plus,
  Share2,
  Copy,
  Check,
  X,
  Search,
  QrCode,
  Download,
  Trophy,
  Flame,
  Award,
  FolderOpen,
} from 'lucide-react';
import QRCode from 'qrcode';
import {
  AppRole,
  Assignment,
  ClassItem,
  ClassMemberInfo,
  ContactInfo,
  DirectMessage,
  MinistryItem,
  Quiz,
  SchoolItem,
} from '../../types';
import { InstitutionsView } from './InstitutionsView';
import { ClassLibraryTab } from './ClassLibraryTab';
import { UploadedFile } from '../../lib/api';
import { getApiBaseUrl, isNativeApp, shareAppLink } from '../../lib/native';

interface ClassesViewProps {
  currentRole: AppRole;
  currentUserId: string;
  currentUserName: string;
  classes: ClassItem[];
  schools?: SchoolItem[];
  ministries?: MinistryItem[];
  quizzes?: Quiz[];
  assignments?: Assignment[];
  messages?: DirectMessage[];
  myOrgIds?: string[];
  myClassIds?: string[];
  orgMembers?: ClassMemberInfo[];
  initialTab?: 'classes' | 'schools' | 'ministries';
  onAddClass: (cls: ClassItem) => void;
  onJoinClass: (joinCode: string) => Promise<boolean>;
  members: ClassMemberInfo[];
  onLeaveClass: (classId: string) => void;
  onDeleteClass: (classId: string) => void;
  onArchiveClass: (classId: string, archived: boolean) => void;
  onRemoveMember: (classId: string, userId: string) => void;
  contacts?: ContactInfo[];
  currentUserPoints?: number;
  currentUserStreak?: number;
  onUpload?: (file: File, folder: string) => Promise<UploadedFile>;
  onCreateMinistry?: (m: { name: string; region: string; description: string; colorTheme?: string }) => Promise<boolean>;
  onCreateSchool?: (s: { name: string; stage: string; region: string; description: string; ministry_id?: string; colorTheme?: string }) => Promise<boolean>;
  onLinkSchoolToMinistry?: (school: SchoolItem, ministryId: string) => Promise<boolean>;
  onLinkClassToSchool?: (cls: ClassItem, schoolId: string) => Promise<boolean>;
  onSendDirective?: (orgId: string, orgName: string, body: string) => Promise<boolean>;
  onRemoveOrgMember?: (orgId: string, userId: string) => Promise<boolean>;
  onLeaveOrg?: (orgId: string) => Promise<boolean>;
  onDeleteOrg?: (orgId: string) => Promise<boolean>;
}

export const ClassesView: React.FC<ClassesViewProps> = ({
  currentRole,
  currentUserId,
  currentUserName,
  classes,
  schools = [],
  ministries = [],
  quizzes = [],
  assignments = [],
  messages = [],
  myOrgIds = [],
  myClassIds = [],
  orgMembers = [],
  initialTab = 'classes',
  onAddClass,
  onJoinClass,
  members,
  onLeaveClass,
  onDeleteClass,
  onArchiveClass,
  onRemoveMember,
  contacts = [],
  currentUserPoints = 0,
  currentUserStreak = 0,
  onUpload,
  onCreateMinistry = async () => false,
  onCreateSchool = async () => false,
  onLinkSchoolToMinistry = async () => false,
  onLinkClassToSchool = async () => false,
  onSendDirective = async () => false,
  onRemoveOrgMember = async () => false,
  onLeaveOrg = async () => false,
  onDeleteOrg = async () => false,
}) => {
  const [spaceTab, setSpaceTab] = useState<'classes' | 'schools' | 'ministries'>(initialTab);
  useEffect(() => {
    setSpaceTab(initialTab);
  }, [initialTab]);

  const [filterType, setFilterType] = useState<'all' | 'class' | 'study'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newSchoolId, setNewSchoolId] = useState('');
  
  // Create Class Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newGrade, setNewGrade] = useState('الصف التاسع');
  const [newType, setNewType] = useState<'class' | 'study'>('study');
  const [newDescription, setNewDescription] = useState('');
  const [newTheme, setNewTheme] = useState('from-blue-600 to-indigo-700');

  // Join Code Modal
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinResult, setJoinResult] = useState<{ success: boolean; msg: string } | null>(null);

  // Copy Code Feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Class Detail Modal
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'library'>('overview');

  const openClassDetail = (cls: ClassItem, tab: 'overview' | 'library' = 'overview') => {
    setDetailTab(tab);
    setSelectedClass(cls);
  };

  // QR Join Code Modal
  const [qrModal, setQrModal] = useState<{ cls: ClassItem; dataUrl: string; joinUrl: string } | null>(null);

  const filteredClasses = classes.filter(c => {
    const matchesFilter = filterType === 'all' || c.class_type === filterType;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const resolvePublicAppUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return !isNativeApp() && origin.startsWith('http') ? origin : getApiBaseUrl() || origin || 'https://nemvia-app.onrender.com';
  };

  const handleShareInvite = (cls: ClassItem) => {
    const appUrl = resolvePublicAppUrl();
    const joinUrl = `${appUrl}/?join=${encodeURIComponent(cls.join_code)}`;
    void shareAppLink(
      `دعوة للانضمام إلى ${cls.title} — NEMVIA`,
      `انضم إلى "${cls.title}" (${cls.subject}) على منصة NEMVIA باستخدام الرمز: ${cls.join_code}`,
      joinUrl,
    );
  };

  const handleOpenQrModal = async (cls: ClassItem) => {
    const joinUrl = `${resolvePublicAppUrl()}/?join=${encodeURIComponent(cls.join_code)}`;
    try {
      const dataUrl = await QRCode.toDataURL(joinUrl, {
        width: 300,
        margin: 2,
        color: { dark: '#0f233a', light: '#ffffff' },
      });
      setQrModal({ cls, dataUrl, joinUrl });
    } catch {
      /* ignore */
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const randomCode = 'NEM' + Math.floor(1000 + Math.random() * 9000);
    const newClass: ClassItem = {
      id: `cls-${Date.now()}`,
      teacher_id: currentUserId,
      teacher_name: currentUserName,
      school_id: newSchoolId || undefined,
      title: newTitle.trim(),
      subject: newSubject.trim() || 'عام',
      grade_level: newGrade,
      join_code: randomCode,
      description: newDescription.trim() || 'مساحة دراسية تفاعلية مخصصة للنقاش وحل الواجبات والمذاكرة الجماعية.',
      class_type: newType,
      is_archived: false,
      members_count: 1,
      colorTheme: newTheme,
      created_at: new Date().toISOString(),
    };
    onAddClass(newClass);
    setShowCreateModal(false);
    setNewTitle('');
    setNewSubject('');
    setNewDescription('');
    setNewSchoolId('');
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    const ok = await onJoinClass(joinCode.trim().toUpperCase());
    if (ok) {
      setJoinResult({ success: true, msg: 'تم الانضمام للصف بنجاح!' });
      setTimeout(() => {
        setJoinResult(null);
        setShowJoinModal(false);
        setJoinCode('');
      }, 1500);
    } else {
      setJoinResult({ success: false, msg: 'رمز الانضمام غير صحيح، يرجى التأكد منه.' });
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in">
      {/* Hierarchy Switcher: Classes / Schools / Ministries */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-1.5 text-xs font-bold">
        <button
          type="button"
          onClick={() => setSpaceTab('classes')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
            spaceTab === 'classes' ? 'bg-[#1677c7] text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>الصفوف والمجموعات ({classes.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setSpaceTab('schools')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
            spaceTab === 'schools' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>المدارس والمعاهد ({schools.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setSpaceTab('ministries')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
            spaceTab === 'ministries' ? 'bg-[#0f233a] text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>الوزارات والمجمعات ({ministries.length})</span>
        </button>
      </div>

      {spaceTab !== 'classes' ? (
        <InstitutionsView
          mode={spaceTab}
          currentRole={currentRole}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          ministries={ministries}
          schools={schools}
          classes={classes}
          quizzes={quizzes}
          assignments={assignments}
          messages={messages}
          myOrgIds={myOrgIds}
          orgMembers={orgMembers}
          onCreateMinistry={onCreateMinistry}
          onCreateSchool={onCreateSchool}
          onJoinByCode={onJoinClass}
          onLinkSchoolToMinistry={onLinkSchoolToMinistry}
          onLinkClassToSchool={onLinkClassToSchool}
          onCreateClassForSchool={onAddClass}
          onSendDirective={onSendDirective}
          onRemoveMember={onRemoveOrgMember}
          onLeaveOrg={onLeaveOrg}
          onDeleteOrg={onDeleteOrg}
        />
      ) : (
        <>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">الصفوف ومجموعات الدراسة الأكاديمية</h2>
          <p className="text-xs text-slate-500">
            انضم لمساحات التعلم المنظمة، شارك في مجموعات الدراسة التعاونية، وتابع واجباتك
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-[#1677c7] font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>الانضمام برمز الدعوة</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء صف / مجموعة جديدة</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterType === 'all' ? 'bg-white text-[#1677c7] shadow-xs' : 'text-slate-600'
            }`}
          >
            الكل ({classes.length})
          </button>
          <button
            onClick={() => setFilterType('class')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterType === 'class' ? 'bg-white text-[#1677c7] shadow-xs' : 'text-slate-600'
            }`}
          >
            صفوف تعليمية رسمية
          </button>
          <button
            onClick={() => setFilterType('study')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterType === 'study' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            مجموعات دراسة تعاونية
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ابحث عن صف أو مادة..."
            className="w-full pr-8 pl-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-xs"
          />
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#1677c7] transition-all flex flex-col justify-between"
          >
            {/* Header with color gradient */}
            <div className={`p-5 bg-gradient-to-r ${cls.colorTheme} text-white space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                  {cls.class_type === 'study' ? 'مجموعة دراسة طلابية' : 'صف تعليمي رسمي'}
                </span>
                <span className="text-[11px] text-white/80 font-mono">{cls.grade_level}</span>
              </div>
              <h3 className="font-extrabold text-base leading-snug line-clamp-1">{cls.title}</h3>
              <span className="text-xs text-white/80 block">المادة: {cls.subject}</span>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between text-xs">
              <p className="text-slate-600 leading-relaxed line-clamp-2">
                {cls.description}
              </p>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                {cls.school_id && (() => {
                  const sc = schools.find(s => s.id === cls.school_id);
                  if (!sc) return null;
                  return (
                    <div className="flex items-center justify-between text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold">
                      <span className="flex items-center gap-1 truncate"><Building2 className="w-3.5 h-3.5 shrink-0" /> {sc.name}</span>
                    </div>
                  );
                })()}
                <div className="flex items-center justify-between text-slate-500">
                  <span>الأستاذ/المشرف:</span>
                  <span className="font-bold text-slate-800">{cls.teacher_name}</span>
                </div>

                <div className="flex items-center justify-between text-slate-500">
                  <span>الطلاب المسجلون:</span>
                  <span className="font-bold text-[#1677c7]">{cls.members_count} طالباً</span>
                </div>

                {/* Join Code Box */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">رمز الانضمام:</span>
                    <span className="font-mono font-black text-slate-900 text-sm tracking-wider">
                      {cls.join_code}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap justify-end">
                    <button
                      type="button"
                      onClick={() => void handleOpenQrModal(cls)}
                      className="px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-[#0f233a] font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                      title="عرض رمز الاستجابة السريعة QR للانضمام الفوري"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#1677c7]" />
                      <span>QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareInvite(cls)}
                      className="px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                      title="مشاركة دعوة الصف"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>مشاركة</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyCode(cls.join_code)}
                      className="px-2 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-[#1677c7] font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedCode === cls.join_code ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">تم</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>نسخ</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => openClassDetail(cls, 'overview')}
                    className="py-2 bg-slate-100 hover:bg-[#1677c7] hover:text-white text-slate-700 font-bold rounded-xl transition-all cursor-pointer text-center"
                  >
                    تفاصيل الصف
                  </button>
                  <button
                    type="button"
                    onClick={() => openClassDetail(cls, 'library')}
                    className="py-2 bg-sky-50 hover:bg-[#1677c7] hover:text-white text-[#1677c7] border border-sky-200 font-bold rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-1"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>مكتبة الملفات</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE CLASS MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#0f233a] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-base">إنشاء صف أو مجموعة دراسة جديدة</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-white/70 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم الصف أو المجموعة:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="مثال: مراجعة الفيزياء للشهادة الثانوية"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع المساحة:</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="study">مجموعة دراسة تعاونية</option>
                    <option value="class">صف تعليمي رسمي</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المادة الدراسية:</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    placeholder="الرياضيات، برمجة، لغات..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">المرحلة / الصف:</label>
                <input
                  type="text"
                  value={newGrade}
                  onChange={e => setNewGrade(e.target.value)}
                  placeholder="الصف التاسع، العاشر، جامعي..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              {schools.length > 0 && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ربط بمدرسة / معهد (اختياري):</label>
                  <select
                    value={newSchoolId}
                    onChange={e => setNewSchoolId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="">صف مستقل (غير مربوط بمدرسة)</option>
                    {schools.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.stage})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">الوصف وأهداف المساحة:</label>
                <textarea
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="اكتب أهداف المجموعة، مواعيد المذاكرة، أو تعليمات الطلاب..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none min-h-[70px]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1677c7] text-white font-bold rounded-xl cursor-pointer"
                >
                  إنشاء المساحة وتوليد رمز الانضمام
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JOIN CLASS MODAL */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#1677c7] text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                <span>الانضمام برمز الصف (Join Code)</span>
              </h3>
              <button onClick={() => setShowJoinModal(false)} className="text-white/70 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleJoinSubmit} className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                أدخل رمز الدعوة المكون من 6 إلى 8 أحرف المخصص للصف الدراسي.
              </p>

              <div>
                <input
                  type="text"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="مثال: MATH9X أو CODE2026"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center text-lg font-black tracking-widest uppercase outline-none focus:border-[#1677c7]"
                  required
                />
              </div>

              {joinResult && (
                <div className={`p-3 rounded-xl border text-xs font-bold ${
                  joinResult.success ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {joinResult.msg}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1677c7] text-white font-bold rounded-xl cursor-pointer"
                >
                  انضمام الآن
                </button>
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLASS DETAILS DRAWER / MODAL */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className={`p-6 bg-gradient-to-r ${selectedClass.colorTheme} text-white space-y-2 relative`}>
              <button
                onClick={() => setSelectedClass(null)}
                className="absolute top-4 left-4 p-1 rounded-full bg-black/20 text-white hover:bg-black/40 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
                {selectedClass.grade_level} · {selectedClass.subject}
              </span>
              <h3 className="text-xl font-black">{selectedClass.title}</h3>
              <p className="text-xs text-white/90 leading-relaxed">{selectedClass.description}</p>
            </div>

            {/* Detail Tab Switcher */}
            <div className="px-6 pt-3 pb-2 border-b border-slate-200 bg-slate-50/70 flex items-center gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setDetailTab('overview')}
                className={`flex-1 py-2 px-3 rounded-xl cursor-pointer transition-colors inline-flex items-center justify-center gap-1.5 ${
                  detailTab === 'overview'
                    ? 'bg-[#0f233a] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>نظرة عامة والأعضاء</span>
              </button>
              <button
                type="button"
                onClick={() => setDetailTab('library')}
                className={`flex-1 py-2 px-3 rounded-xl cursor-pointer transition-colors inline-flex items-center justify-center gap-1.5 ${
                  detailTab === 'library'
                    ? 'bg-[#1677c7] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-50'
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>مكتبة الملفات والملازم</span>
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {detailTab === 'library' ? (
                <ClassLibraryTab
                  cls={selectedClass}
                  currentUserId={currentUserId}
                  currentUserName={currentUserName}
                  currentRole={currentRole}
                  isClassMember={
                    myClassIds.includes(selectedClass.id) ||
                    members.some(m => m.class_id === selectedClass.id && m.user_id === currentUserId)
                  }
                  onUpload={onUpload}
                />
              ) : (
                <>
              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold">المعلم / المشرف</span>
                  <span className="font-bold text-sm text-slate-900">{selectedClass.teacher_name}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold">عدد الطلاب المسجلين</span>
                  <span className="font-bold text-sm text-[#1677c7]">{selectedClass.members_count} طالباً</span>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block">رمز مشاركة الصف:</span>
                  <span className="font-mono font-black text-base text-[#0f233a]">{selectedClass.join_code}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => void handleOpenQrModal(selectedClass)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-[#0f233a] font-bold rounded-lg cursor-pointer text-xs inline-flex items-center gap-1"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#1677c7]" />
                    <span>رمز QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShareInvite(selectedClass)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer text-xs inline-flex items-center gap-1"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>مشاركة الدعوة</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(selectedClass.join_code)}
                    className="px-3 py-1.5 bg-[#1677c7] text-white font-bold rounded-lg cursor-pointer text-xs"
                  >
                    {copiedCode === selectedClass.join_code ? 'تم النسخ ✓' : 'نسخ الرمز'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">معلومات الصف:</span>
                <div className="space-y-1.5">
                  <div className="p-2 bg-slate-50 rounded-lg flex items-center justify-between text-slate-700">
                    <span>المنشئ / المعلم</span>
                    <span className="font-bold">{selectedClass.teacher_name}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg flex items-center justify-between text-slate-700">
                    <span>عدد الأعضاء</span>
                    <span className="font-bold">{selectedClass.members_count}</span>
                  </div>
                  {selectedClass.is_archived && (
                    <div className="p-2 bg-amber-50 text-amber-800 rounded-lg font-bold">هذا الصف مؤرشف</div>
                  )}
                </div>
              </div>

              {/* Class Leaderboard & Weekly Achievements */}
              {(() => {
                const contactMap = new Map(contacts.map(c => [c.id, c]));
                const classRows = members.filter(m => m.class_id === selectedClass.id);
                const seen = new Set<string>();
                const entries = classRows
                  .filter(m => {
                    if (seen.has(m.user_id)) return false;
                    seen.add(m.user_id);
                    return true;
                  })
                  .map(m => {
                    const isMe = m.user_id === currentUserId;
                    const c = contactMap.get(m.user_id);
                    const points = isMe ? currentUserPoints : (c?.points ?? 0);
                    const streak = isMe ? currentUserStreak : (c?.streakDays ?? 0);
                    return {
                      user_id: m.user_id,
                      name: m.name || c?.name || 'عضو الصف',
                      avatar_url: c?.avatar_url,
                      isTeacher: m.user_id === selectedClass.teacher_id,
                      isMe,
                      points,
                      streak,
                    };
                  });

                if (!entries.some(e => e.user_id === selectedClass.teacher_id)) {
                  const tc = contactMap.get(selectedClass.teacher_id);
                  const isMeTeacher = selectedClass.teacher_id === currentUserId;
                  entries.push({
                    user_id: selectedClass.teacher_id,
                    name: selectedClass.teacher_name,
                    avatar_url: tc?.avatar_url,
                    isTeacher: true,
                    isMe: isMeTeacher,
                    points: isMeTeacher ? currentUserPoints : (tc?.points ?? 0),
                    streak: isMeTeacher ? currentUserStreak : (tc?.streakDays ?? 0),
                  });
                }

                const studentBoard = entries
                  .filter(e => !e.isTeacher || entries.length === 1)
                  .sort((a, b) => b.points - a.points || b.streak - a.streak);

                if (studentBoard.length === 0) return null;

                return (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/70 to-sky-50/70 border border-amber-200/80 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-slate-900 flex items-center gap-1.5 text-xs">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span>لوحة شرف الصف والإنجازات الأسبوعية</span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">{studentBoard.length} مشارك</span>
                    </div>

                    <div className="space-y-1.5 max-h-60 overflow-y-auto pr-0.5">
                      {studentBoard.slice(0, 12).map((row, idx) => {
                        const rankBadge = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`;
                        const achievementLabel =
                          row.points >= 500 ? 'نجم الصف' : row.streak >= 5 ? 'مواظب' : row.points >= 150 ? 'متقدم' : '';
                        return (
                          <div
                            key={row.user_id}
                            className={`p-2 rounded-xl border flex items-center justify-between gap-2 ${
                              row.isMe
                                ? 'bg-white border-[#1677c7] shadow-xs'
                                : idx < 3
                                  ? 'bg-white/90 border-amber-200'
                                  : 'bg-white/70 border-slate-200/80'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-6 text-center font-black text-xs shrink-0">{rankBadge}</span>
                              {row.avatar_url ? (
                                <img src={row.avatar_url} alt={row.name} className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200" />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-sky-100 text-[#0f233a] font-black text-[11px] flex items-center justify-center shrink-0">
                                  {row.name.charAt(0)}
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate text-[11px]">
                                  {row.name} {row.isMe && <span className="text-[#1677c7]">(أنت)</span>}
                                </p>
                                {achievementLabel && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700">
                                    <Award className="w-2.5 h-2.5" /> {achievementLabel}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 text-[11px] font-black">
                              {row.streak > 0 && (
                                <span className="inline-flex items-center gap-0.5 text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-lg" title="أيام المواظبة">
                                  <Flame className="w-3 h-3" /> {row.streak}
                                </span>
                              )}
                              <span className="text-[#1677c7] bg-sky-50 px-2 py-0.5 rounded-lg tabular-nums">
                                {row.points} XP
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {selectedClass.teacher_id === currentUserId && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block">الأعضاء:</span>
                  {members.filter(m => m.class_id === selectedClass.id && m.user_id !== currentUserId).length === 0 && (
                    <p className="text-slate-400">لم ينضم أحد بعد. شارك الرمز أعلاه.</p>
                  )}
                  {members.filter(m => m.class_id === selectedClass.id && m.user_id !== currentUserId).map(m => (
                    <div key={m.user_id} className="p-2 bg-slate-50 rounded-lg flex items-center justify-between">
                      <span className="font-bold text-slate-700">{m.name}</span>
                      <button
                        onClick={() => onRemoveMember(selectedClass.id, m.user_id)}
                        className="text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg font-bold cursor-pointer"
                      >
                        إزالة
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => { onArchiveClass(selectedClass.id, !selectedClass.is_archived); setSelectedClass(null); }}
                      className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl cursor-pointer"
                    >
                      {selectedClass.is_archived ? 'إلغاء الأرشفة' : 'أرشفة الصف'}
                    </button>
                    <button
                      onClick={() => { onDeleteClass(selectedClass.id); setSelectedClass(null); }}
                      className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl cursor-pointer"
                    >
                      حذف الصف
                    </button>
                  </div>
                </div>
              )}
              {selectedClass.teacher_id !== currentUserId && (
                <button
                  onClick={() => { onLeaveClass(selectedClass.id); setSelectedClass(null); }}
                  className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl cursor-pointer"
                >
                  مغادرة الصف
                </button>
              )}
                </>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
              <button
                onClick={() => setSelectedClass(null)}
                className="w-full py-2 bg-[#0f233a] text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
      {/* QR JOIN CODE MODAL */}
      {qrModal && (
        <div
          className="fixed inset-0 z-[60] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setQrModal(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-center animate-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="text-right">
                <span className="text-[11px] font-bold text-[#1677c7] block">انضمام سريع عبر الكاميرا</span>
                <h3 className="font-black text-slate-900 text-sm line-clamp-1">{qrModal.cls.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setQrModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center gap-2">
              <img src={qrModal.dataUrl} alt={`QR ${qrModal.cls.join_code}`} className="w-52 h-52 rounded-xl bg-white p-2 border border-slate-100" />
              <span className="font-mono font-black text-base text-[#0f233a] tracking-widest">
                {qrModal.cls.join_code}
              </span>
              <p className="text-[11px] text-slate-500">
                امسح الرمز بكاميرا الهاتف لينضم الطالب إلى الصف مباشرة
              </p>
            </div>

            <div className="flex gap-2 text-xs">
              <a
                href={qrModal.dataUrl}
                download={`NEMVIA-QR-${qrModal.cls.join_code}.png`}
                className="flex-1 py-2.5 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl inline-flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>تنزيل الصورة</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(qrModal.joinUrl);
                  setCopiedCode(qrModal.cls.join_code);
                  setTimeout(() => setCopiedCode(null), 2000);
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedCode === qrModal.cls.join_code ? 'تم النسخ ✓' : 'نسخ الرابط'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
