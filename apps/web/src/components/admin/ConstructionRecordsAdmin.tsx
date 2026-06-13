'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2, Upload, ArrowLeft } from 'lucide-react';
import type { ConstructionRecord, ConstructionRecordsPage } from '@winajes/shared';
import { formatInr, parseAmountInput } from '@/lib/format';
import { API_URL } from '@/lib/utils';
import { useAdminT } from '@/lib/admin/AdminLocaleProvider';
import { useConfirm } from '@/components/admin/ConfirmDialogProvider';

type View = 'list' | 'detail';

type FormState = {
  constructionDate: string;
  client: string;
  description: string;
  amount: string;
};

const emptyForm: FormState = {
  constructionDate: '',
  client: '',
  description: '',
  amount: '',
};

function recordToForm(record: ConstructionRecord): FormState {
  return {
    constructionDate: record.constructionDate,
    client: record.client,
    description: record.description,
    amount: record.amount,
  };
}

const inputClass =
  'w-full rounded-[10px] border border-black/[0.08] px-3 py-2 text-[13px] outline-none focus:border-[#3E8ED0]';

export function ConstructionRecordsAdmin() {
  const { t } = useAdminT();
  const confirmDialog = useConfirm();
  const [records, setRecords] = useState<ConstructionRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [year, setYear] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [years, setYears] = useState<number[]>([]);
  const [view, setView] = useState<View>('list');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '50' });
      if (year) params.set('year', year);
      if (clientFilter.trim()) params.set('client', clientFilter.trim());
      const res = await fetch(`${API_URL}/api/construction-records?${params}`);
      if (!res.ok) throw new Error('Failed to load records');
      const data: ConstructionRecordsPage = await res.json();
      setRecords(data.items);
      setTotal(data.total);
    } catch {
      setError(t('common.errorLoad'));
    } finally {
      setLoading(false);
    }
  }, [page, year, clientFilter, t]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    fetch(`${API_URL}/api/construction-records/years`)
      .then((r) => r.json())
      .then(setYears)
      .catch(() => {});
  }, [records.length]);

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

  const openDetail = (record: ConstructionRecord) => {
    setEditingId(record.id);
    setForm(recordToForm(record));
    setError('');
    setView('detail');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      constructionDate: form.constructionDate,
      client: form.client,
      description: form.description,
      amount: parseAmountInput(form.amount),
    };

    try {
      const res = await fetch(
        editingId
          ? `${API_URL}/api/construction-records/${editingId}`
          : `${API_URL}/api/construction-records`,
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
      message: t('performance.confirmDelete'),
      confirmLabel: t('common.delete'),
      variant: 'danger',
    });
    if (!ok) return;
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/construction-records/${editingId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await load();
      openList();
    } catch {
      setError(t('common.errorDelete'));
    }
  };

  const handleImport = async () => {
    setError('');
    try {
      let recordsToImport: Array<Record<string, unknown>>;

      if (importText.trim().startsWith('[')) {
        recordsToImport = JSON.parse(importText);
      } else {
        recordsToImport = importText
          .trim()
          .split('\n')
          .filter(Boolean)
          .map((line) => {
            const [constructionDate, client, description, amount] = line.split('\t');
            if (!constructionDate || !client) {
              const parts = line.split(',');
              return {
                constructionDate: parts[0]?.trim(),
                client: parts[1]?.trim(),
                description: parts[2]?.trim(),
                amount: parts[3]?.trim(),
              };
            }
            return { constructionDate, client, description, amount };
          });
      }

      const normalized = recordsToImport.map((r) => ({
        constructionDate: String(r.constructionDate),
        client: String(r.client),
        description: String(r.description ?? ''),
        amount: parseAmountInput(String(r.amount ?? '0')),
      }));

      const res = await fetch(`${API_URL}/api/construction-records/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: normalized, replace: false }),
      });
      if (!res.ok) throw new Error('Import failed');
      setShowImport(false);
      setImportText('');
      await load();
    } catch {
      setError(t('performance.errorImport'));
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / 50));

  if (view === 'detail') {
    return (
      <div>
        <button
          type="button"
          onClick={openList}
          className="mb-6 flex items-center gap-1.5 text-[13px] font-medium text-[#0B2D5E] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('performance.backToList')}
        </button>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">
            {editingId ? t('performance.detail') : t('performance.create')}
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
          <label className="mb-3 block text-[13px]">
            <span className="mb-1 block font-medium">{t('performance.formDate')}</span>
            <input
              type="date"
              required
              value={form.constructionDate}
              onChange={(e) => setForm({ ...form, constructionDate: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="mb-3 block text-[13px]">
            <span className="mb-1 block font-medium">{t('performance.formClient')}</span>
            <input
              type="text"
              required
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="mb-3 block text-[13px]">
            <span className="mb-1 block font-medium">{t('performance.formDesc')}</span>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="mb-6 block text-[13px]">
            <span className="mb-1 block font-medium">{t('performance.formAmount')}</span>
            <input
              type="text"
              required
              inputMode="numeric"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className={inputClass}
            />
            {form.amount && (
              <p className="mt-1.5 text-[12px] text-[#86868B]">
                {formatInr(parseAmountInput(form.amount))}
              </p>
            )}
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
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">{t('performance.title')}</h1>
          <p className="mt-1 text-[13px] text-[#86868B]">{t('common.totalRecords', { count: total.toLocaleString() })}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowImport((v) => !v)}
            className="flex items-center gap-2 rounded-[10px] border border-black/[0.08] px-4 py-2.5 text-[13px] font-semibold text-[#0B2D5E] hover:bg-[#0B2D5E]/5"
          >
            <Upload className="h-4 w-4" /> {t('performance.import')}
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 rounded-[10px] bg-[#0B2D5E] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#153E7E]"
          >
            <Plus className="h-4 w-4" /> {t('common.add')}
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-[10px] border border-red-200/80 bg-red-50 px-4 py-2 text-[13px] text-red-600">
          {error}
        </p>
      )}

      {showImport && (
        <div className="mb-6 rounded-[14px] border border-black/[0.04] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h2 className="mb-2 text-[16px] font-semibold text-[#1D1D1F]">{t('performance.importTitle')}</h2>
          <p className="mb-3 text-[13px] text-[#86868B]">{t('performance.importPaste')}</p>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={8}
            className="mb-3 w-full rounded-[10px] border border-black/[0.08] px-3 py-2 font-mono text-[13px] outline-none focus:border-[#3E8ED0]"
            placeholder={'2024-08-29,CEV ENGINEERING,Supply & erection works,1369774'}
          />
          <button
            type="button"
            onClick={handleImport}
            className="rounded-[10px] bg-[#0B2D5E] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#153E7E]"
          >
            {t('performance.importBtn')}
          </button>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={year}
          onChange={(e) => { setYear(e.target.value); setPage(1); }}
          className="rounded-[10px] border border-black/[0.08] px-3 py-2 text-[13px] outline-none focus:border-[#3E8ED0]"
        >
          <option value="">{t('performance.allYears')}</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <input
          type="search"
          value={clientFilter}
          onChange={(e) => { setClientFilter(e.target.value); setPage(1); }}
          placeholder={t('performance.searchClient')}
          className="min-w-[200px] rounded-[10px] border border-black/[0.08] px-3 py-2 text-[13px] outline-none focus:border-[#3E8ED0]"
        />
      </div>

      <div className="overflow-hidden rounded-[14px] border border-black/[0.04] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-[#0B2D5E] text-white">
              <tr>
                <th className="px-4 py-2 text-left text-[13px] font-semibold">{t('performance.colDate')}</th>
                <th className="px-4 py-2 text-left text-[13px] font-semibold">{t('performance.colClient')}</th>
                <th className="px-4 py-2 text-left text-[13px] font-semibold">{t('performance.colDesc')}</th>
                <th className="px-4 py-2 text-right text-[13px] font-semibold">{t('performance.colAmount')}</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, i) => (
                <tr
                  key={record.id}
                  onClick={() => openDetail(record)}
                  className={`cursor-pointer transition-colors hover:bg-[#0B2D5E]/5 ${i % 2 === 0 ? 'bg-white' : 'bg-black/[0.02]'}`}
                >
                  <td className="px-4 py-2 text-[13px] whitespace-nowrap">{record.constructionDate}</td>
                  <td className="px-4 py-2 text-[13px] font-medium text-[#1D1D1F]">{record.client}</td>
                  <td className="max-w-md truncate px-4 py-2 text-[13px] text-[#636366]">{record.description}</td>
                  <td className="px-4 py-2 text-right text-[13px] font-semibold whitespace-nowrap">
                    {formatInr(record.amount)}
                  </td>
                </tr>
              ))}
              {!loading && records.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-[13px] text-[#86868B]">
                    {t('performance.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-[10px] border border-black/[0.08] px-3 py-1.5 text-[13px] disabled:opacity-40"
          >
            {t('performance.prev')}
          </button>
          <span className="text-[13px] text-[#636366]">{page} / {totalPages}</span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-[10px] border border-black/[0.08] px-3 py-1.5 text-[13px] disabled:opacity-40"
          >
            {t('performance.next')}
          </button>
        </div>
      )}
    </div>
  );
}
