'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Search, ArrowLeft, Upload, X } from 'lucide-react';
import type { NewsArticle } from '@/lib/shared';
import { API_URL } from '@/lib/utils';
import { useAdminT } from '@/lib/admin/AdminLocaleProvider';
import { useConfirm } from '@/components/admin/ConfirmDialogProvider';

const CATEGORIES = ['company', 'project', 'press', 'media'] as const;

type View = 'list' | 'detail';

type FormState = {
  slug: string;
  titleKo: string;
  titleEn: string;
  excerptKo: string;
  excerptEn: string;
  contentKo: string;
  contentEn: string;
  category: string;
  tags: string;
  image: string;
  publishedAt: string;
};

const emptyForm: FormState = {
  slug: '',
  titleKo: '',
  titleEn: '',
  excerptKo: '',
  excerptEn: '',
  contentKo: '',
  contentEn: '',
  category: 'company',
  tags: '',
  image: '',
  publishedAt: new Date().toISOString().slice(0, 10),
};

function articleToForm(article: NewsArticle): FormState {
  return {
    slug: article.slug,
    titleKo: article.title.ko,
    titleEn: article.title.en,
    excerptKo: article.excerpt.ko,
    excerptEn: article.excerpt.en,
    contentKo: article.content.ko,
    contentEn: article.content.en,
    category: article.category,
    tags: article.tags.join(', '),
    image: article.image,
    publishedAt: article.publishedAt.slice(0, 10),
  };
}

function toPayload(form: FormState) {
  return {
    slug: form.slug || undefined,
    title: { ko: form.titleKo, en: form.titleEn },
    excerpt: { ko: form.excerptKo, en: form.excerptEn },
    content: { ko: form.contentKo, en: form.contentEn },
    category: form.category,
    tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    image: form.image,
    publishedAt: form.publishedAt,
  };
}

const inputClass =
  'w-full rounded-[10px] border border-black/[0.08] px-3 py-2 text-[13px] outline-none focus:border-[#3E8ED0]';

