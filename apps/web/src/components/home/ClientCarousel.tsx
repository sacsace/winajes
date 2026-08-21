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

  return (
    <Section variant="surface">
      <SectionHeader title={t('title')} subtitle={t('subtitle')} align="left" className="mb-10" />

      <ul className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {names.map((name) => (
          <li
            key={name}
            className="flex min-h-[72px] items-center justify-center bg-surface px-4 py-5 text-center"
          >
            <span className="text-[13px] font-semibold tracking-tight text-foreground/70">
              {name}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
