import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  /** `onDark` = dark/navy backgrounds. `onLight` = white/light backgrounds. */
  variant?: 'onDark' | 'onLight';
  className?: string;
  showTagline?: boolean;
}

export function BrandLogo({ variant = 'onLight', className, showTagline = false }: BrandLogoProps) {
  const onDark = variant === 'onDark';

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Image
        src="/images/brand/logo-icon.png"
        alt="WINAJES"
        width={40}
        height={40}
        className="h-9 w-9 object-contain sm:h-10 sm:w-10"
        priority
      />
      <div className="min-w-0 leading-none">
        <p
          className={cn(
            'text-[15px] font-bold tracking-[0.02em] sm:text-base',
            onDark ? 'text-white' : 'text-primary',
          )}
        >
          WINAJES
        </p>
        {showTagline && (
          <p
            className={cn(
              'mt-1 hidden text-[11px] font-normal sm:block',
              onDark ? 'text-white/65' : 'text-muted-foreground',
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
