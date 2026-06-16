'use client';

import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { API_URL } from '@/lib/utils';
import { useAdminT } from '@/lib/admin/AdminLocaleProvider';

const inputClass =
  'w-full rounded-[10px] border border-black/[0.08] px-3 py-2 text-[13px] outline-none focus:border-[#3E8ED0]';

type FormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const emptyForm: FormState = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export function SettingsAdmin() {
  const { t } = useAdminT();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (form.newPassword !== form.confirmPassword) {
      setError(t('settings.passwordMismatch'));
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.error === 'invalid_current') {
          setError(t('settings.errorCurrentPassword'));
        } else if (data.error === 'too_short') {
          setError(t('settings.errorTooShort'));
        } else if (data.error === 'same_password') {
          setError(t('settings.errorSamePassword'));
        } else {
          setError(t('settings.errorSave'));
        }
        return;
      }

      setForm(emptyForm);
      setSuccess(true);
    } catch {
      setError(t('settings.errorSave'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-[28px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">
        {t('settings.title')}
      </h1>
      <p className="mb-8 text-[14px] text-[#636366]">{t('settings.subtitle')}</p>

      <div className="max-w-xl rounded-[14px] border border-black/[0.04] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#0B2D5E]/[0.08]">
            <KeyRound className="h-5 w-5 text-[#0B2D5E]" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-[16px] font-semibold text-[#1D1D1F]">{t('settings.passwordTitle')}</h2>
            <p className="text-[12px] text-[#86868B]">{t('settings.passwordHint')}</p>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-[10px] bg-red-50 px-4 py-2.5 text-[13px] text-red-600">{error}</p>
        )}
        {success && (
          <p className="mb-4 rounded-[10px] bg-emerald-50 px-4 py-2.5 text-[13px] text-emerald-700">
            {t('settings.passwordChanged')}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[#86868B]">
              {t('settings.currentPassword')}
            </label>
            <input
              type="password"
              autoComplete="current-password"
              className={inputClass}
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[#86868B]">
              {t('settings.newPassword')}
            </label>
            <input
              type="password"
              autoComplete="new-password"
              className={inputClass}
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-[#86868B]">
              {t('settings.confirmPassword')}
            </label>
            <input
              type="password"
              autoComplete="new-password"
              className={inputClass}
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <div className="border-t border-black/[0.04] pt-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-[10px] bg-[#0B2D5E] px-5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? t('common.loading') : t('settings.changePassword')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
