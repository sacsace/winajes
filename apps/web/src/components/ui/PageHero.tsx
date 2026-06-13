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
        'relative flex items-end overflow-hidden pt-[72px]',
        size === 'default' ? 'min-h-[260px] md:min-h-[32vh]' : 'min-h-[220px] md:min-h-[24vh]',
        className,
      )}
    >
      <Image src={image} alt="" fill className="object-cover" priority sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-primary/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
      <div className="absolute inset-0 dot-grid opacity-40" />

      <Container className="relative z-10 py-10 md:py-12">
        {label && (
          <p className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">{label}</p>
        )}
        <h1 className="max-w-3xl text-3xl font-bold tracking-[-0.035em] text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-base leading-relaxed tracking-[-0.02em] text-white/85 md:text-[1.0625rem]">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed tracking-[-0.015em] text-white/65 md:text-[0.9375rem] md:leading-[1.65]">
            {description}
          </p>
        )}
        <div className="mt-6 h-1 w-14 rounded-full bg-gradient-to-r from-secondary to-accent" />
      </Container>
    </section>
  );
}
