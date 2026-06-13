'use client';

import { useTranslations } from 'next-intl';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Section } from '@/components/ui/Section';
import { whyWinajesKeys } from '@/lib/data';
import { Award, Target, Handshake, Shield, Users, Building2, Layers } from 'lucide-react';

const icons = [Award, Target, Handshake, Shield, Users, Building2, Layers];

export function WhyWinajes() {
  const t = useTranslations('home.whyWinajes');

  return (
    <Section variant="surface">
      <SectionHeader title={t('title')} subtitle={t('subtitle')} className="mb-12" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {whyWinajesKeys.map((key, i) => {
          const Icon = icons[i];
          return (
            <div
              key={key}
              className="rounded-lg border border-border bg-surface p-5 transition-shadow hover:shadow-soft"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-primary/8">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm leading-snug font-semibold text-foreground">
                {t(`items.${key}`)}
              </h3>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
