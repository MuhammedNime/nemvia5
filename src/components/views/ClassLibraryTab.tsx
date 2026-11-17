import React, { useEffect, useMemo, useState } from 'react';
import {
  BookMarked,
  ChevronDown,
  ChevronUp,
  Copy,
  Edit3,
  ExternalLink,
  FileCheck2,
  FileText,
  FolderOpen,
  Link2,
  Loader2,
  Paperclip,
  Plus,
  Search,
  Trash2,
  Upload,
  Video,
  X,
} from 'lucide-react';
import { AppRole, ClassItem, ClassResource, ClassResourceKind } from '../../types';
import * as api from '../../lib/api';
import { UploadedFile } from '../../lib/api';
import { openExternalUrl } from '../../lib/native';

interface ClassLibraryTabProps {
  cls: ClassItem;
  currentUserId: string;
  currentUserName: string;
  currentRole: AppRole;
  isClassMember: boolean;
  initialAddUnit?: string;
  onUpload?: (file: File, folder: string) => Promise<UploadedFile>;
}

const KIND_META: Record<
  ClassResourceKind,
  { label: string; badgeCls: string; icon: React.ComponentType<{ className?: string }> }
> = {
  book: {
    label: 'كتاب دراسي',
    badgeCls: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: BookMarked,
  },
  summary: {
    label: 'ملخص / ملزمة',
    badgeCls: 'bg-sky-50 text-[#1677c7] border-sky-200',
    icon: FileText,
  },
  worksheet: {
    label: 'ورقة عمل',
    badgeCls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: FileCheck2,
  },
  link: {
    label: 'رابط تعليمي',
    badgeCls: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Link2,
  },
  video: {
    label: 'فيديو شرح',
    badgeCls: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: Video,
  },
};

const QUICK_UNITS = ['الوحدة الأولى', 'الوحدة الثانية', 'الوحدة الثالثة', 'مراجعة نهائية', 'موارد عامة'];

