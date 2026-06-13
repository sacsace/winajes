'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Upload, X, ArrowLeft, Search } from 'lucide-react';
import type { ApiProject } from '@/lib/projects';
import { isApiImage, resolveProjectImage } from '@/lib/projects';
import { API_URL } from '@/lib/utils';
import { useAdminT } from '@/lib/admin/AdminLocaleProvider';
import { useConfirm } from '@/components/admin/ConfirmDialogProvider';

const CATEGORIES = [
  'mechanical',
  'electrical',
  'fire-fighting',
  'utility',
  'it-infrastructure',
  'industrial-construction',
] as const;

const STATUSES = ['completed', 'ongoing', 'planned'] as const;

type View = 'list' | 'detail';

type FormState = {
  slug: string;
  nameKo: string;
  nameEn: string;
  client: string;
  location: string;
  completionYear: string;
  category: string;
  industry: string;
  status: string;
  scopeKo: string;
  scopeEn: string;
  descriptionKo: string;
  descriptionEn: string;
  featured: boolean;
  images: string[];
};

const emptyForm: FormState = {
  slug: '',
  nameKo: '',
  nameEn: '',
  client: '',
  location: '',
  completionYear: String(new Date().getFullYear()),
  category: 'industrial-construction',
  industry: '',
  status: 'completed',
  scopeKo: '',
  scopeEn: '',
  descriptionKo: '',
  descriptionEn: '',
  featured: false,
  images: [],
};

function toPayload(form: FormState) {
  return {
    slug: form.slug || undefined,
    name: { ko: form.nameKo, en: form.nameEn },
    client: form.client,
    location: form.location,
    completionYear: Number(form.completionYear),
    category: form.category,
    industry: form.industry,
    status: form.status,
    scope: { ko: form.scopeKo, en: form.scopeEn },
    description: { ko: form.descriptionKo, en: form.descriptionEn },
    featured: form.featured,
    images: form.images.filter(Boolean),
  };
}

function projectToForm(project: ApiProject): FormState {
  return {
    slug: project.slug,
    nameKo: project.name.ko,
    nameEn: project.name.en,
    client: project.client,
    location: project.location,
    completionYear: String(project.completionYear),
    category: project.category,
    industry: project.industry,
    status: project.status,
    scopeKo: project.scope.ko,
    scopeEn: project.scope.en,
    descriptionKo: project.description.ko,
    descriptionEn: project.description.en,
    featured: project.featured,
    images: project.images?.filter(Boolean) ?? [],
  };
}

const inputClass =
  'w-full rounded-[10px] border border-black/[0.08] px-3 py-2 text-[13px] outline-none focus:border-[#3E8ED0]';

