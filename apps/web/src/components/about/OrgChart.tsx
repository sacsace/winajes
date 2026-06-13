'use client';

import { useTranslations, useLocale } from 'next-intl';
import { departments, orgStructure } from '@/lib/data';
import {
  Building2, Wrench, Zap, PenTool, Users, ShoppingCart, Server,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const deptIcons: Record<string, typeof Wrench> = {
  engineering: Wrench,
  mechanical: Wrench,
  electrical: Zap,
  design: PenTool,
  administration: Building2,
  hr: Users,
  purchasing: ShoppingCart,
  itNetwork: Server,
};

function TreeLine({ vertical = 32 }: { vertical?: number }) {
  return (
    <div
      className="w-px shrink-0 bg-secondary/50"
      style={{ height: vertical }}
    />
  );
}

export function OrgChart() {
  const t = useTranslations('about.organization');
  const locale = useLocale() as 'ko' | 'en';

  return (
    <div className="mx-auto max-w-5xl overflow-x-auto pb-2">
      <div className="flex min-w-[320px] flex-col items-center">
        {/* CEO */}
        <div className="relative z-10 w-full max-w-xs rounded-xl bg-primary px-6 py-5 text-center text-white shadow-card">
          <p className="text-[10px] font-bold tracking-[0.2em] text-secondary uppercase">CEO</p>
          <p className="mt-1.5 text-base font-bold leading-snug md:text-lg">
            {orgStructure.ceo[locale]}
          </p>
        </div>

        <TreeLine vertical={28} />

        {/* Directors */}
        <p className="mb-3 text-[11px] font-bold tracking-[0.18em] text-muted-foreground uppercase">
          {locale === 'ko' ? '이사' : 'Directors'}
        </p>

        <div className="relative w-full max-w-3xl px-2">
          <div className="absolute top-0 right-[12%] left-[12%] h-px bg-secondary/45 md:right-[8%] md:left-[8%]" />
          <ul className="grid gap-4 pt-4 sm:grid-cols-3">
            {orgStructure.directors.map((director) => (
              <li key={director[locale]} className="flex flex-col items-center">
                <TreeLine vertical={16} />
                <div className="w-full rounded-lg border border-border bg-surface px-3 py-3.5 text-center shadow-soft">
                  <p className="text-xs font-semibold leading-snug text-primary md:text-sm">
                    {director[locale]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <TreeLine vertical={32} />

        {/* Departments */}
        <p className="mb-4 text-[11px] font-bold tracking-[0.18em] text-muted-foreground uppercase">
          {locale === 'ko' ? '부서' : 'Departments'}
        </p>

        <div className="relative w-full">
          <div className="absolute top-0 right-[6%] left-[6%] hidden h-px bg-secondary/35 lg:block" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((dept) => {
              const Icon = deptIcons[dept] || Building2;
              return (
                <li key={dept} className="flex flex-col items-center lg:pt-5">
                  <div className="mb-0 hidden h-5 w-px bg-secondary/35 lg:block" />
                  <div
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg border border-border bg-surface p-3.5',
                      'transition-shadow hover:border-secondary/30 hover:shadow-soft',
                    )}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-semibold leading-snug text-foreground md:text-sm">
                      {t(`departments.${dept}`)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