export const ClassLibraryTab: React.FC<ClassLibraryTabProps> = ({
  cls,
  currentUserId,
  currentUserName,
  currentRole,
  isClassMember,
  onUpload,
}) => {
  const [resources, setResources] = useState<ClassResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [unitFilter, setUnitFilter] = useState<string>('all');
  const [kindFilter, setKindFilter] = useState<ClassResourceKind | 'all'>('all');
  const [collapsedUnits, setCollapsedUnits] = useState<Record<string, boolean>>({});

  // Add / Edit state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [unitName, setUnitName] = useState('الوحدة الأولى');
  const [kind, setKind] = useState<ClassResourceKind>('summary');
  const [description, setDescription] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const canContribute = cls.teacher_id === currentUserId || currentRole === 'admin' || isClassMember;

  useEffect(() => {
    setLoading(true);
    const unsub = api.subscribeClassResources(cls.id, items => {
      setResources(items);
      setLoading(false);
    });
    return () => unsub();
  }, [cls.id]);

  const units = useMemo(() => {
    const unique = Array.from(new Set(resources.map(r => r.unit_name).filter(Boolean)));
    return unique.sort((a, b) => a.localeCompare(b, 'ar'));
  }, [resources]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return resources.filter(item => {
      if (unitFilter !== 'all' && item.unit_name !== unitFilter) return false;
      if (kindFilter !== 'all' && item.kind !== kindFilter) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.unit_name.toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.file_name || '').toLowerCase().includes(q)
      );
    });
  }, [resources, searchQuery, unitFilter, kindFilter]);

  const groupedByUnit = useMemo(() => {
    const map = new Map<string, ClassResource[]>();
    filtered.forEach(item => {
      const key = item.unit_name || 'موارد عامة';
      const bucket = map.get(key) || [];
      bucket.push(item);
      map.set(key, bucket);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0], 'ar'));
  }, [filtered]);

  const resetForm = (presetUnit = 'الوحدة الأولى') => {
    setEditingId(null);
    setTitle('');
    setUnitName(presetUnit);
    setKind('summary');
    setDescription('');
    setExternalUrl('');
    setUploadedFile(null);
    setFormError(null);
  };

  const openAddForm = (presetUnit = 'الوحدة الأولى') => {
    resetForm(presetUnit);
    setShowForm(true);
  };

  const openEditForm = (item: ClassResource) => {
    setEditingId(item.id);
    setTitle(item.title);
    setUnitName(item.unit_name);
    setKind(item.kind);
    setDescription(item.description || '');
    setExternalUrl(item.external_url || '');
    setUploadedFile(null);
    setFormError(null);
    setShowForm(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !onUpload) return;
    setFormError(null);
    setUploading(true);
    try {
      const res = await onUpload(file, 'class_library');
      setUploadedFile(res);
      if (!title.trim()) {
        setTitle(file.name.replace(/\.[^.]+$/, ''));
      }
    } catch (err: any) {
      setFormError(err?.message || 'تعذّر رفع الملف.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!title.trim()) {
      setFormError('يرجى كتابة عنوان الملف أو الملزمة.');
      return;
    }
    const cleanUrl = externalUrl.trim();
    if (cleanUrl && !/^https?:\/\//i.test(cleanUrl)) {
      setFormError('يجب أن يبدأ الرابط الخارجي بـ https:// أو http://');
      return;
    }
    if (!editingId && !uploadedFile && !cleanUrl && !description.trim()) {
      setFormError('أرفق ملفاً أو أضف رابطاً تعليمياً أو وصفاً للمورد.');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await api.updateClassResource(editingId, {
          title,
          unitName,
          kind,
          description,
          externalUrl: cleanUrl,
        });
      } else {
        await api.createClassResource({
          classId: cls.id,
          uploaderId: currentUserId,
          uploaderName: currentUserName,
          title,
          unitName,
          kind,
          description,
          fileUrl: uploadedFile?.url,
          fileName: uploadedFile?.name,
          fileSize: uploadedFile?.size,
          externalUrl: cleanUrl || undefined,
        });
      }
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      setFormError(err?.message || 'تعذّر حفظ المورد في المكتبة.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteClassResource(id);
      setConfirmDeleteId(null);
    } catch {
      /* ignore */
    }
  };

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(prev => (prev === id ? null : prev)), 2000);
  };

  const toggleUnit = (u: string) => {
    setCollapsedUnits(prev => ({ ...prev, [u]: !prev[u] }));
  };

  return (
    <div className="space-y-4">
      {/* Header & Add Action */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
            <FolderOpen className="w-4 h-4 text-[#1677c7]" />
            <span>مكتبة الملفات والملازم المنظمة</span>
          </h4>
          <p className="text-[11px] text-slate-500">
            كتب، ملخصات، أوراق عمل وروابط تعليمية مرتبة حسب وحدات المادة
          </p>
        </div>

        {canContribute && !showForm && (
          <button
            type="button"
            onClick={() => openAddForm(unitFilter !== 'all' ? unitFilter : 'الوحدة الأولى')}
            className="px-3.5 py-2 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة ملف / ملزمة</span>
          </button>
        )}
      </div>

      {!canContribute && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
          انضم إلى الصف برمز الدعوة لتتمكن من إضافة الملازم والملفات مع زملائك.
        </div>
      )}

      {/* Add / Edit Resource Form */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="font-black text-slate-900 text-xs">
              {editingId ? 'تعديل المورد التعليمي' : 'إضافة مورد جديد لمكتبة الصف'}
            </span>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1 text-[11px]">العنوان:</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="مثال: ملزمة الفصل الأول — القوانين الأساسية"
                maxLength={200}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 text-[11px]">التصنيف:</label>
              <select
                value={kind}
                onChange={e => setKind(e.target.value as ClassResourceKind)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-xs font-bold"
              >
                <option value="summary">ملخص / ملزمة</option>
                <option value="book">كتاب دراسي / مرجع</option>
                <option value="worksheet">ورقة عمل / تمارين</option>
                <option value="link">رابط تعليمي مفيد</option>
                <option value="video">فيديو شرح</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-[11px]">الوحدة / الباب:</label>
            <input
              type="text"
              value={unitName}
              onChange={e => setUnitName(e.target.value)}
              placeholder="مثال: الوحدة الأولى"
              maxLength={100}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-xs"
              required
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {Array.from(new Set([...units, ...QUICK_UNITS])).slice(0, 6).map(u => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnitName(u)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border cursor-pointer transition-colors ${
                    unitName === u
                      ? 'bg-[#1677c7] text-white border-[#1677c7]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {!editingId && onUpload && (
            <div>
              <label className="block font-bold text-slate-700 mb-1 text-[11px]">
                رفع ملف (PDF، Word، صور، عروض تقديمية — حتى 10MB):
              </label>
              {uploadedFile ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <Paperclip className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-bold text-emerald-900 truncate">{uploadedFile.name}</span>
                    {uploadedFile.size && (
                      <span className="text-[10px] text-emerald-700 shrink-0">({uploadedFile.size})</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="text-rose-600 font-bold text-[11px] cursor-pointer shrink-0"
                  >
                    إزالة
                  </button>
                </div>
              ) : (
                <label className="w-full p-3 bg-white border border-dashed border-slate-300 hover:border-[#1677c7] rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-600 cursor-pointer transition-colors">
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#1677c7]" />
                      <span>جاري رفع الملف...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-[#1677c7]" />
                      <span>اختر ملفاً من جهازك لرفعه</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.webp"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-[11px]">
              رابط تعليمي خارجي (اختياري):
            </label>
            <input
              type="url"
              dir="ltr"
              value={externalUrl}
              onChange={e => setExternalUrl(e.target.value)}
              placeholder="https://..."
              maxLength={2000}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-xs text-left"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-[11px]">
              ملاحظات أو وصف مختصر (اختياري):
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="محتوى الملزمة، الصفحات المطلوبة، أو تعليمات المذاكرة..."
              maxLength={2000}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-xs min-h-[60px]"
            />
          </div>

          {formError && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[11px]">
              {formError}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 py-2.5 bg-[#1677c7] hover:bg-[#125fa0] disabled:opacity-60 text-white font-bold rounded-xl text-xs cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{editingId ? 'حفظ التعديلات' : 'نشر في مكتبة الصف'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}

      {/* Search & Filters */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث داخل المكتبة بالعنوان أو الوحدة..."
              className="w-full pr-8 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-xs"
            />
          </div>

          {units.length > 0 && (
            <select
              value={unitFilter}
              onChange={e => setUnitFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1677c7] text-xs font-bold text-slate-700"
            >
              <option value="all">كل الوحدات ({resources.length})</option>
              {units.map(u => (
                <option key={u} value={u}>
                  {u} ({resources.filter(r => r.unit_name === u).length})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setKindFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer transition-colors ${
              kindFilter === 'all'
                ? 'bg-[#0f233a] text-white border-[#0f233a]'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            الكل ({resources.length})
          </button>
          {(Object.keys(KIND_META) as ClassResourceKind[]).map(k => {
            const meta = KIND_META[k];
            const count = resources.filter(r => r.kind === k).length;
            const Icon = meta.icon;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setKindFilter(k)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer inline-flex items-center gap-1 transition-colors ${
                  kindFilter === k
                    ? 'bg-[#1677c7] text-white border-[#1677c7]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{meta.label}</span>
                {count > 0 && <span className="opacity-75">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resource List Grouped by Unit */}
      {loading ? (
        <div className="py-10 flex items-center justify-center text-slate-400 gap-2 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-[#1677c7]" />
          <span>جاري تحميل مكتبة الصف...</span>
        </div>
      ) : groupedByUnit.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
          <FolderOpen className="w-9 h-9 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-700 text-xs">
            {resources.length === 0
              ? 'لا توجد ملفات أو ملازم مضافة في هذا الصف بعد.'
              : 'لا توجد نتائج مطابقة لبحثك.'}
          </p>
          {canContribute && resources.length === 0 && (
            <button
              type="button"
              onClick={() => openAddForm()}
              className="px-3.5 py-1.5 bg-[#1677c7] text-white font-bold rounded-xl text-[11px] cursor-pointer inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>أضف أول كتاب أو ملزمة</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {groupedByUnit.map(([unit, items]) => {
            const isCollapsed = Boolean(collapsedUnits[unit]);
            return (
              <div key={unit} className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => toggleUnit(unit)}
                    className="flex items-center gap-2 font-black text-slate-900 text-xs cursor-pointer text-right flex-1 min-w-0"
                  >
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span className="truncate">{unit}</span>
                    <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-[#1677c7] shrink-0">
                      {items.length}
                    </span>
                  </button>

                  {canContribute && (
                    <button
                      type="button"
                      onClick={() => openAddForm(unit)}
                      className="px-2 py-1 rounded-lg bg-white hover:bg-sky-50 border border-slate-200 text-[#1677c7] font-bold text-[10px] inline-flex items-center gap-1 cursor-pointer shrink-0"
                      title="إضافة مورد إلى هذه الوحدة"
                    >
                      <Plus className="w-3 h-3" />
                      <span>إضافة</span>
                    </button>
                  )}
                </div>

                {!isCollapsed && (
                  <div className="divide-y divide-slate-100">
                    {items.map(item => {
                      const meta = KIND_META[item.kind];
                      const Icon = meta.icon;
                      const canEditOrDelete =
                        item.uploader_id === currentUserId ||
                        cls.teacher_id === currentUserId ||
                        currentRole === 'admin';
                      const primaryLink = item.file_url || item.external_url || '';

                      return (
                        <div key={item.id} className="p-3.5 space-y-2 hover:bg-slate-50/60 transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold inline-flex items-center gap-1 ${meta.badgeCls}`}
                                >
                                  <Icon className="w-3 h-3" />
                                  <span>{meta.label}</span>
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  بواسطة {item.uploader_name} ·{' '}
                                  {new Date(item.created_at).toLocaleDateString('ar-EG')}
                                </span>
                              </div>
                              <h5 className="font-black text-slate-900 text-xs leading-snug">{item.title}</h5>
                              {item.description && (
                                <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">
                                  {item.description}
                                </p>
                              )}
                              {item.file_name && (
                                <div className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                                  <Paperclip className="w-3 h-3 text-[#1677c7]" />
                                  <span className="truncate max-w-[200px]">{item.file_name}</span>
                                  {item.file_size && <span className="text-slate-400">({item.file_size})</span>}
                                </div>
                              )}
                            </div>

                            {canEditOrDelete && (
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => openEditForm(item)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-[#1677c7] hover:bg-sky-50 cursor-pointer"
                                  title="تعديل"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                {confirmDeleteId === item.id ? (
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => void handleDelete(item.id)}
                                      className="px-2 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] cursor-pointer"
                                    >
                                      حذف
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteId(null)}
                                      className="px-1.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-[10px] cursor-pointer"
                                    >
                                      تراجع
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(item.id)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                    title="حذف"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          {(item.file_url || item.external_url) && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              {item.file_url && (
                                <button
                                  type="button"
                                  onClick={() => void openExternalUrl(item.file_url!)}
                                  className="px-3 py-1.5 rounded-xl bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>فتح / تنزيل الملف</span>
                                </button>
                              )}
                              {item.external_url && (
                                <button
                                  type="button"
                                  onClick={() => void openExternalUrl(item.external_url!)}
                                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Link2 className="w-3.5 h-3.5" />
                                  <span>زيارة الرابط</span>
                                </button>
                              )}
                              {primaryLink && (
                                <button
                                  type="button"
                                  onClick={() => handleCopyUrl(item.id, primaryLink)}
                                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Copy className="w-3 h-3" />
                                  <span>{copiedId === item.id ? 'تم النسخ ✓' : 'نسخ الرابط'}</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
