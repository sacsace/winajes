'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  type AdminLocale,
  translateAdmin,
} from '@/lib/admin/messages';

const STORAGE_KEY = 'admin_locale';

type AdminLocaleContextValue = {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const AdminLocaleContext = createContext<AdminLocaleContextValue | null>(null);

export function AdminLocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>('ko');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as AdminLocale | null;
    if (saved === 'ko' || saved === 'en') setLocaleState(saved);
  }, []);

  const setLocale = useCallback((next: AdminLocale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translateAdmin(locale, key, vars),
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return (
    <AdminLocaleContext.Provider value={value}>{children}</AdminLocaleContext.Provider>
  );
}

export function useAdminT() {
  const ctx = useContext(AdminLocaleContext);
  if (!ctx) throw new Error('useAdminT must be used within AdminLocaleProvider');
  return ctx;
}
