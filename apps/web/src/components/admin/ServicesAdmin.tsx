'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Search, ArrowLeft } from 'lucide-react';
import type { ApiService, ServiceLocalizedItem } from '@/lib/services';
import { SERVICE_ICONS, DEFAULT_SERVICE_CAPABILITIES, DEFAULT_SERVICE_PROCESS } from '@/lib/services';
import { getServiceIcon } from '@/lib/service-icons';
import { API_URL } from '@/lib/utils';
import { useAdminT } from '@/lib/admin/AdminLocaleProvider';
import { useConfirm } from '@/components/admin/ConfirmDialogProvider';

type View = 'list' | 'detail';

type FormState = {
  slug: string;
  icon: string;
  titleKo: string;
  titleEn: string;
  overviewKo: string;
  overviewEn: string;
  process: ServiceLocalizedItem[];
  capabilities: ServiceLocalizedItem[];
  order: string;
};

const emptyItem = (): ServiceLocalizedItem => ({ ko: '', en: '' });

const emptyForm: FormState = {
  slug: '',
  icon: 'Wrench',
  titleKo: '',
  titleEn: '',
  overviewKo: '',
  overviewEn: '',
  process: DEFAULT_SERVICE_PROCESS.map((item) => ({ ...item })),
  capabilities: DEFAULT_SERVICE_CAPABILITIES.map((item) => ({ ...item })),
  order: '0',
};

function serviceToForm(service: ApiService): FormState {
  return {
    slug: service.slug,
    icon: service.icon,
    titleKo: service.title.ko,
    titleEn: service.title.en,
    overviewKo: service.overview.ko,
    overviewEn: service.overview.en,
    process: service.process.map((item) => ({ ...item })),
    capabilities: service.capabilities.map((item) => ({ ...item })),
    order: String(service.order),
  };
}

function toPayload(form: FormState) {
  return {
    slug: form.slug || undefined,
    icon: form.icon,
    title: { ko: form.titleKo, en: form.titleEn },
    overview: { ko: form.overviewKo, en: form.overviewEn },
    process: form.process,
    capabilities: form.capabilities,
    order: Number(form.order) || 0,
  };
}

const servicesAdminInputClass =
  'w-full rounded-[10px] border border-black/[0.08] px-3 py-2 text-[13px] outline-none focus:border-[#3E8ED0]';

