'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Client } from '@winajes/shared';
import { clientLogos, clientEntities } from '@/lib/data';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ClientBox } from '@/components/clients/ClientBox';
import { API_URL } from '@/lib/utils';
import { Building2 } from 'lucide-react';

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

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-black/[0.05] bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary/[0.06]">
        <Building2 className="h-4 w-4 text-primary" strokeWidth={2} />
      </div>
      <div>
        <p className="text-[22px] font-semibold leading-none tracking-[-0.03em] text-primary">{value}</p>
        <p className="mt-1 text-[12px] font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
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

      <Section className="bg-background">
        <div className="mb-12 lg:max-w-xs">
          <StatPill label={t('totalLabel')} value={loading ? 0 : sorted.length} />
        </div>

        <section>
          <SectionHeader
            align="left"
            label="Partners"
            title={t('gridTitle')}
            subtitle={t('gridSubtitle')}
            className="mb-8 md:mb-10"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {loading
              ? Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className="min-h-[112px] animate-pulse rounded-[16px] border border-black/[0.04] bg-muted/50"
                  />
                ))
              : sorted.map((client) => (
                  <ClientBox
                    key={client.id}
                    name={client.name}
                    logo={client.logo || undefined}
                  />
                ))}
          </div>
        </section>
      </Section>
    </>
  );
}
