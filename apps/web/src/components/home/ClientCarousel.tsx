'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Section } from '@/components/ui/Section';
import { clientLogos } from '@/lib/data';
import { API_URL } from '@/lib/utils';
import { formatClientName } from '@/lib/format-client-name';

export function ClientCarousel() {
  const t = useTranslations('home.clients');
  const [names, setNames] = useState<string[]>(clientLogos.map((c) => formatClientName(c.name)));

  useEffect(() => {
    fetch(`${API_URL}/api/clients?category=brand`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Array<{ name: string }>) => setNames(data.map((c) => formatClientName(c.name))))
      .catch(() => setNames(clientLogos.map((c) => formatClientName(c.name))));
  }, []);

  const doubled = [...names, ...names];

  return (
    <Section variant="surface">
      <SectionHeader title={t('title')} subtitle={t('subtitle')} className="mb-14" />

      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted py-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-muted to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-muted to-transparent" />
        <div className="flex animate-marquee gap-6">
          {doubled.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex h-[72px] w-44 shrink-0 items-center justify-center rounded-xl border border-border bg-surface px-6 shadow-soft"
            >
              <span className="text-lg font-extrabold tracking-tight text-muted-foreground/60">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
