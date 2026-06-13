'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAdminT } from '@/lib/admin/AdminLocaleProvider';
import { AdminLangSwitcher } from '@/components/admin/AdminLangSwitcher';

interface AdminLoginProps {
  email: string;
  password: string;
  error: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const inputClass = cn(
  'w-full rounded-[10px] border border-black/[0.08] bg-[#FAFAFA] px-4 py-3',
  'text-[15px] tracking-[-0.01em] text-[#1D1D1F] placeholder:text-[#86868B]',
  'outline-none transition-all duration-200',
  'focus:border-[#3E8ED0] focus:bg-white focus:ring-[3px] focus:ring-[#3E8ED0]/20',
);

export function AdminLogin({
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: AdminLoginProps) {
  const { t } = useAdminT();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F5F5F7] p-6">
      <div className="absolute top-6 right-6">
        <AdminLangSwitcher />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(62,142,208,0.12),transparent)]"
      />

      <div className="relative w-full max-w-[420px]">
        <form
          onSubmit={onSubmit}
          className={cn(
            'rounded-[20px] bg-white/95 px-10 py-10',
            'shadow-[0_2px_8px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)]',
            'ring-1 ring-black/[0.04] backdrop-blur-xl',
          )}
        >
          <div className="mb-10 flex flex-col items-center text-center">
            <div
              className={cn(
                'mb-5 flex h-[80px] w-[80px] items-center justify-center',
                'rounded-[18px] bg-white shadow-[0_4px_20px_rgba(11,45,94,0.12)]',
                'ring-1 ring-black/[0.06]',
              )}
            >
              <Image
                src="/images/brand/logo-icon.png"
                alt="WINAJES"
                width={56}
                height={56}
                className="h-14 w-14 object-contain"
                priority
              />
            </div>

            <h1 className="text-[22px] font-semibold tracking-[-0.028em] text-[#0B2D5E]">
              WINAJES CMS
            </h1>
            <p className="mt-1.5 text-[13px] font-medium tracking-[-0.01em] text-[#86868B]">
              {t('login.subtitle')}
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-[10px] border border-red-200/80 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600"
            >
              {error || t('login.error')}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="mb-2 block text-[13px] font-medium text-[#1D1D1F]">
                {t('login.email')}
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@winajes.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-2 block text-[13px] font-medium text-[#1D1D1F]">
                {t('login.password')}
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            className={cn(
              'mt-8 w-full rounded-[10px] bg-[#0B2D5E] py-3.5',
              'text-[15px] font-semibold tracking-[-0.01em] text-white',
              'transition-all duration-200',
              'hover:bg-[#153E7E] active:scale-[0.985]',
              'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#3E8ED0]/35',
            )}
          >
            {t('login.signIn')}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] font-medium tracking-[-0.01em] text-[#86868B]">
          {t('login.footer')}
        </p>
      </div>
    </div>
  );
}
