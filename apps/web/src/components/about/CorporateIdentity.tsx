'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';

/** Official CI colors sampled from Adobe Illustrator master (2015). */
const COLORS = [
  { hex: '#182060', name: { ko: '네이비', en: 'Navy' }, role: { ko: 'Primary', en: 'Primary' } },
  { hex: '#1868A8', name: { ko: '블루', en: 'Blue' }, role: { ko: 'Accent', en: 'Accent' } },
  { hex: '#8A8A96', name: { ko: '그레이', en: 'Gray' }, role: { ko: 'Sub text', en: 'Sub text' } },
] as const;

export function CorporateIdentity() {
  const t = useTranslations('about.ci');
  const locale = useLocale() as 'ko' | 'en';

  return (
    <Section>
      <SectionHeader
        label="CI"
        title={t('title')}
        subtitle={t('subtitle')}
        align="left"
        className="mb-10"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border border-border bg-surface p-8 md:p-10">
          <p className="mb-6 text-[12px] font-semibold tracking-wide text-muted-foreground uppercase">
            {t('symbol')}
          </p>
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-border bg-white p-8">
            <Image
              src="/images/brand/ci/logo-mark-on-white.png"
              alt="WINAJES symbol"
              width={200}
              height={200}
              className="h-36 w-36 object-contain sm:h-40 sm:w-40"
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t('symbolDesc')}</p>
        </div>

        <div className="border border-border bg-surface p-8 md:p-10">
          <p className="mb-6 text-[12px] font-semibold tracking-wide text-muted-foreground uppercase">
            {t('logo')}
          </p>
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-border bg-white p-8">
            <Image
              src="/images/brand/ci/logo-full-light.png"
              alt="WINAJES Constructions India Pvt. Ltd."
              width={420}
              height={120}
              className="h-auto w-full max-w-md object-contain"
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t('logoDesc')}</p>
        </div>
      </div>

      <div className="mt-6 border border-border bg-muted/40 p-6 md:p-8">
        <p className="mb-5 text-[12px] font-semibold tracking-wide text-muted-foreground uppercase">
          {t('colors')}
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {COLORS.map((c) => (
            <div key={c.hex} className="flex items-center gap-4">
              <div
                className="h-12 w-12 shrink-0 rounded-md border border-border shadow-sm"
                style={{ backgroundColor: c.hex }}
                aria-hidden
              />
              <div>
                <p className="text-sm font-semibold text-foreground">{c.name[locale]}</p>
                <p className="text-xs text-muted-foreground">{c.role[locale]} · {c.hex}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{t('note')}</p>
      </div>
    </Section>
  );
}
