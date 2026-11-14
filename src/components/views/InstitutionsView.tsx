import React, { useState, useMemo } from 'react';
import {
  Building2,
  Landmark,
  Plus,
  Share2,
  Copy,
  Check,
  X,
  Users,
  BookOpen,
  Award,
  Megaphone,
  Send,
  Link2,
  BarChart3,
  Trash2,
  LogOut,
  ChevronLeft,
  Search,
} from 'lucide-react';
import {
  AppRole,
  Assignment,
  ClassItem,
  ClassMemberInfo,
  DirectMessage,
  MinistryItem,
  Quiz,
  SchoolItem,
} from '../../types';

export interface InstitutionsViewProps {
  mode: 'schools' | 'ministries';
  currentRole: AppRole;
  currentUserId: string;
  currentUserName: string;
  ministries: MinistryItem[];
  schools: SchoolItem[];
  classes: ClassItem[];
  quizzes: Quiz[];
  assignments: Assignment[];
  messages: DirectMessage[];
  myOrgIds: string[];
  orgMembers: ClassMemberInfo[];
  onCreateMinistry: (m: { name: string; region: string; description: string; colorTheme?: string }) => Promise<boolean>;
  onCreateSchool: (s: {
    name: string;
    stage: string;
    region: string;
    description: string;
    ministry_id?: string;
    colorTheme?: string;
  }) => Promise<boolean>;
  onJoinByCode: (code: string) => Promise<boolean>;
  onLinkSchoolToMinistry: (school: SchoolItem, ministryId: string) => Promise<boolean>;
  onLinkClassToSchool: (cls: ClassItem, schoolId: string) => Promise<boolean>;
  onCreateClassForSchool: (cls: ClassItem) => void;
  onSendDirective: (orgId: string, orgName: string, body: string) => Promise<boolean>;
  onRemoveMember: (orgId: string, userId: string) => Promise<boolean>;
  onLeaveOrg: (orgId: string) => Promise<boolean>;
  onDeleteOrg: (orgId: string) => Promise<boolean>;
}

const inputCls =
  'w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7] focus:bg-white';