export function NewsAdmin() {
  const { t } = useAdminT();
  const confirmDialog = useConfirm();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [view, setView] = useState<View>('list');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/news`);
      if (!res.ok) throw new Error('Failed');
      setArticles(await res.json());
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
      ? articles.filter(
          (a) =>
            a.title.ko.toLowerCase().includes(q) ||
            a.title.en.toLowerCase().includes(q),
        )
      : articles;
    return [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [articles, search]);

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

  const openDetail = (article: NewsArticle) => {
    setEditingId(article.id);
    setForm(articleToForm(article));
    setError('');
    setView('detail');
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch(`${API_URL}/api/uploads/news-image`, { method: 'POST', body });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setForm((f) => ({ ...f, image: data.url }));
      if (fileRef.current) fileRef.current.value = '';
    } catch {
      setError(t('common.errorUpload'));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = toPayload(form);

    try {
      const res = await fetch(
        editingId ? `${API_URL}/api/news/${editingId}` : `${API_URL}/api/news`,
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
      message: t('news.confirmDelete'),
      confirmLabel: t('common.delete'),
      variant: 'danger',
    });
    if (!ok) return;
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/news/${editingId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await load();
      openList();
    } catch {
      setError(t('common.errorDelete'));
    }
  };

  const subtitle = search.trim()
    ? `${filtered.length} / ${articles.length}`
    : t('common.totalRecords', { count: articles.length });

  if (view === 'detail') {
    return (
      <div>
        <button
          type="button"
          onClick={openList}
          className="mb-6 flex items-center gap-1.5 text-[13px] font-medium text-[#0B2D5E] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('news.backToList')}
        </button>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">
            {editingId ? t('news.detail') : t('news.create')}
          </h1>
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
              <span className="mb-1 block font-medium">{t('news.formTitleKo')}</span>
              <input required value={form.titleKo} onChange={(e) => setForm({ ...form, titleKo: e.target.value })} className={inputClass} />
            </label>
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('news.formTitleEn')}</span>
              <input required value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} className={inputClass} />
            </label>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('news.formExcerptKo')}</span>
              <textarea required rows={2} value={form.excerptKo} onChange={(e) => setForm({ ...form, excerptKo: e.target.value })} className={inputClass} />
            </label>
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('news.formExcerptEn')}</span>
              <textarea required rows={2} value={form.excerptEn} onChange={(e) => setForm({ ...form, excerptEn: e.target.value })} className={inputClass} />
            </label>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('news.formContentKo')}</span>
              <textarea required rows={5} value={form.contentKo} onChange={(e) => setForm({ ...form, contentKo: e.target.value })} className={inputClass} />
            </label>
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('news.formContentEn')}</span>
              <textarea required rows={5} value={form.contentEn} onChange={(e) => setForm({ ...form, contentEn: e.target.value })} className={inputClass} />
            </label>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('news.formCategory')}</span>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('news.formPublishedAt')}</span>
              <input type="date" required value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} className={inputClass} />
            </label>
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('news.formSlug')}</span>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" className={inputClass} />
            </label>
          </div>

          <label className="mb-4 block text-[13px]">
            <span className="mb-1 block font-medium">{t('news.formTags')}</span>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="anniversary, milestone" className={inputClass} />
          </label>

          <div className="mb-4">
            <span className="mb-2 block text-[13px] font-medium">{t('news.formImage')}</span>
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 rounded-[10px] border border-black/[0.08] px-4 py-2 text-[13px] hover:bg-black/[0.02] disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                {uploading ? t('news.uploading') : t('news.uploadBtn')}
              </button>
              {form.image && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...form, image: '' });
                    if (fileRef.current) fileRef.current.value = '';
                  }}
                  className="flex items-center gap-1.5 rounded-[10px] border border-red-200 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4" /> {t('common.delete')}
                </button>
              )}
            </div>
          </div>

          {form.image && (
            <div className="relative mb-6 h-48 w-full max-w-lg overflow-hidden rounded-[10px] border border-black/[0.08]">
              <Image src={form.image} alt="" fill className="object-cover" unoptimized />
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-black/[0.04] pt-4">
            <button type="button" onClick={openList} className="rounded-[10px] border border-black/[0.08] px-4 py-2 text-[13px]">
              {t('common.cancel')}
            </button>
            <button type="submit" disabled={saving} className="rounded-[10px] bg-[#0B2D5E] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#153E7E] disabled:opacity-50">
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
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">{t('news.title')}</h1>
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
            placeholder={t('news.search')}
            className="w-full rounded-[10px] border border-black/[0.08] py-2 pl-9 pr-3 text-[13px] outline-none focus:border-[#3E8ED0]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-[14px] border border-black/[0.04] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-[#0B2D5E] text-white">
              <tr>
                <th className="px-4 py-2 text-left text-[13px] font-semibold">{t('news.colTitle')}</th>
                <th className="w-28 px-4 py-2 text-left text-[13px] font-semibold">{t('news.colCategory')}</th>
                <th className="w-32 px-4 py-2 text-left text-[13px] font-semibold">{t('news.colDate')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((article, i) => (
                <tr
                  key={article.id}
                  onClick={() => openDetail(article)}
                  className={`cursor-pointer transition-colors hover:bg-[#0B2D5E]/5 ${i % 2 === 0 ? 'bg-white' : 'bg-black/[0.02]'}`}
                >
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      {article.image && (
                        <div className="relative h-8 w-11 shrink-0 overflow-hidden rounded-[6px] bg-black/[0.04]">
                          <Image src={article.image} alt="" fill className="object-cover" unoptimized />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-[#1D1D1F]">{article.title.ko}</p>
                        <p className="truncate text-[12px] text-[#86868B]">{article.title.en}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-[13px] text-[#636366]">{article.category}</td>
                  <td className="px-4 py-2 text-[13px] text-[#636366] whitespace-nowrap">{article.publishedAt.slice(0, 10)}</td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-[13px] text-[#86868B]">
                    {search.trim() ? t('news.noResults') : t('news.empty')}
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
