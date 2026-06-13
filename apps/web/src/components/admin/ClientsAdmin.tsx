'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Search, Upload, ArrowLeft } from 'lucide-react';
import type { Client } from '@winajes/shared';
import { API_URL } from '@/lib/utils';
import { formatClientName } from '@/lib/format-client-name';
import { useAdminT } from '@/lib/admin/AdminLocaleProvider';
import { useConfirm } from '@/components/admin/ConfirmDialogProvider';

type View = 'list' | 'create';

type FormState = {
  name: string;
  order: string;
};

const emptyForm: FormState = {
  name: '',
  order: '0',
};

function parseImportText(text: string): Array<{ name: string; logo?: string; order?: number }> {
  const trimmed = text.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith('[')) {
    const parsed = JSON.parse(trimmed) as Array<Record<string, unknown>>;
    return parsed.map((row, i) => ({
      name: String(row.name ?? '').trim(),
      logo: row.logo ? String(row.logo) : '',
      order: row.order != null ? Number(row.order) : i,
    })).filter((r) => r.name);
  }

  return trimmed
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      if (line.includes(',')) {
        const [name, logo, order] = line.split(',').map((p) => p.trim());
        return {
          name: name ?? '',
          logo: logo || '',
          order: order ? Number(order) : i,
        };
      }
      return { name: line, order: i };
    })
    .filter((r) => r.name);
}

const inputClass =
  'w-full rounded-[10px] border border-black/[0.08] px-3 py-2 text-[13px] outline-none focus:border-[#3E8ED0]';

const orderInputClass =
  'w-16 rounded-[8px] border border-black/[0.08] px-2 py-1 text-center text-[13px] outline-none focus:border-[#3E8ED0]';

