import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  /** `onDark` = dark backgrounds. `onLight` = white/light backgrounds. */
  variant?: 'onDark' | 'onLight';
  className?: string;
  showTagline?: boolean;
}

export function BrandLogo({ variant = 'onLight', className, showTagline = false }: BrandLogoProps) {
  const onDark = variant === 'onDark';

  return (
    <div className={cn('flex items-center gap-2.5 sm:gap-3', className)}>
      <div className="relative h-9 w-9 shrink-0 sm:h-10 sm:w-10">
        <Image
          src={onDark ? '/images/brand/logo-icon-original.png' : '/images/brand/logo-mark-transparent.png'}
          alt="WINAJES"
          width={40}
          height={40}
          className="h-full w-full object-contain"
          priority
        />
      </div>
      <div className="min-w-0 leading-none">
        <p
          className={cn(
            'text-[15px] leading-none font-bold tracking-[0.02em] sm:text-base',
            onDark ? 'text-white' : 'text-primary',
          )}
        >
          WINAJES
        </p>
        {showTagline && (
          <p
            className={cn(
              'mt-0.5 hidden text-[11px] leading-none font-normal sm:block',
              onDark ? 'text-white/70' : 'text-muted-foreground',
            )}
          >
            Constructions India
          </p>
        )}
      </div>
    </div>
  );
}

export function BrandLogoFull({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <Image
      src="/images/brand/logo-full-dark.png"
      alt="WINAJES Constructions India Pvt. Ltd."
      width={220}
      height={56}
      className={cn(
        'h-11 w-auto object-contain',
        onDark && 'brightness-0 invert',
        className,
      )}
      priority
    />
  );
}
