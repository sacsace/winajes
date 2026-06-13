import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  /** `onDark` = dark/navy backgrounds (white text). `onLight` = white/light backgrounds. */
  variant?: 'onDark' | 'onLight';
  className?: string;
  showTagline?: boolean;
}

export function BrandLogo({ variant = 'onLight', className, showTagline = false }: BrandLogoProps) {
  const onDark = variant === 'onDark';

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors',
          onDark
            ? 'bg-white shadow-sm ring-1 ring-white/80'
            : 'bg-white ring-1 ring-border shadow-soft',
        )}
      >
        <Image
          src="/images/brand/logo-icon.png"
          alt="WINAJES"
          width={28}
          height={28}
          className="h-7 w-7 object-contain"
          priority
        />
      </div>
      <div className="leading-tight">
        <div
          className={cn(
            'text-[15px] font-extrabold tracking-tight',
            onDark ? 'text-white' : 'text-primary',
          )}
        >
          WINAJES
        </div>
        {showTagline && (
          <div
            className={cn(
              'hidden text-[10px] font-medium tracking-wider uppercase sm:block',
              onDark ? 'text-white/70' : 'text-muted-foreground',
            )}
          >
            Constructions India
          </div>
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
