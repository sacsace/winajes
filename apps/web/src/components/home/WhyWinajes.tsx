'use client';

import { useTranslations } from 'next-intl';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Section } from '@/components/ui/Section';
import { whyWinajesKeys } from '@/lib/data';

export function WhyWinajes() {
  const t = useTranslations('home.whyWinajes');

  return (
    <Section>
      <SectionHeader title={t('title')} subtitle={t('subtitle')} align="left" className="mb-10" />
      <ol className="grid gap-0 border-t border-border sm:grid-cols-2">
        {whyWinajesKeys.map((key, i) => (
          <li
            key={key}
            className="flex gap-4 border-b border-border px-0 py-5 sm:odd:pr-8 sm:even:pl-8"
          >
            <span className="w-7 shrink-0 text-[13px] font-semibold tabular-nums text-secondary">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <p className="text-[15px] leading-snug font-semibold text-foreground">
                {t(`items.${key}.title`)}
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                {t(`items.${key}.desc`)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
