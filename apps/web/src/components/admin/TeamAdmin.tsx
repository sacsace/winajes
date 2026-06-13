'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Search, ArrowLeft, Upload, X, User } from 'lucide-react';
import type { ApiTeamMember } from '@/lib/team';
import { API_URL } from '@/lib/utils';
import { useAdminT } from '@/lib/admin/AdminLocaleProvider';
import { useConfirm } from '@/components/admin/ConfirmDialogProvider';

type View = 'list' | 'detail';

type FormState = {
  name: string;
  roleKo: string;
  roleEn: string;
  departmentKo: string;
  departmentEn: string;
  bioKo: string;
  bioEn: string;
  photo: string;
  phone: string;
  email: string;
  order: string;
};

const emptyForm: FormState = {
  name: '',
  roleKo: '',
  roleEn: '',
  departmentKo: '',
  departmentEn: '',
  bioKo: '',
  bioEn: '',
  photo: '',
  phone: '',
  email: '',
  order: '0',
};

function memberToForm(member: ApiTeamMember): FormState {
  return {
    name: member.name,
    roleKo: member.role.ko,
    roleEn: member.role.en,
    departmentKo: member.department.ko,
    departmentEn: member.department.en,
    bioKo: member.bio.ko,
    bioEn: member.bio.en,
    photo: member.photo,
    phone: member.phone,
    email: member.email,
    order: String(member.order),
  };
}

function toPayload(form: FormState) {
  return {
    name: form.name,
    role: { ko: form.roleKo, en: form.roleEn },
    department: { ko: form.departmentKo, en: form.departmentEn },
    bio: { ko: form.bioKo, en: form.bioEn },
    photo: form.photo,
    phone: form.phone,
    email: form.email,
    order: Number(form.order) || 0,
  };
}

