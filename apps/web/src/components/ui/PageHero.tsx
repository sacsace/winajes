'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Container } from './Container';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  label?: string;
  image?: string;
  className?: string;
  size?: 'default' | 'compact';
}

export function PageHero({
  title,
  subtitle,
  description,
  label,
  image = '/images/hero/hero-2.jpg',
  className,
  size = 'default',
}: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative flex items-end overflow-hidden pt-14 sm:pt-[72px]',
        size === 'default' ? 'min-h-[220px] sm:min-h-[260px] md:min-h-[32vh]' : 'min-h-[200px] sm:min-h-[220px] md:min-h-[24vh]',
        className,
      )}
    >
      <Image src={image} alt={title} fill className="object-cover" priority sizes="100vw" />
      <div className="absolute inset-0 bg-primary/78" />

      <Container className="relative z-10 px-4 py-8 sm:px-5 sm:py-10 md:py-12">
        {label && (
          <p className="mb-2 text-[13px] font-medium text-white/70">{label}</p>
        )}
        <h1 className="max-w-3xl text-2xl font-bold tracking-[-0.035em] text-white sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed tracking-[-0.02em] text-white/85 sm:mt-3 sm:text-base md:text-[1.0625rem]">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="mt-2 max-w-2xl text-xs leading-relaxed tracking-[-0.015em] text-white/65 sm:mt-3 sm:text-sm md:text-[0.9375rem] md:leading-[1.65]">
            {description}
          </p>
        )}
        <div className="section-rule mt-6" />
      </Container>
    </section>
  );
}