export function ProjectsAdmin() {
  const { t } = useAdminT();
  const confirmDialog = useConfirm();
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [view, setView] = useState<View>('list');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/projects`);
      if (!res.ok) throw new Error('Failed');
      setProjects(await res.json());
    } catch {
      setError(t('common.errorLoad'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? projects.filter(
          (p) =>
            p.name.ko.toLowerCase().includes(q) ||
            p.name.en.toLowerCase().includes(q) ||
            p.client.toLowerCase().includes(q),
        )
      : projects;
    return [...list].sort(
      (a, b) => b.completionYear - a.completionYear || a.name.ko.localeCompare(b.name.ko),
    );
  }, [projects, search]);

  const openList = () => {
    setView('list');
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setView('detail');
  };

  const openDetail = (project: ApiProject) => {
    setEditingId(project.id);
    setForm(projectToForm(project));
    setError('');
    setView('detail');
  };

  const handleUpload = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;

    setUploading(true);
    setError('');
    const uploaded: string[] = [];

    try {
      for (const file of list) {
        const body = new FormData();
        body.append('file', file);
        const res = await fetch(`${API_URL}/api/uploads/project-image`, { method: 'POST', body });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        uploaded.push(data.url);
      }
      setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }));
    } catch {
      setError(t('common.errorUpload'));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = toPayload(form);

    try {
      const res = await fetch(
        editingId ? `${API_URL}/api/projects/${editingId}` : `${API_URL}/api/projects`,
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw new Error('Save failed');
      await load();
      openList();
    } catch {
      setError(t('common.errorSave'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingId) return;
    const ok = await confirmDialog({
      title: t('common.confirmDeleteTitle'),
      message: t('projects.confirmDelete'),
      confirmLabel: t('common.delete'),
      variant: 'danger',
    });
    if (!ok) return;
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/projects/${editingId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await load();
      openList();
    } catch {
      setError(t('common.errorDelete'));
    }
  };

  const subtitle = search.trim()
    ? `${filtered.length} / ${projects.length}`
    : t('common.totalRecords', { count: projects.length });

  if (view === 'detail') {
    return (
      <div>
        <button
          type="button"
          onClick={openList}
          className="mb-6 flex items-center gap-1.5 text-[13px] font-medium text-[#0B2D5E] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('projects.backToList')}
        </button>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">
              {editingId ? t('projects.edit') : t('projects.create')}
            </h1>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-[10px] border border-red-200 px-4 py-2.5 text-[13px] font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" /> {t('common.delete')}
            </button>
          )}
        </div>

        {error && (
          <p className="mb-4 rounded-[10px] border border-red-200/80 bg-red-50 px-4 py-2 text-[13px] text-red-600">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSave}
          className="rounded-[14px] border border-black/[0.04] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('projects.formNameKo')}</span>
              <input
                required
                value={form.nameKo}
                onChange={(e) => setForm({ ...form, nameKo: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('projects.formNameEn')}</span>
              <input
                required
                value={form.nameEn}
                onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                className={inputClass}
              />
            </label>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('projects.formClient')}</span>
              <input
                required
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('projects.formLocation')}</span>
              <input
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={inputClass}
              />
            </label>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('projects.formYear')}</span>
              <input
                type="number"
                required
                value={form.completionYear}
                onChange={(e) => setForm({ ...form, completionYear: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('projects.formCategory')}</span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('projects.formStatus')}</span>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputClass}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('projects.formIndustry')}</span>
              <input
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('projects.formSlug')}</span>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="auto-generated"
                className={inputClass}
              />
            </label>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('projects.formScopeKo')}</span>
              <textarea
                required
                rows={2}
                value={form.scopeKo}
                onChange={(e) => setForm({ ...form, scopeKo: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('projects.formScopeEn')}</span>
              <textarea
                required
                rows={2}
                value={form.scopeEn}
                onChange={(e) => setForm({ ...form, scopeEn: e.target.value })}
                className={inputClass}
              />
            </label>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('projects.formDescKo')}</span>
              <textarea
                required
                rows={3}
                value={form.descriptionKo}
                onChange={(e) => setForm({ ...form, descriptionKo: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('projects.formDescEn')}</span>
              <textarea
                required
                rows={3}
                value={form.descriptionEn}
                onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                className={inputClass}
              />
            </label>
          </div>

          <div className="mb-4">
            <span className="mb-1 block text-[13px] font-medium">{t('projects.uploadImage')}</span>
            <p className="mb-3 text-[12px] text-[#86868B]">{t('projects.imagesHint')}</p>
            <div className="flex flex-wrap items-start gap-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files?.length) handleUpload(files);
                }}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 rounded-[10px] border border-black/[0.08] px-4 py-2 text-[13px] hover:bg-black/[0.02] disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                {uploading ? t('projects.uploading') : t('projects.uploadBtn')}
              </button>
              {form.images.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="relative h-20 w-28 overflow-hidden rounded-[10px] border border-black/[0.08]"
                >
                  <Image
                    src={url}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={isApiImage(url)}
                  />
                  {index === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-black/55 py-0.5 text-center text-[10px] font-medium text-white">
                      {t('projects.primaryImage')}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 rounded bg-black/50 p-0.5 text-white"
                    aria-label={t('common.delete')}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <label className="mb-6 flex items-center gap-2 text-[13px]">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            {t('projects.formFeatured')}
          </label>

          <div className="flex justify-end gap-2 border-t border-black/[0.04] pt-4">
            <button
              type="button"
              onClick={openList}
              className="rounded-[10px] border border-black/[0.08] px-4 py-2 text-[13px]"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-[10px] bg-[#0B2D5E] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#153E7E] disabled:opacity-50"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">{t('projects.title')}</h1>
          <p className="mt-1 text-[13px] text-[#86868B]">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-[10px] bg-[#0B2D5E] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#153E7E]"
        >
          <Plus className="h-4 w-4" /> {t('common.add')}
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-[10px] border border-red-200/80 bg-red-50 px-4 py-2 text-[13px] text-red-600">
          {error}
        </p>
      )}

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#86868B]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('projects.search')}
            className="w-full rounded-[10px] border border-black/[0.08] py-2 pl-9 pr-3 text-[13px] outline-none focus:border-[#3E8ED0]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-[14px] border border-black/[0.04] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-[#0B2D5E] text-white">
              <tr>
                <th className="px-4 py-2 text-left text-[13px] font-semibold">{t('projects.colName')}</th>
                <th className="px-4 py-2 text-left text-[13px] font-semibold">{t('projects.colClient')}</th>
                <th className="w-24 px-4 py-2 text-center text-[13px] font-semibold">{t('projects.colYear')}</th>
                <th className="w-28 px-4 py-2 text-center text-[13px] font-semibold">{t('projects.colStatus')}</th>
                <th className="w-24 px-4 py-2 text-center text-[13px] font-semibold">{t('projects.colFeatured')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project, i) => (
                <tr
                  key={project.id}
                  onClick={() => openDetail(project)}
                  className={`cursor-pointer transition-colors hover:bg-[#0B2D5E]/5 ${i % 2 === 0 ? 'bg-white' : 'bg-black/[0.02]'}`}
                >
                  <td className="px-4 py-2 text-[13px] font-medium text-[#1D1D1F]">
                    <div className="flex items-center gap-3">
                      <div className="relative h-8 w-11 shrink-0 overflow-hidden rounded-[6px] bg-black/[0.04]">
                        <Image
                          src={resolveProjectImage(project)}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized={isApiImage(resolveProjectImage(project))}
                        />
                      </div>
                      <span>{project.name.ko}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-[13px] text-[#636366]">{project.client}</td>
                  <td className="px-4 py-2 text-center text-[13px] text-[#636366]">{project.completionYear}</td>
                  <td className="px-4 py-2 text-center text-[13px] text-[#636366]">{project.status}</td>
                  <td className="px-4 py-2 text-center text-[13px]">
                    {project.featured ? (
                      <span className="rounded-full bg-[#0B2D5E]/10 px-2 py-0.5 text-[11px] font-medium text-[#0B2D5E]">
                        {t('projects.featured')}
                      </span>
                    ) : (
                      <span className="text-[#86868B]">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[13px] text-[#86868B]">
                    {search.trim() ? t('projects.noResults') : t('projects.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
