'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { businessAreaKeys } from '@/lib/data';
import { businessAreaImages } from '@/lib/images';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/utils';

export function BusinessAreas() {
  const t = useTranslations('home.businessAreas');
  const [active, setActive] = useState(0);
  const activeKey = businessAreaKeys[active];

  return (
    <Section variant="muted">
      <SectionHeader title={t('title')} subtitle={t('subtitle')} align="left" className="mb-10" />

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="flex flex-col border-t border-border lg:col-span-4">
          {businessAreaKeys.map((key, i) => (
            <button
              key={key}
              onClick={() => setActive(i)}
              className={cn(
                'border-b border-border px-1 py-4 text-left text-[15px] font-semibold transition-colors',
                active === i
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span
                className={cn(
                  'mr-3 tabular-nums font-bold',
                  active === i ? 'text-secondary' : 'text-primary/45',
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              {t(`${key}.title`)}
            </button>
          ))}
        </div>

        <div className="relative min-h-[360px] overflow-hidden border border-border lg:col-span-8">
          <Image
            src={businessAreaImages[active]}
            alt={t(`${activeKey}.title`)}
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 66vw"
            key={businessAreaImages[active]}
          />
          <div className="absolute inset-0 bg-primary/72" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white md:p-8">
            <h3 className="mb-2 text-2xl font-bold tracking-tight text-white md:text-[1.75rem]">
              {t(`${activeKey}.title`)}
            </h3>
            <p className="mb-5 max-w-xl text-[15px] leading-relaxed text-white/90 md:text-base">
              {t(`${activeKey}.description`)}
            </p>
            <ul className="space-y-2">
              {(t.raw(`${activeKey}.items`) as string[]).map((item) => (
                <li key={item} className="text-[15px] leading-snug text-white/88 md:text-base">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
