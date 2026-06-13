'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

interface ContactFormProps {
  compact?: boolean;
}

export function ContactForm({ compact = false }: ContactFormProps) {
  const t = useTranslations('contact.form');
  const [form, setForm] = useState({
    name: '', company: '', country: '', email: '', phone: '', projectType: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) setForm({ name: '', company: '', country: '', email: '', phone: '', projectType: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center text-emerald-700">
        {t('success')}
      </div>
    );
  }

  const fields = compact
    ? (['name', 'email', 'message'] as const)
    : (['name', 'company', 'country', 'email', 'phone', 'projectType', 'message'] as const);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        field === 'message' ? (
          <Textarea
            key={field}
            required
            rows={compact ? 3 : 5}
            placeholder={t(field)}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        ) : (
          <Input
            key={field}
            required={field !== 'phone'}
            type={field === 'email' ? 'email' : 'text'}
            placeholder={t(field)}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        )
      ))}
      {status === 'error' && <p className="text-sm text-red-600">{t('error')}</p>}
      <Button type="submit" disabled={status === 'loading'} className="w-full">
        {status === 'loading' ? '...' : t('submit')}
      </Button>
    </form>
  );
}