function LocalizedListEditor({
  title,
  hint,
  items,
  addLabel,
  colKo,
  colEn,
  onChange,
  onAdd,
  onRemove,
}: {
  title: string;
  hint: string;
  items: ServiceLocalizedItem[];
  addLabel: string;
  colKo: string;
  colEn: string;
  onChange: (index: number, field: 'ko' | 'en', value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="mb-6">
      <div className="mb-2">
        <p className="text-[13px] font-medium text-[#1D1D1F]">{title}</p>
        <p className="mt-1 text-[12px] text-[#86868B]">{hint}</p>
      </div>
      <div className="overflow-hidden rounded-[10px] border border-black/[0.08]">
        <table className="w-full">
          <thead className="bg-[#FAFAFA]">
            <tr>
              <th className="w-10 px-3 py-2 text-center text-[11px] font-semibold text-[#86868B]">#</th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold text-[#86868B]">{colKo}</th>
              <th className="px-3 py-2 text-left text-[11px] font-semibold text-[#86868B]">{colEn}</th>
              <th className="w-10 px-2 py-2" />
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-t border-black/[0.06]">
                <td className="px-3 py-2 text-center text-[12px] text-[#86868B]">{index + 1}</td>
                <td className="px-3 py-2">
                  <input
                    value={item.ko}
                    onChange={(e) => onChange(index, 'ko', e.target.value)}
                    className={servicesAdminInputClass}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={item.en}
                    onChange={(e) => onChange(index, 'en', e.target.value)}
                    className={servicesAdminInputClass}
                  />
                </td>
                <td className="px-2 py-2">
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[#86868B] hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-2 flex items-center gap-1.5 rounded-[10px] border border-black/[0.08] px-3 py-1.5 text-[12px] font-medium text-[#0B2D5E] hover:bg-[#0B2D5E]/5"
      >
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </button>
    </div>
  );
}

export function ServicesAdmin() {
  const { t } = useAdminT();
  const confirmDialog = useConfirm();
  const [items, setItems] = useState<ApiService[]>([]);
  const [view, setView] = useState<View>('list');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/services`);
      if (!res.ok) throw new Error('Failed');
      setItems(await res.json());
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
      ? items.filter(
          (s) =>
            s.title.ko.toLowerCase().includes(q) ||
            s.title.en.toLowerCase().includes(q) ||
            s.slug.toLowerCase().includes(q),
        )
      : items;
    return [...list].sort((a, b) => a.order - b.order || a.title.ko.localeCompare(b.title.ko));
  }, [items, search]);

  const openList = () => {
    setView('list');
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, order: String(items.length) });
    setError('');
    setView('detail');
  };

  const openDetail = (service: ApiService) => {
    setEditingId(service.id);
    setForm(serviceToForm(service));
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
        editingId ? `${API_URL}/api/services/${editingId}` : `${API_URL}/api/services`,
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
      message: t('services.confirmDelete'),
      confirmLabel: t('common.delete'),
      variant: 'danger',
    });
    if (!ok) return;
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/services/${editingId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await load();
      openList();
    } catch {
      setError(t('common.errorDelete'));
    }
  };

  const subtitle = search.trim()
    ? `${filtered.length} / ${items.length}`
    : t('common.totalRecords', { count: items.length });

  if (view === 'detail') {
    const PreviewIcon = getServiceIcon(form.icon);

    return (
      <div>
        <button
          type="button"
          onClick={openList}
          className="mb-6 flex items-center gap-1.5 text-[13px] font-medium text-[#0B2D5E] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('services.backToList')}
        </button>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">
            {editingId ? t('services.edit') : t('services.create')}
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
              <span className="mb-1 block font-medium">{t('services.formTitleKo')}</span>
              <input
                required
                value={form.titleKo}
                onChange={(e) => setForm({ ...form, titleKo: e.target.value })}
                className={servicesAdminInputClass}
              />
            </label>
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('services.formTitleEn')}</span>
              <input
                required
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                className={servicesAdminInputClass}
              />
            </label>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <label className="block text-[13px] sm:col-span-2">
              <span className="mb-1 block font-medium">{t('services.formIcon')}</span>
              <select
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className={servicesAdminInputClass}
              >
                {SERVICE_ICONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </label>
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('services.formOrder')}</span>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                className={servicesAdminInputClass}
              />
            </label>
          </div>

          <div className="mb-4 flex items-center gap-3 rounded-[10px] border border-black/[0.06] bg-[#FAFAFA] px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B2D5E]">
              <PreviewIcon className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-[12px] text-[#86868B]">{t('services.iconPreview')}</span>
          </div>

          <label className="mb-4 block text-[13px]">
            <span className="mb-1 block font-medium">{t('services.formSlug')}</span>
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="auto-generated"
              className={servicesAdminInputClass}
            />
          </label>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('services.formOverviewKo')}</span>
              <textarea
                required
                rows={4}
                value={form.overviewKo}
                onChange={(e) => setForm({ ...form, overviewKo: e.target.value })}
                className={servicesAdminInputClass}
              />
            </label>
            <label className="block text-[13px]">
              <span className="mb-1 block font-medium">{t('services.formOverviewEn')}</span>
              <textarea
                required
                rows={4}
                value={form.overviewEn}
                onChange={(e) => setForm({ ...form, overviewEn: e.target.value })}
                className={servicesAdminInputClass}
              />
            </label>
          </div>

          <LocalizedListEditor
            title={t('services.formProcess')}
            hint={t('services.formProcessHint')}
            items={form.process}
            addLabel={t('services.addProcessStep')}
            colKo={t('services.colStepKo')}
            colEn={t('services.colStepEn')}
            onChange={(index, field, value) =>
              setForm((f) => ({
                ...f,
                process: f.process.map((item, i) =>
                  i === index ? { ...item, [field]: value } : item,
                ),
              }))
            }
            onAdd={() => setForm((f) => ({ ...f, process: [...f.process, emptyItem()] }))}
            onRemove={(index) =>
              setForm((f) => ({ ...f, process: f.process.filter((_, i) => i !== index) }))
            }
          />

          <LocalizedListEditor
            title={t('services.formCapabilities')}
            hint={t('services.formCapabilitiesHint')}
            items={form.capabilities}
            addLabel={t('services.addCapability')}
            colKo={t('services.colStepKo')}
            colEn={t('services.colStepEn')}
            onChange={(index, field, value) =>
              setForm((f) => ({
                ...f,
                capabilities: f.capabilities.map((item, i) =>
                  i === index ? { ...item, [field]: value } : item,
                ),
              }))
            }
            onAdd={() => setForm((f) => ({ ...f, capabilities: [...f.capabilities, emptyItem()] }))}
            onRemove={(index) =>
              setForm((f) => ({
                ...f,
                capabilities: f.capabilities.filter((_, i) => i !== index),
              }))
            }
          />

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
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">{t('services.title')}</h1>
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
            placeholder={t('services.search')}
            className="w-full rounded-[10px] border border-black/[0.08] py-2 pl-9 pr-3 text-[13px] outline-none focus:border-[#3E8ED0]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-[14px] border border-black/[0.04] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-[#0B2D5E] text-white">
              <tr>
                <th className="w-16 px-4 py-2 text-center text-[13px] font-semibold">{t('services.colOrder')}</th>
                <th className="w-16 px-4 py-2 text-center text-[13px] font-semibold">{t('services.colIcon')}</th>
                <th className="px-4 py-2 text-left text-[13px] font-semibold">{t('services.colName')}</th>
                <th className="px-4 py-2 text-left text-[13px] font-semibold">{t('services.colSlug')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((service, i) => {
                const Icon = getServiceIcon(service.icon);
                return (
                  <tr
                    key={service.id}
                    onClick={() => openDetail(service)}
                    className={`cursor-pointer transition-colors hover:bg-[#0B2D5E]/5 ${i % 2 === 0 ? 'bg-white' : 'bg-black/[0.02]'}`}
                  >
                    <td className="px-4 py-2 text-center text-[13px] text-[#636366]">{service.order}</td>
                    <td className="px-4 py-2">
                      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B2D5E]/8">
                        <Icon className="h-4 w-4 text-[#0B2D5E]" strokeWidth={2} />
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <p className="text-[13px] font-medium text-[#1D1D1F]">{service.title.ko}</p>
                      <p className="mt-0.5 text-[12px] text-[#86868B]">{service.title.en}</p>
                    </td>
                    <td className="px-4 py-2 text-[13px] text-[#636366]">{service.slug}</td>
                  </tr>
                );
              })}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-[13px] text-[#86868B]">
                    {search.trim() ? t('services.noResults') : t('services.empty')}
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
