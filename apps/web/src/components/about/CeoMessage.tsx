'use client';

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Mail, Phone, Quote } from 'lucide-react';
import { ceoPhoto } from '@/lib/images';
import { ceoInfo, companyInfo } from '@/lib/data';
import { Section } from '@/components/ui/Section';

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .flatMap((block) => block.split(/(?<=[.!?])\s+/))
    .map((p) => p.trim())
    .filter(Boolean);
}

export function CeoMessage() {
  const t = useTranslations('about.ceoMessage');
  const locale = useLocale() as 'ko' | 'en';
  const tagline = companyInfo.tagline[locale];
  const paragraphs = splitParagraphs(t('message'));

  return (
    <Section variant="muted" className="!py-16 md:!py-20">
      <div className="overflow-hidden rounded-[20px] border border-black/[0.06] bg-white shadow-[0_8px_32px_rgba(11,45,94,0.07)]">
        <div className="flex flex-col lg:flex-row">
          {/* Portrait */}
          <div className="flex shrink-0 flex-col items-center justify-center bg-[#F7F9FC] px-6 py-8 lg:w-[280px] xl:w-[300px] lg:py-10">
            <div className="relative h-44 w-44 overflow-hidden rounded-full border-4 border-white shadow-[0_8px_24px_rgba(11,45,94,0.12)] sm:h-52 sm:w-52">
              <Image
                src={ceoPhoto}
                alt={t('name')}
                fill
                className="object-cover"
                sizes="208px"
                priority
              />
            </div>
            <div className="mt-5 text-center">
              <p className="text-xl font-bold tracking-[-0.02em] text-primary">{t('name')}</p>
              <p className="mt-1 text-[13px] font-medium text-[#86868B]">{t('role')}</p>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-8 md:py-10 lg:px-10 lg:py-10 xl:px-12">
            <p className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-secondary uppercase">
              {t('label')}
            </p>
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-primary md:text-3xl">
              {t('title')}
            </h2>

            <blockquote className="relative mt-6 rounded-[14px] border border-primary/[0.08] bg-[#F7F9FC] px-5 py-4 md:mt-7 md:px-6 md:py-5">
              <Quote
                className="mb-2 h-5 w-5 text-secondary/80"
                strokeWidth={2}
                aria-hidden
              />
              <p className="text-[15px] leading-relaxed font-semibold tracking-[-0.02em] text-primary md:text-base md:leading-relaxed">
                {tagline}
              </p>
            </blockquote>

            <div className="mt-6 space-y-3.5 text-[14px] leading-[1.85] text-[#636366] md:mt-7 md:text-[15px] md:leading-[1.9]">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5 border-t border-black/[0.06] pt-7 md:mt-9">
              <a
                href={`tel:${ceoInfo.phone.replace(/-/g, '')}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#F0F4F8] px-4 py-2 text-[13px] font-medium text-[#0B2D5E] transition-colors hover:bg-[#E4ECF4]"
              >
                <Phone className="h-3.5 w-3.5 text-secondary" strokeWidth={2} />
                {ceoInfo.phone}
              </a>
              <a
                href={`mailto:${ceoInfo.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#F0F4F8] px-4 py-2 text-[13px] font-medium text-[#0B2D5E] transition-colors hover:bg-[#E4ECF4]"
              >
                <Mail className="h-3.5 w-3.5 text-secondary" strokeWidth={2} />
                {ceoInfo.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
