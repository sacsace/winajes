'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useAdminT } from '@/lib/admin/AdminLocaleProvider';
import { AdminLangSwitcher } from '@/components/admin/AdminLangSwitcher';

export type AdminTab =
  | 'dashboard'
  | 'projects'
  | 'performance'
  | 'clients'
  | 'services'
  | 'team'
  | 'news'
  | 'inquiries'
  | 'settings';

type NavItem = { key: AdminTab; icon: LucideIcon };

type Props = {
  tab: AdminTab;
  navItems: NavItem[];
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  children: React.ReactNode;
};

export function AdminShell({ tab, navItems, onTabChange, onLogout, children }: Props) {
  const { t } = useAdminT();

  return (
    <div className="flex min-h-screen bg-[#F5F5F7]">
      <aside
        className={cn(
          'flex w-[220px] shrink-0 flex-col',
          'border-r border-black/[0.06] bg-white/70 backdrop-blur-2xl',
        )}
      >
        <div className="px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[9px] ring-1 ring-black/[0.06]">
              <Image
                src="/images/brand/logo-icon.png"
                alt="WINAJES"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="leading-tight">
              <p className="text-[13px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">WINAJES</p>
              <p className="text-[10px] font-medium text-[#86868B]">CMS</p>
            </div>
          </div>
          <AdminLangSwitcher className="mt-3 w-full" />
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
          {navItems.map(({ key, icon: Icon }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onTabChange(key)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2',
                  'text-[13px] font-medium tracking-[-0.01em] transition-colors',
                  active
                    ? 'bg-[#0B2D5E]/[0.08] text-[#0B2D5E]'
                    : 'text-[#636366] hover:bg-black/[0.04] hover:text-[#1D1D1F]',
                )}
              >
                <Icon className={cn('h-4 w-4', active ? 'text-[#0B2D5E]' : 'text-[#86868B]')} strokeWidth={2} />
                {t(`nav.${key}`)}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-black/[0.06] p-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13px] font-medium text-[#636366] transition-colors hover:bg-black/[0.04] hover:text-[#1D1D1F]"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-auto">
        <div className="mx-auto max-w-[1100px] px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
