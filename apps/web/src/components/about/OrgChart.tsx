'use client';

import { useTranslations, useLocale } from 'next-intl';
import { departments, orgStructure } from '@/lib/data';
import { cn } from '@/lib/utils';

function TreeLine({ vertical = 32 }: { vertical?: number }) {
  return (
    <div
      className="w-px shrink-0 bg-border"
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
        <div className="relative z-10 w-full max-w-xs border border-primary bg-primary px-6 py-5 text-center text-white">
          <p className="text-[12px] font-medium text-white/60">CEO</p>
          <p className="mt-1.5 text-base font-bold leading-snug md:text-lg">
            {orgStructure.ceo[locale]}
          </p>
        </div>

        <TreeLine vertical={28} />

        <p className="mb-3 text-[13px] font-medium text-muted-foreground">
          {locale === 'ko' ? '이사' : 'Directors'}
        </p>

        <div className="relative w-full max-w-3xl px-2">
          <div className="absolute top-0 right-[12%] left-[12%] h-px bg-border md:right-[8%] md:left-[8%]" />
          <ul className="grid gap-4 pt-4 sm:grid-cols-3">
            {orgStructure.directors.map((director) => (
              <li key={director[locale]} className="flex flex-col items-center">
                <TreeLine vertical={16} />
                <div className="w-full border border-border bg-surface px-3 py-3.5 text-center">
                  <p className="text-xs font-semibold leading-snug text-primary md:text-sm">
                    {director[locale]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <TreeLine vertical={32} />

        <p className="mb-4 text-[13px] font-medium text-muted-foreground">
          {locale === 'ko' ? '부서' : 'Departments'}
        </p>

        <div className="relative w-full">
          <div className="absolute top-0 right-[6%] left-[6%] hidden h-px bg-border lg:block" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((dept) => (
              <li key={dept} className="flex flex-col items-center lg:pt-5">
                <div className="mb-0 hidden h-5 w-px bg-border lg:block" />
                <div
                  className={cn(
                    'flex w-full items-center border border-border bg-surface px-4 py-3.5',
                  )}
                >
                  <p className="text-xs font-semibold leading-snug text-foreground md:text-sm">
                    {t(`departments.${dept}`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
