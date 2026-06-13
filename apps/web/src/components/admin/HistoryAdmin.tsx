'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Search, ArrowLeft } from 'lucide-react';
import type { ApiTimelineEvent } from '@/lib/timeline';
import { API_URL } from '@/lib/utils';
import { useAdminT } from '@/lib/admin/AdminLocaleProvider';
import { useConfirm } from '@/components/admin/ConfirmDialogProvider';

type View = 'list' | 'detail';

type FormState = {
  year: string;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  order: string;
};

const emptyForm: FormState = {
  year: String(new Date().getFullYear()),
  titleKo: '',
  titleEn: '',
  descKo: '',
  descEn: '',
  order: '0',
};

function eventToForm(event: ApiTimelineEvent): FormState {
  return {
    year: String(event.year),
    titleKo: event.title.ko,
    titleEn: event.title.en,
    descKo: event.description.ko,
    descEn: event.description.en,
    order: String(event.order),
  };
}

function toPayload(form: FormState) {
  const year = Number(form.year);
  return {
    year,
    title: { ko: form.titleKo, en: form.titleEn },
    description: { ko: form.descKo, en: form.descEn },
    order: Number(form.order) || year,
  };
}

const inputClass =
  'w-full rounded-[10px] border border-black/[0.08] px-3 py-2 text-[13px] outline-none focus:border-[#3E8ED0]';

export function HistoryAdmin() {
  const { t } = useAdminT();
  const confirmDialog = useConfirm();
  const [view, setView] = useState<View>('list');
  const [events, setEvents] = useState<ApiTimelineEvent[]>([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/timeline`);
      if (!res.ok) throw new Error('Load failed');
      setEvents(await res.json());
    } catch {
      setError(t('common.errorLoad'));
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? events.filter(
          (e) =>
            String(e.year).includes(q) ||
            e.title.ko.toLowerCase().includes(q) ||
            e.title.en.toLowerCase().includes(q) ||
            e.description.ko.toLowerCase().includes(q) ||
            e.description.en.toLowerCase().includes(q),
        )
      : events;
    return [...list].sort((a, b) => a.order - b.order || a.year - b.year);
  }, [events, search]);

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

  const openDetail = (event: ApiTimelineEvent) => {
    setEditingId(event.id);
    setForm(eventToForm(event));
    setError('');
    setView('detail');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = toPayload(form);

    try {
      const res = await fetch(
        editingId ? `${API_URL}/api/timeline/${editingId}` : `${API_URL}/api/timeline`,
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
      message: t('history.confirmDelete'),
      confirmLabel: t('common.delete'),
      variant: 'danger',
    });
    if (!ok) return;
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/timeline/${editingId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await load();
      openList();
    } catch {
      setError(t('common.errorDelete'));
    }
  };

  if (view === 'detail') {
    return (
      <div>
        <button
          type="button"
          onClick={openList}
          className="mb-6 flex items-center gap-1.5 text-[13px] font-medium text-[#636366] transition-colors hover:text-[#1D1D1F]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('history.backToList')}
        </button>

        <h1 className="mb-6 text-[28px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">
          {editingId ? t('history.edit') : t('history.create')}
        </h1>

        {error && (
          <p className="mb-4 rounded-[10px] bg-red-50 px-4 py-2.5 text-[13px] text-red-600">{error}</p>
        )}

        <form
          onSubmit={handleSave}
          className="space-y-6 rounded-[14px] border border-black/[0.04] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#86868B]">{t('history.formYear')}</label>
              <input
                type="number"
                className={inputClass}
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#86868B]">{t('history.formOrder')}</label>
              <input
                type="number"
                className={inputClass}
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#86868B]">{t('history.formTitleKo')}</label>
              <input
                className={inputClass}
                value={form.titleKo}
                onChange={(e) => setForm({ ...form, titleKo: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#86868B]">{t('history.formTitleEn')}</label>
              <input
                className={inputClass}
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#86868B]">{t('history.formDescKo')}</label>
              <textarea
                className={`${inputClass} min-h-[100px] resize-y`}
                value={form.descKo}
                onChange={(e) => setForm({ ...form, descKo: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#86868B]">{t('history.formDescEn')}</label>
              <textarea
                className={`${inputClass} min-h-[100px] resize-y`}
                value={form.descEn}
                onChange={(e) => setForm({ ...form, descEn: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-black/[0.04] pt-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-[10px] bg-[#0B2D5E] px-5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? t('common.loading') : t('common.save')}
            </button>
            <button
              type="button"
              onClick={openList}
              className="rounded-[10px] px-5 py-2 text-[13px] font-medium text-[#636366] transition-colors hover:bg-black/[0.04]"
            >
              {t('common.cancel')}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={handleDelete}
                className="ml-auto inline-flex items-center gap-1.5 rounded-[10px] px-4 py-2 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                {t('common.delete')}
              </button>
            ) : null}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">{t('history.title')}</h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#0B2D5E] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          {t('history.create')}
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-[10px] border border-black/[0.06] bg-white px-3 py-2">
        <Search className="h-4 w-4 text-[#86868B]" />
        <input
          type="search"
          placeholder={t('history.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#86868B]"
        />
      </div>

      {error && (
        <p className="mb-4 rounded-[10px] bg-red-50 px-4 py-2.5 text-[13px] text-red-600">{error}</p>
      )}

      <div className="overflow-hidden rounded-[14px] border border-black/[0.04] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <table className="w-full">
          <thead className="border-b border-black/[0.04] bg-[#FAFAFA]">
            <tr>
              <th className="px-4 py-2 text-left text-[12px] font-semibold text-[#86868B]">{t('history.colOrder')}</th>
              <th className="px-4 py-2 text-left text-[12px] font-semibold text-[#86868B]">{t('history.colYear')}</th>
              <th className="px-4 py-2 text-left text-[12px] font-semibold text-[#86868B]">{t('history.colTitle')}</th>
              <th className="px-4 py-2 text-left text-[12px] font-semibold text-[#86868B]">{t('history.colDesc')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((event) => (
              <tr
                key={event.id}
                onClick={() => openDetail(event)}
                className="cursor-pointer border-t border-black/[0.04] transition-colors hover:bg-[#FAFAFA]"
              >
                <td className="px-4 py-3 text-[13px] text-[#86868B]">{event.order}</td>
                <td className="px-4 py-3 text-[13px] font-semibold text-[#0B2D5E]">{event.year}</td>
                <td className="px-4 py-3 text-[13px] text-[#1D1D1F]">{event.title.ko}</td>
                <td className="max-w-xs truncate px-4 py-3 text-[13px] text-[#636366]">{event.description.ko}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-[13px] text-[#86868B]">
                  {search ? t('history.noResults') : t('history.empty')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[12px] text-[#86868B]">{t('common.totalRecords', { count: filtered.length })}</p>
    </div>
  );
}
