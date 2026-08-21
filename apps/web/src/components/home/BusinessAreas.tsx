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
              <span className={cn('mr-3 tabular-nums', active === i ? 'text-secondary' : 'text-border')}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {t(`${key}.title`)}
            </button>
          ))}
        </div>

        <div className="relative min-h-[340px] overflow-hidden border border-border lg:col-span-8">
          <Image
            src={businessAreaImages[active]}
            alt={t(`${businessAreaKeys[active]}.title`)}
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 66vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 p-6 text-white md:p-8">
            <h3 className="mb-3 text-xl font-bold text-white md:text-2xl">
              {t(`${businessAreaKeys[active]}.title`)}
            </h3>
            <ul className="space-y-1.5">
              {(t.raw(`${businessAreaKeys[active]}.items`) as string[]).map((item) => (
                <li key={item} className="text-sm text-white/80">
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