const inputClass =
  'w-full rounded-[10px] border border-black/[0.08] px-3 py-2 text-[13px] outline-none focus:border-[#3E8ED0]';

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function TeamAdmin() {
  const { t } = useAdminT();
  const confirmDialog = useConfirm();
  const [members, setMembers] = useState<ApiTeamMember[]>([]);
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
      const res = await fetch(`${API_URL}/api/team`);
      if (!res.ok) throw new Error('Failed');
      setMembers(await res.json());
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
      ? members.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.role.ko.toLowerCase().includes(q) ||
            m.role.en.toLowerCase().includes(q) ||
            m.department.ko.toLowerCase().includes(q) ||
            m.department.en.toLowerCase().includes(q),
        )
      : members;
    return [...list].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  }, [members, search]);

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

  const openDetail = (member: ApiTeamMember) => {
    setEditingId(member.id);
    setForm(memberToForm(member));
    setError('');
    setView('detail');
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch(`${API_URL}/api/uploads/team-photo`, { method: 'POST', body });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setForm((f) => ({ ...f, photo: data.url }));
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
        editingId ? `${API_URL}/api/team/${editingId}` : `${API_URL}/api/team`,
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
      message: t('team.confirmDelete'),
      confirmLabel: t('common.delete'),
      variant: 'danger',
    });
    if (!ok) return;
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/team/${editingId}`, { method: 'DELETE' });
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
          {t('team.backToList')}
        </button>

        <h1 className="mb-6 text-[28px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">
          {editingId ? t('team.edit') : t('team.create')}
        </h1>

        {error && (
          <p className="mb-4 rounded-[10px] bg-red-50 px-4 py-2.5 text-[13px] text-red-600">{error}</p>
        )}

        <form
          onSubmit={handleSave}
          className="space-y-6 rounded-[14px] border border-black/[0.04] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="shrink-0">
              <p className="mb-2 text-[12px] font-semibold text-[#86868B]">{t('team.formPhoto')}</p>
              <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-[#F5F5F7] bg-[#F7F9FC] shadow-sm sm:mx-0">
                {form.photo ? (
                  <Image src={form.photo} alt="" fill className="object-cover" sizes="128px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#86868B]">
                    {form.name ? (
                      <span className="text-2xl font-bold text-primary/60">{initials(form.name)}</span>
                    ) : (
                      <User className="h-12 w-12 opacity-40" strokeWidth={1.5} />
                    )}
                  </div>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#0B2D5E]/[0.08] px-3 py-1.5 text-[12px] font-medium text-[#0B2D5E] transition-colors hover:bg-[#0B2D5E]/[0.12] disabled:opacity-50"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {uploading ? t('team.uploading') : t('team.uploadPhoto')}
                </button>
                {form.photo ? (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, photo: '' }))}
                    className="inline-flex items-center gap-1 rounded-[8px] px-3 py-1.5 text-[12px] font-medium text-[#86868B] transition-colors hover:bg-black/[0.04]"
                  >
                    <X className="h-3.5 w-3.5" />
                    {t('team.removePhoto')}
                  </button>
                ) : null}
              </div>
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
            </div>

            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[12px] font-semibold text-[#86868B]">{t('team.formName')}</label>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-[#86868B]">{t('team.formRoleKo')}</label>
                <input
                  className={inputClass}
                  value={form.roleKo}
                  onChange={(e) => setForm({ ...form, roleKo: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-[#86868B]">{t('team.formRoleEn')}</label>
                <input
                  className={inputClass}
                  value={form.roleEn}
                  onChange={(e) => setForm({ ...form, roleEn: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-[#86868B]">{t('team.formDeptKo')}</label>
                <input
                  className={inputClass}
                  value={form.departmentKo}
                  onChange={(e) => setForm({ ...form, departmentKo: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-[#86868B]">{t('team.formDeptEn')}</label>
                <input
                  className={inputClass}
                  value={form.departmentEn}
                  onChange={(e) => setForm({ ...form, departmentEn: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-[#86868B]">{t('team.formPhone')}</label>
                <input
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-[#86868B]">{t('team.formEmail')}</label>
                <input
                  type="email"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-[#86868B]">{t('team.formOrder')}</label>
                <input
                  type="number"
                  className={inputClass}
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#86868B]">{t('team.formBioKo')}</label>
              <textarea
                className={`${inputClass} min-h-[100px] resize-y`}
                value={form.bioKo}
                onChange={(e) => setForm({ ...form, bioKo: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-[#86868B]">{t('team.formBioEn')}</label>
              <textarea
                className={`${inputClass} min-h-[100px] resize-y`}
                value={form.bioEn}
                onChange={(e) => setForm({ ...form, bioEn: e.target.value })}
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
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">{t('team.title')}</h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#0B2D5E] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          {t('team.create')}
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-[10px] border border-black/[0.06] bg-white px-3 py-2">
        <Search className="h-4 w-4 text-[#86868B]" />
        <input
          type="search"
          placeholder={t('team.search')}
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
              <th className="px-4 py-2 text-left text-[12px] font-semibold text-[#86868B]">{t('team.colOrder')}</th>
              <th className="px-4 py-2 text-left text-[12px] font-semibold text-[#86868B]">{t('team.colPhoto')}</th>
              <th className="px-4 py-2 text-left text-[12px] font-semibold text-[#86868B]">{t('team.colName')}</th>
              <th className="px-4 py-2 text-left text-[12px] font-semibold text-[#86868B]">{t('team.colRole')}</th>
              <th className="px-4 py-2 text-left text-[12px] font-semibold text-[#86868B]">{t('team.colDept')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[13px] text-[#86868B]">
                  {t('common.loading')}
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[13px] text-[#86868B]">
                  {search ? t('team.noResults') : t('team.empty')}
                </td>
              </tr>
            ) : (
              filtered.map((member) => (
                <tr
                  key={member.id}
                  onClick={() => openDetail(member)}
                  className="cursor-pointer border-t border-black/[0.04] transition-colors hover:bg-[#FAFAFA]"
                >
                  <td className="px-4 py-2.5 text-[13px] text-[#86868B]">{member.order}</td>
                  <td className="px-4 py-2.5">
                    <div className="relative h-9 w-9 overflow-hidden rounded-full bg-[#F5F5F7]">
                      {member.photo ? (
                        <Image src={member.photo} alt="" fill className="object-cover" sizes="36px" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-primary/50">
                          {initials(member.name)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[13px] font-medium text-[#1D1D1F]">{member.name}</td>
                  <td className="px-4 py-2.5 text-[13px] text-[#636366]">
                    {member.role.ko} / {member.role.en}
                  </td>
                  <td className="px-4 py-2.5 text-[13px] text-[#86868B]">
                    {member.department.ko || '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