export function ClientsAdmin() {
  const { t } = useAdminT();
  const confirmDialog = useConfirm();
  const [clients, setClients] = useState<Client[]>([]);
  const [view, setView] = useState<View>('list');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState('');
  const [savingNameId, setSavingNameId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormState>(emptyForm);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const skipNameSaveRef = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/clients`);
      if (!res.ok) throw new Error('Failed');
      setClients(await res.json());
    } catch {
      setError(t('common.errorLoad'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (editingNameId) {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    }
  }, [editingNameId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? clients.filter((c) => c.name.toLowerCase().includes(q))
      : clients;
    return [...list].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  }, [clients, search]);

  const filteredIds = useMemo(() => new Set(filtered.map((c) => c.id)), [filtered]);
  const selectedInView = useMemo(
    () => [...selected].filter((id) => filteredIds.has(id)),
    [selected, filteredIds],
  );
  const allSelected = filtered.length > 0 && selectedInView.length === filtered.length;

  const patchClient = async (
    client: Client,
    updates: { logo?: string; order?: number; name?: string },
  ) => {
    const res = await fetch(`${API_URL}/api/clients/${client.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Patch failed');
    const updated = await res.json();
    setClients((prev) => prev.map((c) => (c.id === client.id ? updated : c)));
    return updated;
  };

  const openList = () => {
    setView('list');
    setForm(emptyForm);
    setError('');
  };

  const openCreate = () => {
    setForm({ ...emptyForm, order: String(clients.length) });
    setError('');
    setView('create');
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((c) => next.delete(c.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        filtered.forEach((c) => next.add(c.id));
        return next;
      });
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          category: 'brand',
          logo: '',
          order: Number(form.order) || 0,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      await load();
      openList();
    } catch {
      setError(t('common.errorSave'));
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (clientId: string, file: File) => {
    setUploadingId(clientId);
    setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch(`${API_URL}/api/uploads/client-logo`, { method: 'POST', body });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      const client = clients.find((c) => c.id === clientId);
      if (!client) throw new Error('Client not found');
      await patchClient(client, { logo: data.url });
    } catch {
      setError(t('common.errorUpload'));
    } finally {
      setUploadingId(null);
      uploadTargetRef.current = null;
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleOrderSave = async (client: Client, value: string) => {
    const order = Number(value);
    if (Number.isNaN(order) || order === client.order) return;
    setSavingOrderId(client.id);
    setError('');
    try {
      await patchClient(client, { order });
    } catch {
      setError(t('common.errorSave'));
    } finally {
      setSavingOrderId(null);
    }
  };

  const startNameEdit = (client: Client) => {
    setEditingNameId(client.id);
    setEditingNameValue(formatClientName(client.name));
  };

  const cancelNameEdit = () => {
    setEditingNameId(null);
    setEditingNameValue('');
  };

  const handleNameSave = async (client: Client) => {
    if (skipNameSaveRef.current) {
      skipNameSaveRef.current = false;
      return;
    }
    const trimmed = editingNameValue.trim();
    if (!trimmed) {
      cancelNameEdit();
      return;
    }
    const nextName = formatClientName(trimmed);
    if (nextName === formatClientName(client.name)) {
      cancelNameEdit();
      return;
    }
    setSavingNameId(client.id);
    setError('');
    try {
      await patchClient(client, { name: trimmed });
      cancelNameEdit();
    } catch {
      setError(t('common.errorSave'));
    } finally {
      setSavingNameId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedInView.length === 0) return;
    const ok = await confirmDialog({
      title: t('common.confirmDeleteTitle'),
      message: t('clients.confirmBulkDelete', { count: selectedInView.length }),
      confirmLabel: t('common.delete'),
      variant: 'danger',
    });
    if (!ok) return;
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/clients/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedInView }),
      });
      if (!res.ok) throw new Error('Bulk delete failed');
      setSelected(new Set());
      await load();
    } catch {
      setError(t('common.errorDelete'));
    }
  };

  const handleImport = async () => {
    setError('');
    try {
      const clientsToImport = parseImportText(importText);
      if (clientsToImport.length === 0) throw new Error('Empty');

      const res = await fetch(`${API_URL}/api/clients/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clients: clientsToImport }),
      });
      if (!res.ok) throw new Error('Import failed');
      setShowImport(false);
      setImportText('');
      await load();
    } catch {
      setError(t('clients.errorImport'));
    }
  };

  const subtitle = search.trim()
    ? `${filtered.length} / ${clients.length}`
    : t('common.total', { count: clients.length });

  if (view === 'create') {
    return (
      <div>
        <button
          type="button"
          onClick={openList}
          className="mb-6 flex items-center gap-1.5 text-[13px] font-medium text-[#0B2D5E] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('clients.backToList')}
        </button>

        <h1 className="mb-6 text-[28px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">
          {t('clients.create')}
        </h1>

        {error && (
          <p className="mb-4 rounded-[10px] border border-red-200/80 bg-red-50 px-4 py-2 text-[13px] text-red-600">
            {error}
          </p>
        )}

        <form
          onSubmit={handleCreate}
          className="max-w-md rounded-[14px] border border-black/[0.04] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <label className="mb-3 block text-[13px]">
            <span className="mb-1 block font-medium">{t('clients.formName')}</span>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="mb-6 block text-[13px]">
            <span className="mb-1 block font-medium">{t('clients.formOrder')}</span>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              className={inputClass}
            />
          </label>
          <p className="mb-4 text-[12px] text-[#86868B]">{t('clients.logoHint')}</p>
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
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          const targetId = uploadTargetRef.current;
          if (file && targetId) handleLogoUpload(targetId, file);
        }}
      />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">{t('clients.title')}</h1>
          <p className="mt-1 text-[13px] text-[#86868B]">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowImport((v) => !v)}
            className="flex items-center gap-2 rounded-[10px] border border-black/[0.08] px-4 py-2.5 text-[13px] font-semibold text-[#0B2D5E] hover:bg-[#0B2D5E]/5"
          >
            <Upload className="h-4 w-4" /> {t('clients.import')}
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
          <h2 className="mb-2 text-[16px] font-semibold text-[#1D1D1F]">{t('clients.importTitle')}</h2>
          <p className="mb-3 text-[13px] text-[#86868B]">{t('clients.importPaste')}</p>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={8}
            className="mb-3 w-full rounded-[10px] border border-black/[0.08] px-3 py-2 font-mono text-[13px] outline-none focus:border-[#3E8ED0]"
            placeholder={'Samsung\nDoosan\nPOSCO\nHyundai Glovis'}
          />
          <button
            type="button"
            onClick={handleImport}
            className="rounded-[10px] bg-[#0B2D5E] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#153E7E]"
          >
            {t('clients.importBtn')}
          </button>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#86868B]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('clients.search')}
            className="w-full rounded-[10px] border border-black/[0.08] py-2 pl-9 pr-3 text-[13px] outline-none focus:border-[#3E8ED0]"
          />
        </div>
        {selectedInView.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#636366]">
              {t('clients.selected', { count: selectedInView.length })}
            </span>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 rounded-[10px] border border-red-200 px-3 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" /> {t('clients.bulkDelete')}
            </button>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-[14px] border border-black/[0.04] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead className="bg-[#0B2D5E] text-white">
              <tr>
                <th className="w-12 px-4 py-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="rounded"
                    aria-label={t('common.all')}
                  />
                </th>
                <th className="w-36 px-4 py-2 text-left text-[13px] font-semibold">{t('clients.colLogo')}</th>
                <th className="px-4 py-2 text-left text-[13px] font-semibold">{t('clients.colName')}</th>
                <th className="w-28 px-4 py-2 text-center text-[13px] font-semibold">{t('clients.colOrder')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client, i) => (
                <tr key={client.id} className={i % 2 === 0 ? 'bg-white' : 'bg-black/[0.02]'}>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selected.has(client.id)}
                      onChange={() => toggleSelect(client.id)}
                      className="rounded"
                      aria-label={formatClientName(client.name)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-black/[0.08] bg-[#FAFAFA]">
                        {client.logo ? (
                          <Image src={client.logo} alt="" fill className="object-contain p-0.5" unoptimized />
                        ) : (
                          <span className="text-[10px] font-medium text-[#86868B]">—</span>
                        )}
                      </div>
                      <button
                        type="button"
                        disabled={uploadingId === client.id}
                        onClick={() => {
                          uploadTargetRef.current = client.id;
                          fileRef.current?.click();
                        }}
                        className="rounded-[8px] border border-black/[0.08] px-2 py-1 text-[11px] font-medium text-[#0B2D5E] hover:bg-[#0B2D5E]/5 disabled:opacity-50"
                      >
                        {uploadingId === client.id ? t('common.loading') : t('clients.uploadLogo')}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {editingNameId === client.id ? (
                      <input
                        ref={nameInputRef}
                        type="text"
                        value={editingNameValue}
                        disabled={savingNameId === client.id}
                        onChange={(e) => setEditingNameValue(e.target.value)}
                        onBlur={() => handleNameSave(client)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.currentTarget.blur();
                          }
                          if (e.key === 'Escape') {
                            e.preventDefault();
                            skipNameSaveRef.current = true;
                            cancelNameEdit();
                          }
                        }}
                        className={`${inputClass} min-w-[200px] py-1`}
                      />
                    ) : (
                      <span
                        role="button"
                        tabIndex={0}
                        onDoubleClick={() => startNameEdit(client)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            startNameEdit(client);
                          }
                        }}
                        title={t('clients.editNameHint')}
                        className="cursor-text text-[13px] font-medium text-[#1D1D1F] hover:text-[#0B2D5E]"
                      >
                        {formatClientName(client.name)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="number"
                      defaultValue={client.order}
                      key={`${client.id}-${client.order}`}
                      disabled={savingOrderId === client.id}
                      onBlur={(e) => handleOrderSave(client, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.currentTarget.blur();
                        }
                      }}
                      className={orderInputClass}
                    />
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-[13px] text-[#86868B]">
                    {search.trim() ? t('clients.noResults') : t('clients.empty')}
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