export const InstitutionsView: React.FC<InstitutionsViewProps> = ({
  mode,
  currentUserId,
  currentUserName,
  ministries,
  schools,
  classes,
  quizzes,
  assignments,
  messages,
  myOrgIds,
  orgMembers,
  onCreateMinistry,
  onCreateSchool,
  onJoinByCode,
  onLinkSchoolToMinistry,
  onLinkClassToSchool,
  onCreateClassForSchool,
  onSendDirective,
  onRemoveMember,
  onLeaveOrg,
  onDeleteOrg,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Join Modal
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinStatus, setJoinStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  // Create School Modal
  const [showCreateSchool, setShowCreateSchool] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [schoolStage, setSchoolStage] = useState('ابتدائي / إعدادي / ثانوي');
  const [schoolRegion, setSchoolRegion] = useState('');
  const [schoolDesc, setSchoolDesc] = useState('');
  const [schoolMinistryId, setSchoolMinistryId] = useState('');

  // Create Ministry Modal
  const [showCreateMinistry, setShowCreateMinistry] = useState(false);
  const [minName, setMinName] = useState('');
  const [minRegion, setMinRegion] = useState('');
  const [minDesc, setMinDesc] = useState('');

  // Active School / Ministry Detail Inspection
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [schoolTab, setSchoolTab] = useState<'classes' | 'members' | 'stats' | 'directives'>('classes');
  const [selectedMinistryId, setSelectedMinistryId] = useState<string | null>(null);
  const [ministryTab, setMinistryTab] = useState<'schools' | 'directives' | 'members'>('schools');

  // Quick add class inside School
  const [newClsTitle, setNewClsTitle] = useState('');
  const [newClsSubject, setNewClsSubject] = useState('');
  const [newClsGrade, setNewClsGrade] = useState('الصف العاشر');
  const [newClsType, setNewClsType] = useState<'class' | 'study'>('class');
  const [linkClassId, setLinkClassId] = useState('');
  const [linkSchoolId, setLinkSchoolId] = useState('');
  const [directiveText, setDirectiveText] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const selectedSchool = useMemo(
    () => (selectedSchoolId ? schools.find(s => s.id === selectedSchoolId) || null : null),
    [schools, selectedSchoolId],
  );
  const selectedMinistry = useMemo(
    () => (selectedMinistryId ? ministries.find(m => m.id === selectedMinistryId) || null : null),
    [ministries, selectedMinistryId],
  );

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Compute aggregated performance stats for a list of classes
  const calcStatsForClasses = (clsList: ClassItem[]) => {
    const classIds = new Set(clsList.map(c => c.id));
    const relQuizzes = quizzes.filter(q => classIds.has(q.class_id));
    const relAssignments = assignments.filter(a => classIds.has(a.class_id));
    let scoreSum = 0;
    let maxSum = 0;
    let attemptsCount = 0;
    relQuizzes.forEach(q => {
      const maxPts = q.questions.reduce((s, qq) => s + (qq.points || 1), 0) || 1;
      (q.attempts || []).forEach(a => {
        scoreSum += a.score;
        maxSum += maxPts;
        attemptsCount += 1;
      });
    });
    const avgPct = maxSum > 0 ? Math.round((scoreSum / maxSum) * 100) : 0;
    const totalStudents = clsList.reduce((s, c) => s + (c.members_count || 0), 0);
    return {
      classesCount: clsList.length,
      quizzesCount: relQuizzes.length,
      assignmentsCount: relAssignments.length,
      attemptsCount,
      avgPct,
      totalStudents,
    };
  };

  const filteredSchools = schools.filter(
    s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.stage.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredMinistries = ministries.filter(
    m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.region.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim() || busy) return;
    setBusy(true);
    const ok = await onJoinByCode(joinCode.trim().toUpperCase());
    setBusy(false);
    if (ok) {
      setJoinStatus({ ok: true, msg: 'تم الانضمام بنجاح!' });
      setTimeout(() => {
        setJoinStatus(null);
        setShowJoin(false);
        setJoinCode('');
      }, 1200);
    } else {
      setJoinStatus({ ok: false, msg: 'الرمز غير صحيح أو غير متاح، تحقق من الرمز وأعد المحاولة.' });
    }
  };

  const handleCreateSchoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim() || busy) return;
    setBusy(true);
    const ok = await onCreateSchool({
      name: schoolName.trim(),
      stage: schoolStage.trim(),
      region: schoolRegion.trim() || 'عام',
      description: schoolDesc.trim(),
      ministry_id: schoolMinistryId || undefined,
    });
    setBusy(false);
    if (ok) {
      setShowCreateSchool(false);
      setSchoolName('');
      setSchoolRegion('');
      setSchoolDesc('');
      setSchoolMinistryId('');
    }
  };

  const handleCreateMinistrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!minName.trim() || busy) return;
    setBusy(true);
    const ok = await onCreateMinistry({
      name: minName.trim(),
      region: minRegion.trim() || 'وطني / عام',
      description: minDesc.trim(),
    });
    setBusy(false);
    if (ok) {
      setShowCreateMinistry(false);
      setMinName('');
      setMinRegion('');
      setMinDesc('');
    }
  };

  const handleCreateSchoolClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchool || !newClsTitle.trim()) return;
    const code = 'NEM' + Math.floor(1000 + Math.random() * 9000);
    onCreateClassForSchool({
      id: `cls-${Date.now()}`,
      teacher_id: currentUserId,
      teacher_name: currentUserName,
      school_id: selectedSchool.id,
      title: newClsTitle.trim(),
      subject: newClsSubject.trim() || 'عام',
      grade_level: newClsGrade.trim() || 'عام',
      join_code: code,
      description: `صف تابع لـ ${selectedSchool.name}`,
      class_type: newClsType,
      is_archived: false,
      members_count: 1,
      colorTheme: 'from-blue-600 to-indigo-700',
      created_at: new Date().toISOString(),
    });
    setNewClsTitle('');
    setNewClsSubject('');
  };

  const handlePostDirective = async (orgId: string, orgName: string) => {
    if (!directiveText.trim() || busy) return;
    setBusy(true);
    const ok = await onSendDirective(orgId, orgName, directiveText.trim());
    setBusy(false);
    if (ok) setDirectiveText('');
  };

  return (
    <div className="space-y-5">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            {mode === 'schools' ? (
              <>
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>المدارس والمعاهد التعليمية</span>
              </>
            ) : (
              <>
                <Landmark className="w-5 h-5 text-[#1677c7]" />
                <span>الوزارات والمجمعات التعليمية</span>
              </>
            )}
          </h3>
          <p className="text-xs text-slate-500">
            {mode === 'schools'
              ? 'أنشئ مدرسة لطلابك ومعلميك، اربط الصفوف بها، وشارك رمز المدرسة للانضمام المباشر'
              : 'مظلة إشرافية لمتابعة المدارس التابعة، مراقبة الأداء والاختبارات، وإصدار التعاميم'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowJoin(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-[#1677c7] font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{mode === 'schools' ? 'انضمام لمدرسة برمز' : 'انضمام لإشراف برمز'}</span>
          </button>

          {mode === 'schools' ? (
            <button
              type="button"
              onClick={() => setShowCreateSchool(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء مدرسة / معهد</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowCreateMinistry(true)}
              className="px-4 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء وزارة / مجمع تعليمي</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={mode === 'schools' ? 'ابحث باسم المدرسة، المرحلة أو المنطقة...' : 'ابحث باسم الوزارة أو المجمع أو المنطقة...'}
          className="w-full pr-9 pl-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#1677c7]"
        />
      </div>

      {/* SCHOOLS GRID */}
      {mode === 'schools' && (
        <>
          {filteredSchools.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center space-y-2">
              <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">لا توجد مدارس أو معاهد مضافة بعد</p>
              <p className="text-xs text-slate-500">
                يمكنك إنشاء مدرسة جديدة للطلاب والمعلمين، أو الانضمام إلى مدرسة قائمة باستخدام رمز الدعوة.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSchools.map(s => {
                const schoolClasses = classes.filter(c => c.school_id === s.id);
                const parentMin = s.ministry_id ? ministries.find(m => m.id === s.ministry_id) : undefined;
                const isMember = myOrgIds.includes(s.id) || s.owner_id === currentUserId;
                return (
                  <div
                    key={s.id}
                    className="bg-white border border-slate-200 border-t-4 border-t-emerald-600 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-[#1677c7] transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-black text-sm text-slate-900 truncate">{s.name}</h4>
                            <p className="text-[11px] text-slate-500 truncate">{s.stage} · {s.region}</p>
                          </div>
                        </div>
                        {isMember && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 shrink-0">
                            {s.owner_id === currentUserId ? 'مدير' : 'عضو'}
                          </span>
                        )}
                      </div>

                      {parentMin && (
                        <p className="text-[11px] font-bold text-[#1677c7] flex items-center gap-1 bg-sky-50 px-2.5 py-1 rounded-lg">
                          <Landmark className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">تتبع لـ: {parentMin.name}</span>
                        </p>
                      )}

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{s.description}</p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                      <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 rounded-xl p-2">
                        <div>
                          <span className="text-[10px] text-slate-500 block">الصفوف المرتبطة</span>
                          <span className="font-black text-slate-900 tabular-nums">{schoolClasses.length}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">المنتسبون</span>
                          <span className="font-black text-emerald-700 tabular-nums">{s.members_count}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                        <span className="font-mono font-black text-slate-800 tracking-wider">{s.join_code}</span>
                        <button
                          type="button"
                          onClick={() => copyCode(s.join_code)}
                          className="text-[11px] font-bold text-[#1677c7] flex items-center gap-1 cursor-pointer"
                        >
                          {copiedCode === s.join_code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode === s.join_code ? 'نُسخ' : 'نسخ'}</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSchoolId(s.id);
                          setSchoolTab('classes');
                        }}
                        className="w-full py-2 bg-slate-900 hover:bg-[#1677c7] text-white font-bold rounded-xl cursor-pointer transition-colors"
                      >
                        دخول وإدارة المدرسة ←
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* MINISTRIES / COMPLEXES GRID */}
      {mode === 'ministries' && (
        <>
          {filteredMinistries.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center space-y-2">
              <Landmark className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">لا توجد وزارات أو مجمعات تعليمية مسجّلة بعد</p>
              <p className="text-xs text-slate-500">
                أنشئ وزارة أو مجمّعاً تعليمياً لربط عدة مدارس تحته ومتابعة نتائجها وإصدار التعاميم.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMinistries.map(m => {
                const affSchools = schools.filter(s => s.ministry_id === m.id);
                const affSchoolIds = new Set(affSchools.map(s => s.id));
                const affClasses = classes.filter(c => c.school_id && affSchoolIds.has(c.school_id));
                const stats = calcStatsForClasses(affClasses);
                const isMember = myOrgIds.includes(m.id) || m.owner_id === currentUserId;
                return (
                  <div
                    key={m.id}
                    className="bg-white border border-slate-200 border-t-4 border-t-[#1677c7] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-[#1677c7] transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#1677c7] flex items-center justify-center shrink-0">
                            <Landmark className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-black text-sm text-slate-900 truncate">{m.name}</h4>
                            <p className="text-[11px] text-slate-500 truncate">النطاق: {m.region}</p>
                          </div>
                        </div>
                        {isMember && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-[#1677c7] shrink-0">
                            {m.owner_id === currentUserId ? 'مشرف عام' : 'عضو'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{m.description}</p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                      <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 rounded-xl p-2">
                        <div>
                          <span className="text-[10px] text-slate-500 block">المدارس</span>
                          <span className="font-black text-slate-900 tabular-nums">{affSchools.length}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">الصفوف</span>
                          <span className="font-black text-[#1677c7] tabular-nums">{stats.classesCount}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">المتوسط</span>
                          <span className="font-black text-emerald-700 tabular-nums">{stats.avgPct}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                        <span className="font-mono font-black text-slate-800 tracking-wider">{m.join_code}</span>
                        <button
                          type="button"
                          onClick={() => copyCode(m.join_code)}
                          className="text-[11px] font-bold text-[#1677c7] flex items-center gap-1 cursor-pointer"
                        >
                          {copiedCode === m.join_code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode === m.join_code ? 'نُسخ' : 'نسخ'}</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMinistryId(m.id);
                          setMinistryTab('schools');
                        }}
                        className="w-full py-2 bg-[#0f233a] hover:bg-[#1677c7] text-white font-bold rounded-xl cursor-pointer transition-colors"
                      >
                        لوحة المتابعة والإشراف ←
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* JOIN BY CODE MODAL */}
      {showJoin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setShowJoin(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-900">الانضمام برمز المؤسسة</h3>
              <button type="button" onClick={() => setShowJoin(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleJoinSubmit} className="p-5 space-y-3 text-xs">
              <p className="text-slate-600">أدخل رمز الدعوة الخاص بالمدرسة أو الوزارة / المجمع للانضمام فوراً.</p>
              <input
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                placeholder="مثال: AB12CD"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center text-base font-black tracking-widest uppercase outline-none focus:border-[#1677c7]"
                required
              />
              {joinStatus && (
                <div className={`p-2.5 rounded-xl font-bold ${joinStatus.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {joinStatus.msg}
                </div>
              )}
              <button type="submit" disabled={busy} className="w-full py-2.5 bg-[#1677c7] text-white font-bold rounded-xl cursor-pointer disabled:opacity-50">
                {busy ? 'جاري التحقق...' : 'انضمام الآن'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SCHOOL MODAL */}
      {showCreateSchool && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setShowCreateSchool(false)}>
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>إنشاء مدرسة / معهد جديد</span>
              </h3>
              <button type="button" onClick={() => setShowCreateSchool(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateSchoolSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المدرسة أو المعهد:</label>
                <input value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="مثال: ثانوية النخبة النموذجية" className={inputCls} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المرحلة الدراسية:</label>
                  <input value={schoolStage} onChange={e => setSchoolStage(e.target.value)} placeholder="ابتدائي / ثانوي..." className={inputCls} />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المدينة / المديرية:</label>
                  <input value={schoolRegion} onChange={e => setSchoolRegion(e.target.value)} placeholder="الرياض، عمّان، دمشق..." className={inputCls} />
                </div>
              </div>
              {ministries.length > 0 && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ربط بوزارة أو مجمع تعليمي (اختياري):</label>
                  <select value={schoolMinistryId} onChange={e => setSchoolMinistryId(e.target.value)} className={inputCls}>
                    <option value="">بدون ربط حالياً (مدرسة مستقلة)</option>
                    {ministries.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block font-bold text-slate-700 mb-1">نبذة عن المدرسة:</label>
                <textarea value={schoolDesc} onChange={e => setSchoolDesc(e.target.value)} rows={2} placeholder="رسالة المدرسة وتخصصاتها للطلاب والمعلمين..." className={inputCls} />
              </div>
              <button type="submit" disabled={busy} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer disabled:opacity-50">
                {busy ? 'جاري الإنشاء...' : 'إنشاء المدرسة وتوليد رمز الدعوة'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MINISTRY MODAL */}
      {showCreateMinistry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setShowCreateMinistry(false)}>
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#1677c7]" />
                <span>إنشاء وزارة / مجمع تعليمي</span>
              </h3>
              <button type="button" onClick={() => setShowCreateMinistry(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateMinistrySubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم الوزارة أو المجمع التعليمي:</label>
                <input value={minName} onChange={e => setMinName(e.target.value)} placeholder="مثال: مجمع مدارس الأمل التربوي / مديرية التربية" className={inputCls} required />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">النطاق الجغرافي / المحافظة:</label>
                <input value={minRegion} onChange={e => setMinRegion(e.target.value)} placeholder="مثال: المنطقة الوسطى / جميع الفروع" className={inputCls} />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">مهام المظلة الإشرافية:</label>
                <textarea value={minDesc} onChange={e => setMinDesc(e.target.value)} rows={2} placeholder="متابعة أداء المدارس، إصدار التوجيهات، ورصد مؤشرات الاختبارات..." className={inputCls} />
              </div>
              <button type="submit" disabled={busy} className="w-full py-2.5 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl cursor-pointer disabled:opacity-50">
                {busy ? 'جاري الإنشاء...' : 'إنشاء المظلة الإشرافية وتوليد الرمز'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SCHOOL WORKSPACE & MANAGEMENT MODAL */}
      {selectedSchool && (() => {
        const isOwner = selectedSchool.owner_id === currentUserId;
        const schoolClasses = classes.filter(c => c.school_id === selectedSchool.id);
        const unlinkedOwnedClasses = classes.filter(c => c.teacher_id === currentUserId && c.school_id !== selectedSchool.id);
        const membersList = orgMembers.filter(m => m.class_id === selectedSchool.id && m.user_id !== selectedSchool.owner_id);
        const stats = calcStatsForClasses(schoolClasses);
        const parentMin = selectedSchool.ministry_id ? ministries.find(m => m.id === selectedSchool.ministry_id) : undefined;
        const schoolMsgs = messages.filter(m => m.channel_id === selectedSchool.id);

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setSelectedSchoolId(null)}>
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] border border-slate-200 shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      {selectedSchool.stage} · {selectedSchool.region}
                    </span>
                    {parentMin && (
                      <span className="text-[11px] font-bold text-[#1677c7] bg-sky-50 px-2.5 py-0.5 rounded-md">
                        تتبع: {parentMin.name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{selectedSchool.name}</h3>
                  <p className="text-xs text-slate-500">المدير/المنشئ: {selectedSchool.owner_name} · رمز المدرسة: <strong className="font-mono text-slate-900">{selectedSchool.join_code}</strong></p>
                </div>
                <button type="button" onClick={() => setSelectedSchoolId(null)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              {/* Tabs */}
              <div className="px-5 pt-3 border-b border-slate-200 flex flex-wrap gap-1.5 text-xs font-bold">
                {[
                  { id: 'classes', label: `الصفوف والشُعَب (${schoolClasses.length})`, icon: BookOpen },
                  { id: 'members', label: `المعلمون والطلاب (${selectedSchool.members_count})`, icon: Users },
                  { id: 'stats', label: 'الأداء والربط الوزاري', icon: BarChart3 },
                  { id: 'directives', label: `التعاميم (${schoolMsgs.length})`, icon: Megaphone },
                ].map(t => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSchoolTab(t.id as any)}
                      className={`px-3 py-2 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
                        schoolTab === t.id ? 'border-[#1677c7] text-[#1677c7]' : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
                {/* CLASSES TAB */}
                {schoolTab === 'classes' && (
                  <div className="space-y-4">
                    {(isOwner || myOrgIds.includes(selectedSchool.id)) && (
                      <form onSubmit={handleCreateSchoolClass} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                        <span className="font-black text-slate-900 block">إنشاء صف دراسي جديد داخل هذه المدرسة:</span>
                        <div className="grid sm:grid-cols-4 gap-2">
                          <input value={newClsTitle} onChange={e => setNewClsTitle(e.target.value)} placeholder="اسم الصف / الشعبة..." className={`${inputCls} sm:col-span-2`} required />
                          <input value={newClsSubject} onChange={e => setNewClsSubject(e.target.value)} placeholder="المادة (رياضيات...)" className={inputCls} required />
                          <input value={newClsGrade} onChange={e => setNewClsGrade(e.target.value)} placeholder="المرحلة (العاشر...)" className={inputCls} />
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <select value={newClsType} onChange={e => setNewClsType(e.target.value as any)} className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold">
                            <option value="class">صف تعليمي رسمي</option>
                            <option value="study">مجموعة دراسة</option>
                          </select>
                          <button type="submit" className="px-4 py-2 bg-[#1677c7] text-white font-bold rounded-xl cursor-pointer flex items-center gap-1">
                            <Plus className="w-3.5 h-3.5" />
                            <span>إضافة الصف للمدرسة</span>
                          </button>
                        </div>
                      </form>
                    )}

                    {isOwner && unlinkedOwnedClasses.length > 0 && (
                      <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200 flex flex-wrap items-center gap-2">
                        <Link2 className="w-4 h-4 text-[#1677c7] shrink-0" />
                        <select value={linkClassId} onChange={e => setLinkClassId(e.target.value)} className="flex-1 min-w-[180px] p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold">
                          <option value="">اختر صفاً قائماً لربطه بهذه المدرسة...</option>
                          {unlinkedOwnedClasses.map(c => (
                            <option key={c.id} value={c.id}>{c.title} ({c.subject})</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          disabled={!linkClassId || busy}
                          onClick={async () => {
                            const target = classes.find(c => c.id === linkClassId);
                            if (!target) return;
                            setBusy(true);
                            await onLinkClassToSchool(target, selectedSchool.id);
                            setBusy(false);
                            setLinkClassId('');
                          }}
                          className="px-3 py-2 bg-[#1677c7] disabled:opacity-50 text-white font-bold rounded-xl cursor-pointer"
                        >
                          ربط الصف
                        </button>
                      </div>
                    )}

                    {schoolClasses.length === 0 ? (
                      <p className="text-center text-slate-400 py-6">لا توجد صفوف مرتبطة بهذه المدرسة بعد.</p>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {schoolClasses.map(c => (
                          <div key={c.id} className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <h5 className="font-black text-slate-900 text-sm truncate">{c.title}</h5>
                              <span className="font-mono text-[11px] font-bold text-[#1677c7] bg-sky-50 px-2 py-0.5 rounded-md">{c.join_code}</span>
                            </div>
                            <p className="text-slate-500">{c.subject} · {c.grade_level}</p>
                            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-600">
                              <span>الأستاذ: {c.teacher_name}</span>
                              <span>{c.members_count} طالب</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* MEMBERS TAB */}
                {schoolTab === 'members' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-emerald-900 block">رمز انضمام الطلاب والمعلمين للمدرسة:</span>
                        <span className="font-mono font-black text-base text-emerald-800">{selectedSchool.join_code}</span>
                      </div>
                      <button type="button" onClick={() => copyCode(selectedSchool.join_code)} className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg cursor-pointer">
                        نسخ الرمز
                      </button>
                    </div>

                    {membersList.length === 0 ? (
                      <p className="text-center text-slate-400 py-6">
                        {isOwner ? 'لم ينضم معلمون أو طلاب برمز المدرسة بعد — شارك الرمز أعلاه.' : `إجمالي المنتسبين للمدرسة: ${selectedSchool.members_count}`}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {membersList.map(m => (
                          <div key={m.user_id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                            <span className="font-bold text-slate-800">{m.name}</span>
                            {isOwner && (
                              <button
                                type="button"
                                onClick={() => void onRemoveMember(selectedSchool.id, m.user_id)}
                                className="text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg font-bold cursor-pointer"
                              >
                                إزالة
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* STATS & MINISTRY LINK TAB */}
                {schoolTab === 'stats' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                        <span className="text-[11px] text-slate-500 block">الصفوف</span>
                        <span className="text-lg font-black text-slate-900 tabular-nums">{stats.classesCount}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                        <span className="text-[11px] text-slate-500 block">الاختبارات</span>
                        <span className="text-lg font-black text-[#1677c7] tabular-nums">{stats.quizzesCount}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                        <span className="text-[11px] text-slate-500 block">الواجبات</span>
                        <span className="text-lg font-black text-amber-600 tabular-nums">{stats.assignmentsCount}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                        <span className="text-[11px] text-slate-500 block">متوسط الدرجات</span>
                        <span className="text-lg font-black text-emerald-700 tabular-nums">{stats.avgPct}%</span>
                      </div>
                    </div>

                    {isOwner && (
                      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                        <label className="font-black text-slate-900 block">تبعية الوزارة / المجمع التعليمي:</label>
                        <div className="flex flex-wrap gap-2">
                          <select
                            value={selectedSchool.ministry_id || ''}
                            onChange={e => void onLinkSchoolToMinistry(selectedSchool, e.target.value)}
                            className="flex-1 min-w-[200px] p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                          >
                            <option value="">مدرسة مستقلة (غير تابعة لوزارة محددة)</option>
                            {ministries.map(m => (
                              <option key={m.id} value={m.id}>{m.name} ({m.region})</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* DIRECTIVES TAB */}
                {schoolTab === 'directives' && (
                  <div className="space-y-3">
                    {(isOwner || myOrgIds.includes(selectedSchool.id)) && (
                      <div className="flex gap-2">
                        <input
                          value={directiveText}
                          onChange={e => setDirectiveText(e.target.value)}
                          placeholder="أصدر تعميماً أو إعلاناً لطلاب ومعلمي المدرسة..."
                          className={inputCls}
                        />
                        <button
                          type="button"
                          disabled={!directiveText.trim() || busy}
                          onClick={() => void handlePostDirective(selectedSchool.id, selectedSchool.name)}
                          className="px-4 py-2 bg-[#1677c7] disabled:opacity-50 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>نشر</span>
                        </button>
                      </div>
                    )}
                    {schoolMsgs.length === 0 ? (
                      <p className="text-center text-slate-400 py-6">لا توجد تعاميم مدرسية منشورة بعد.</p>
                    ) : (
                      <div className="space-y-2">
                        {schoolMsgs.slice().reverse().map(msg => (
                          <div key={msg.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-black text-slate-900">{msg.sender_name}</span>
                              <span className="text-slate-400">{new Date(msg.created_at).toLocaleString('ar')}</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{msg.body}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
                {isOwner ? (
                  confirmDeleteId === selectedSchool.id ? (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-700">تأكيد حذف المدرسة؟</span>
                      <button
                        type="button"
                        onClick={async () => {
                          await onDeleteOrg(selectedSchool.id);
                          setConfirmDeleteId(null);
                          setSelectedSchoolId(null);
                        }}
                        className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-xl cursor-pointer"
                      >
                        نعم، احذف
                      </button>
                      <button type="button" onClick={() => setConfirmDeleteId(null)} className="px-3 py-1.5 bg-white border border-slate-200 font-bold rounded-xl cursor-pointer">
                        إلغاء
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(selectedSchool.id)}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف المدرسة</span>
                    </button>
                  )
                ) : myOrgIds.includes(selectedSchool.id) ? (
                  <button
                    type="button"
                    onClick={async () => {
                      await onLeaveOrg(selectedSchool.id);
                      setSelectedSchoolId(null);
                    }}
                    className="px-3 py-2 bg-rose-50 text-rose-700 font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>مغادرة المدرسة</span>
                  </button>
                ) : <div />}

                <button type="button" onClick={() => setSelectedSchoolId(null)} className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl cursor-pointer">
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MINISTRY / COMPLEX EXECUTIVE MODAL */}
      {selectedMinistry && (() => {
        const isOwner = selectedMinistry.owner_id === currentUserId;
        const affSchools = schools.filter(s => s.ministry_id === selectedMinistry.id);
        const affSchoolIds = new Set(affSchools.map(s => s.id));
        const affClasses = classes.filter(c => c.school_id && affSchoolIds.has(c.school_id));
        const totalStats = calcStatsForClasses(affClasses);
        const totalSchoolMembers = affSchools.reduce((sum, s) => sum + (s.members_count || 0), 0);
        const unlinkedOwnedSchools = schools.filter(s => s.owner_id === currentUserId && s.ministry_id !== selectedMinistry.id);
        const minMsgs = messages.filter(m => m.channel_id === selectedMinistry.id);
        const membersList = orgMembers.filter(m => m.class_id === selectedMinistry.id && m.user_id !== selectedMinistry.owner_id);

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setSelectedMinistryId(null)}>
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] border border-slate-200 shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#1677c7] bg-sky-50 px-2.5 py-0.5 rounded-md inline-block">
                    الإشراف التنفيذي · {selectedMinistry.region}
                  </span>
                  <h3 className="text-lg font-black text-slate-900">{selectedMinistry.name}</h3>
                  <p className="text-xs text-slate-500">المسؤول: {selectedMinistry.owner_name} · رمز الإشراف: <strong className="font-mono text-slate-900">{selectedMinistry.join_code}</strong></p>
                </div>
                <button type="button" onClick={() => setSelectedMinistryId(null)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              {/* KPI Strip */}
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">المدارس التابعة</span>
                  <span className="text-base font-black text-slate-900 tabular-nums">{affSchools.length}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">إجمالي الصفوف</span>
                  <span className="text-base font-black text-[#1677c7] tabular-nums">{totalStats.classesCount}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">الطلاب والمعلمون</span>
                  <span className="text-base font-black text-emerald-700 tabular-nums">{totalSchoolMembers}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">الاختبارات المنشورة</span>
                  <span className="text-base font-black text-indigo-700 tabular-nums">{totalStats.quizzesCount}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">متوسط التحصيل</span>
                  <span className="text-base font-black text-amber-600 tabular-nums">{totalStats.avgPct}%</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="px-5 pt-2 border-b border-slate-200 flex flex-wrap gap-1.5 text-xs font-bold">
                {[
                  { id: 'schools', label: `المدارس التابعة (${affSchools.length})`, icon: Building2 },
                  { id: 'directives', label: `التعاميم والتوجيهات (${minMsgs.length})`, icon: Megaphone },
                  { id: 'members', label: `فريق الإشراف (${selectedMinistry.members_count})`, icon: Users },
                ].map(t => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setMinistryTab(t.id as any)}
                      className={`px-3 py-2 border-b-2 flex items-center gap-1.5 cursor-pointer ${
                        ministryTab === t.id ? 'border-[#1677c7] text-[#1677c7]' : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
                {ministryTab === 'schools' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      {unlinkedOwnedSchools.length > 0 && (
                        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                          <select value={linkSchoolId} onChange={e => setLinkSchoolId(e.target.value)} className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold">
                            <option value="">إلحاق مدرسة من مدارسك بهذا المجمع...</option>
                            {unlinkedOwnedSchools.map(s => (
                              <option key={s.id} value={s.id}>{s.name} ({s.region})</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            disabled={!linkSchoolId || busy}
                            onClick={async () => {
                              const sc = schools.find(s => s.id === linkSchoolId);
                              if (!sc) return;
                              setBusy(true);
                              await onLinkSchoolToMinistry(sc, selectedMinistry.id);
                              setBusy(false);
                              setLinkSchoolId('');
                            }}
                            className="px-3 py-2 bg-[#1677c7] disabled:opacity-50 text-white font-bold rounded-xl cursor-pointer"
                          >
                            إلحاق
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setSchoolMinistryId(selectedMinistry.id);
                          setShowCreateSchool(true);
                        }}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إنشاء مدرسة تابعة للوزارة</span>
                      </button>
                    </div>

                    {affSchools.length === 0 ? (
                      <p className="text-center text-slate-400 py-8">لا توجد مدارس مرتبطة بهذه الوزارة/المجمع بعد.</p>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {affSchools.map(s => {
                          const sCls = classes.filter(c => c.school_id === s.id);
                          const st = calcStatsForClasses(sCls);
                          return (
                            <div key={s.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h5 className="font-black text-sm text-slate-900">{s.name}</h5>
                                  <p className="text-[11px] text-slate-500">{s.stage} · {s.region} · مديرها: {s.owner_name}</p>
                                </div>
                                <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">{s.join_code}</span>
                              </div>
                              <div className="grid grid-cols-4 gap-2 text-center bg-white rounded-xl p-2 border border-slate-200">
                                <div><span className="text-[10px] text-slate-400 block">صفوف</span><strong className="tabular-nums">{st.classesCount}</strong></div>
                                <div><span className="text-[10px] text-slate-400 block">أعضاء</span><strong className="tabular-nums">{s.members_count}</strong></div>
                                <div><span className="text-[10px] text-slate-400 block">اختبارات</span><strong className="tabular-nums">{st.quizzesCount}</strong></div>
                                <div><span className="text-[10px] text-slate-400 block">المتوسط</span><strong className="text-emerald-700 tabular-nums">{st.avgPct}%</strong></div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedMinistryId(null);
                                  setSelectedSchoolId(s.id);
                                  setSchoolTab('classes');
                                }}
                                className="w-full py-1.5 bg-white hover:bg-[#1677c7] hover:text-white border border-slate-200 text-slate-800 font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1 transition-colors"
                              >
                                <Award className="w-3.5 h-3.5" />
                                <span>معاينة تفاصيل وصفوف المدرسة</span>
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {ministryTab === 'directives' && (
                  <div className="space-y-3">
                    {(isOwner || myOrgIds.includes(selectedMinistry.id)) && (
                      <div className="flex gap-2">
                        <input
                          value={directiveText}
                          onChange={e => setDirectiveText(e.target.value)}
                          placeholder="اكتب تعميماً أو توجيهاً إشرافياً للمدارس والمشرفين..."
                          className={inputCls}
                        />
                        <button
                          type="button"
                          disabled={!directiveText.trim() || busy}
                          onClick={() => void handlePostDirective(selectedMinistry.id, selectedMinistry.name)}
                          className="px-4 py-2 bg-[#1677c7] disabled:opacity-50 text-white font-bold rounded-xl cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>تعميم</span>
                        </button>
                      </div>
                    )}
                    {minMsgs.length === 0 ? (
                      <p className="text-center text-slate-400 py-6">لا توجد تعاميم وزارية صادرة بعد.</p>
                    ) : (
                      <div className="space-y-2">
                        {minMsgs.slice().reverse().map(msg => (
                          <div key={msg.id} className="p-3 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-black text-[#0f233a]">{msg.sender_name}</span>
                              <span className="text-slate-400">{new Date(msg.created_at).toLocaleString('ar')}</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{msg.body}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {ministryTab === 'members' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">رمز انضمام المشرفين ومديري المدارس:</span>
                        <span className="font-mono font-black text-base text-[#0f233a]">{selectedMinistry.join_code}</span>
                      </div>
                      <button type="button" onClick={() => copyCode(selectedMinistry.join_code)} className="px-3 py-1.5 bg-[#1677c7] text-white font-bold rounded-lg cursor-pointer">
                        نسخ الرمز
                      </button>
                    </div>
                    {membersList.length === 0 ? (
                      <p className="text-center text-slate-400 py-6">
                        {isOwner ? 'لم ينضم مشرفون بعد — شارك الرمز أعلاه.' : `إجمالي أعضاء فريق الإشراف: ${selectedMinistry.members_count}`}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {membersList.map(m => (
                          <div key={m.user_id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                            <span className="font-bold text-slate-800">{m.name}</span>
                            {isOwner && (
                              <button
                                type="button"
                                onClick={() => void onRemoveMember(selectedMinistry.id, m.user_id)}
                                className="text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg font-bold cursor-pointer"
                              >
                                إزالة
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
                {isOwner ? (
                  confirmDeleteId === selectedMinistry.id ? (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-700">تأكيد حذف الوزارة/المجمع؟</span>
                      <button
                        type="button"
                        onClick={async () => {
                          await onDeleteOrg(selectedMinistry.id);
                          setConfirmDeleteId(null);
                          setSelectedMinistryId(null);
                        }}
                        className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-xl cursor-pointer"
                      >
                        نعم، احذف
                      </button>
                      <button type="button" onClick={() => setConfirmDeleteId(null)} className="px-3 py-1.5 bg-white border border-slate-200 font-bold rounded-xl cursor-pointer">
                        إلغاء
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(selectedMinistry.id)}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف المجمع/الوزارة</span>
                    </button>
                  )
                ) : myOrgIds.includes(selectedMinistry.id) ? (
                  <button
                    type="button"
                    onClick={async () => {
                      await onLeaveOrg(selectedMinistry.id);
                      setSelectedMinistryId(null);
                    }}
                    className="px-3 py-2 bg-rose-50 text-rose-700 font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>مغادرة الإشراف</span>
                  </button>
                ) : <div />}

                <button type="button" onClick={() => setSelectedMinistryId(null)} className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl cursor-pointer">
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
