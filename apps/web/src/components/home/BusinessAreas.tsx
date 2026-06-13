'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { businessAreaKeys } from '@/lib/data';
import { businessAreaImages } from '@/lib/images';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Section } from '@/components/ui/Section';
import { Wrench, Wind, Zap, Flame, Droplets, Server, PenTool } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = [Wrench, Wind, Zap, Flame, Droplets, Server, PenTool];

export function BusinessAreas() {
  const t = useTranslations('home.businessAreas');
  const [active, setActive] = useState(0);

  return (
    <Section variant="muted">
      <SectionHeader title={t('title')} subtitle={t('subtitle')} className="mb-12" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-2 sm:grid-cols-2">
          {businessAreaKeys.map((key, i) => {
            const Icon = icons[i];
            return (
              <button
                key={key}
                onClick={() => setActive(i)}
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-4 text-left transition-all duration-200',
                  active === i
                    ? 'border-secondary/40 bg-primary text-white shadow-soft'
                    : 'border-border bg-surface text-foreground hover:border-secondary/25',
                )}
              >
                <div className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
                  active === i ? 'bg-secondary/20' : 'bg-muted',
                )}>
                  <Icon className={cn('h-4 w-4', active === i ? 'text-secondary' : 'text-primary')} />
                </div>
                <span className="text-sm font-semibold">{t(`${key}.title`)}</span>
              </button>
            );
          })}
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-xl border border-border shadow-card">
          <Image
            src={businessAreaImages[active]}
            alt={t(`${businessAreaKeys[active]}.title`)}
            fill
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 p-7 text-white">
            <p className="mb-2 text-xs font-bold tracking-wider text-secondary uppercase">
              {String(active + 1).padStart(2, '0')}
            </p>
            <h3 className="mb-3 text-xl font-bold md:text-2xl">{t(`${businessAreaKeys[active]}.title`)}</h3>
            <ul className="space-y-2">
              {(t.raw(`${businessAreaKeys[active]}.items`) as string[]).map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-white/85">
                  <div className="h-1 w-1 shrink-0 rounded-full bg-secondary" />
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
