'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { heroSlides } from '@/lib/images';
import { cn } from '@/lib/utils';

type SlideContent = {
  label: string;
  headline: string;
  subheadline: string;
  quote: string;
  quoteBy: string;
};

const SLIDE_INTERVAL = 7000;

export function HeroSection() {
  const t = useTranslations('home.hero');
  const locale = useLocale() as 'ko' | 'en';
  const slides = t.raw('slides') as SlideContent[];
  const count = Math.min(slides.length, heroSlides.length);

  const [active, setActive] = useState(0);
  const goTo = useCallback((index: number) => {
    setActive((index + count) % count);
  }, [count]);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    const timer = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[active];

  return (
    <section className="relative flex h-svh min-h-[32rem] w-full flex-col overflow-hidden bg-primary supports-[height:100dvh]:h-dvh">
      {heroSlides.slice(0, count).map((item, i) => (
        <div
          key={item.src}
          className={cn(
            'hero-bg transition-opacity duration-1000 ease-in-out',
            i === active ? 'opacity-100' : 'opacity-0',
          )}
          aria-hidden={i !== active}
        >
          <Image
            src={item.src}
            alt={item.alt[locale]}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/45 to-primary/15" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-primary/10" />
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-30" />

      <Container className="hero-content relative z-10 flex min-h-0 flex-1 flex-col justify-center py-24 pb-20 md:py-28 md:pb-24">
        <div className="grid translate-y-[20dvh] items-end gap-8 [@media(max-height:640px)]:translate-y-[10dvh] lg:grid-cols-2 lg:gap-14">
          <div>
            <p
              key={`label-${active}`}
              className="animate-fade-up mb-4 text-[11px] font-semibold tracking-[0.18em] text-secondary uppercase"
            >
              {slide.label}
            </p>

            <h1
              key={`headline-${active}`}
              className="animate-fade-up mb-4 text-3xl leading-[1.08] font-bold tracking-[-0.035em] whitespace-pre-line text-white sm:mb-5 sm:text-4xl md:text-5xl lg:text-6xl"
            >
              {slide.headline}
            </h1>

            <p
              key={`sub-${active}`}
              className="animate-fade-up mb-6 max-w-lg text-[1.0625rem] leading-[1.647] tracking-[-0.022em] text-white/75 sm:mb-8 md:text-lg"
            >
              {slide.subheadline}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" variant="secondary" size="lg">
                {t('cta1')}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/projects" variant="outline" size="lg">
                {t('cta2')}
              </Button>
            </div>
          </div>

          <div
            key={`quote-${active}`}
            className="animate-fade-up rounded-xl border border-white/12 bg-white/8 p-6 backdrop-blur-sm md:p-8"
          >
            <Quote className="mb-3 h-7 w-7 text-secondary/70 md:mb-4 md:h-8 md:w-8" />
            <blockquote className="text-base leading-relaxed font-medium text-white/95 md:text-xl">
              &ldquo;{slide.quote}&rdquo;
            </blockquote>
            <p className="mt-4 text-xs font-semibold tracking-wider text-white/50 uppercase md:mt-5">
              — {slide.quoteBy}
            </p>
          </div>
        </div>
      </Container>

      <div className="absolute right-0 bottom-0 left-0 z-20 border-t border-white/10 bg-primary/35 backdrop-blur-md">
        <Container className="flex items-center justify-between py-4 md:py-5">
          <div className="flex items-center gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={cn(
                  'h-1 rounded-full transition-all duration-300',
                  i === active ? 'w-8 bg-secondary' : 'w-4 bg-white/30 hover:bg-white/50',
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white/80 transition-colors hover:border-secondary hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[2.5rem] text-center text-xs font-semibold text-white/60 tabular-nums">
              {active + 1} / {count}
            </span>
            <button
              onClick={next}
              aria-label="Next slide"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white/80 transition-colors hover:border-secondary hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </Container>
      </div>
    </section>
  );
}
