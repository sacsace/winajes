'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Client } from '@/lib/shared';
import { clientLogos, clientEntities } from '@/lib/data';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ClientBox } from '@/components/clients/ClientBox';
import { API_URL } from '@/lib/utils';

function fallbackClients(): Client[] {
  const brands: Client[] = clientLogos.map((c, i) => ({
    id: `brand-${i}`,
    name: c.name,
    logo: '',
    category: 'brand',
    order: i,
  }));
  const entities: Client[] = clientEntities.map((name, i) => ({
    id: `entity-${i}`,
    name,
    logo: '',
    category: 'entity',
    order: brands.length + i,
  }));
  return [...brands, ...entities];
}

export default function ClientsPageClient() {
  const t = useTranslations('clients');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/clients`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setClients)
      .catch(() => setClients(fallbackClients()))
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(
    () => [...clients].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
    [clients],
  );

  return (
    <>
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
        image="/images/hero/hero-4.jpg"
      />

      <Section>
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-border pb-6">
          <SectionHeader
            align="left"
            label="Partners"
            title={t('gridTitle')}
            subtitle={t('gridSubtitle')}
            className="mb-0"
          />
          <p className="shrink-0 text-[13px] font-medium text-muted-foreground">
            {t('totalLabel')}{' '}
            <span className="text-lg font-bold text-primary">{loading ? '—' : sorted.length}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {loading
            ? Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="min-h-[112px] animate-pulse bg-muted/50" />
              ))
            : sorted.map((client) => (
                <ClientBox
                  key={client.id}
                  name={client.name}
                  logo={client.logo || undefined}
                />
              ))}
        </div>
      </Section>
    </>
  );
}
