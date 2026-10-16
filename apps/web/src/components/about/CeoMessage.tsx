'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Mail, Phone } from 'lucide-react';
import { ceoPhoto } from '@/lib/images';
import { ceoInfo } from '@/lib/data';
import { Section } from '@/components/ui/Section';

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function CeoMessage() {
  const t = useTranslations('about.ceoMessage');
  const paragraphs = splitParagraphs(t('message'));

  return (
    <Section className="!py-10 md:!py-12">
      <div className="grid gap-10 border-t border-border pt-8 lg:grid-cols-12 lg:gap-14 lg:pt-10">
        <div className="flex flex-col items-start lg:col-span-4">
          <div className="relative h-44 w-44 overflow-hidden rounded-full border border-border bg-muted sm:h-52 sm:w-52">
            <Image
              src={ceoPhoto}
              alt={t('name')}
              fill
              className="object-cover"
              sizes="208px"
              priority
            />
          </div>
          <div className="mt-5">
            <p className="text-xl font-bold tracking-[-0.02em] text-primary">{t('name')}</p>
            <p className="mt-1 text-[13px] font-medium text-muted-foreground">{t('role')}</p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <p className="mb-2 text-[13px] font-medium text-secondary">{t('label')}</p>
          <h2 className="text-2xl font-bold tracking-[-0.03em] text-primary md:text-3xl">
            {t('title')}
          </h2>

          <blockquote className="mt-6 border-l-2 border-secondary pl-4 md:mt-7">
            <p className="text-base leading-relaxed font-semibold tracking-[-0.02em] text-primary md:text-[1.0625rem]">
              {t('quote')}
            </p>
          </blockquote>

          <div className="mt-6 space-y-5 text-base leading-[1.8] text-muted-foreground md:mt-7 md:text-[1.0625rem] md:leading-[1.85]">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 md:mt-9">
            <a
              href={`tel:${ceoInfo.phone.replace(/-/g, '')}`}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-primary transition-colors hover:text-secondary"
            >
              <Phone className="h-3.5 w-3.5" strokeWidth={2} />
              {ceoInfo.phone}
            </a>
            <a
              href={`mailto:${ceoInfo.email}`}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-primary transition-colors hover:text-secondary"
            >
              <Mail className="h-3.5 w-3.5" strokeWidth={2} />
              {ceoInfo.email}
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
