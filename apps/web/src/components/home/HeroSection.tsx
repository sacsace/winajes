'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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
            'hero-bg transition-opacity duration-700 ease-in-out',
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

      <div className="pointer-events-none absolute inset-0 bg-primary/55" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full max-w-3xl bg-gradient-to-r from-primary/80 to-transparent" />

      <Container className="hero-content relative z-10 flex min-h-0 flex-1 flex-col justify-center py-24 pb-24 md:py-28 md:pb-28">
        <div className="max-w-2xl translate-y-[12dvh] [@media(max-height:640px)]:translate-y-[6dvh]">
          <p className="mb-3 text-[13px] font-medium text-white/70">{slide.label}</p>

          <h1 className="mb-4 text-3xl leading-[1.08] font-bold tracking-[-0.035em] whitespace-pre-line text-white sm:mb-5 sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            {slide.headline}
          </h1>

          <p className="mb-5 max-w-lg text-[1.0625rem] leading-[1.647] tracking-[-0.022em] text-white/78 sm:mb-6 md:text-lg">
            {slide.subheadline}
          </p>

          <blockquote className="mb-8 max-w-md border-l-2 border-secondary pl-4">
            <p className="text-[15px] leading-relaxed text-white/90 md:text-base">
              &ldquo;{slide.quote}&rdquo;
            </p>
            <cite className="mt-2 block text-[12px] font-medium not-italic text-white/55">
              — {slide.quoteBy}
            </cite>
          </blockquote>

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
      </Container>

      <div className="absolute right-0 bottom-0 left-0 z-20 border-t border-white/15 bg-primary/70">
        <Container className="flex items-center justify-between py-3.5 md:py-4">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={cn(
                  'h-0.5 transition-all duration-300',
                  i === active ? 'w-8 bg-secondary' : 'w-4 bg-white/35 hover:bg-white/55',
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="flex h-9 w-9 items-center justify-center border border-white/25 text-white/80 transition-colors hover:border-white/50 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[2.5rem] text-center text-xs font-medium text-white/55 tabular-nums">
              {active + 1} / {count}
            </span>
            <button
              onClick={next}
              aria-label="Next slide"
              className="flex h-9 w-9 items-center justify-center border border-white/25 text-white/80 transition-colors hover:border-white/50 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </Container>
      </div>
    </section>
  );
}
