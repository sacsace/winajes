'use client';

import { useEffect } from 'react';
import { usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    if (!pathname) return;

    const fullPath = `/${locale}${pathname === '/' ? '' : pathname}`;

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: fullPath,
        locale,
        referrer: typeof document !== 'undefined' ? document.referrer || 'direct' : 'direct',
      }),
    }).catch(() => {});
  }, [pathname, locale]);

  return null;
}
