'use client';

import { cn } from '@/lib/utils';
import { useAdminT } from '@/lib/admin/AdminLocaleProvider';
import type { AdminLocale } from '@/lib/admin/messages';

export function AdminLangSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useAdminT();

  return (
    <div
      className={cn(
        'flex rounded-[8px] bg-black/[0.04] p-0.5',
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {(['ko', 'en'] as AdminLocale[]).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLocale(lang)}
          className={cn(
            'flex-1 rounded-[6px] px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase transition-colors',
            locale === lang
              ? 'bg-white text-[#0B2D5E] shadow-sm'
              : 'text-[#86868B] hover:text-[#1D1D1F]',
          )}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
