'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Section } from '@/components/ui/Section';
import { clientLogos } from '@/lib/data';
import { API_URL } from '@/lib/utils';
import { formatClientName } from '@/lib/format-client-name';

type ClientItem = {
  name: string;
  logo?: string;
};

const fallbackClients: ClientItem[] = clientLogos.map((c) => ({
  name: formatClientName(c.name),
  logo: c.logo,
}));

export function ClientCarousel() {
  const t = useTranslations('home.clients');
  const [clients, setClients] = useState<ClientItem[]>(fallbackClients);

  useEffect(() => {
    fetch(`${API_URL}/api/clients?category=brand`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Array<{ name: string; logo?: string }>) => {
        if (!Array.isArray(data) || data.length === 0) {
          setClients(fallbackClients);
          return;
        }
        setClients(
          data.map((c) => {
            const name = formatClientName(c.name);
            const fromApi = c.logo?.trim();
            const fromStatic = clientLogos.find(
              (s) => formatClientName(s.name).toLowerCase() === name.toLowerCase(),
            )?.logo;
            return { name, logo: fromApi || fromStatic };
          }),
        );
      })
      .catch(() => setClients(fallbackClients));
  }, []);

  return (
    <Section variant="muted">
      <SectionHeader title={t('title')} subtitle={t('subtitle')} align="left" className="mb-10" />

      <ul className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {clients.map((client) => (
          <li
            key={client.name}
            className="flex min-h-[88px] items-center justify-center bg-surface px-4 py-5"
          >
            {client.logo ? (
              <Image
                src={client.logo}
                alt={client.name}
                width={140}
                height={48}
                className="h-10 w-auto max-w-[140px] object-contain opacity-85 transition-opacity hover:opacity-100"
              />
            ) : (
              <span className="text-center text-[13px] font-semibold tracking-tight text-foreground/70">
                {client.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
