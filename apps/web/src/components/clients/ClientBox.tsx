import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatClientName } from '@/lib/format-client-name';

type Props = {
  name: string;
  logo?: string;
  variant?: 'brand' | 'entity';
  className?: string;
};

function BrandMonogram({ name }: { name: string }) {
  const letter = name.charAt(0).toUpperCase();
  return (
    <div className="flex h-9 w-9 items-center justify-center border border-border bg-muted text-[14px] font-semibold text-primary">
      {letter}
    </div>
  );
}

export function ClientBox({ name, logo, variant = 'brand', className }: Props) {
  const displayName = formatClientName(name);

  if (variant === 'entity') {
    return (
      <div
        className={cn(
          'group flex min-h-[52px] items-center border-b border-border bg-surface px-4 py-3',
          'transition-colors duration-200 hover:bg-muted/40',
          className,
        )}
      >
        <span className="text-[13px] leading-snug font-medium tracking-[-0.01em] text-foreground/85">
          {displayName}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group flex flex-col items-center justify-center gap-3 bg-surface px-4 py-6',
        'transition-colors duration-200 hover:bg-muted/40',
        'min-h-[112px]',
        className,
      )}
    >
      {logo ? (
        <Image
          src={logo}
          alt={displayName}
          width={120}
          height={48}
          className="max-h-10 w-auto object-contain opacity-90 transition-opacity group-hover:opacity-100"
        />
      ) : (
        <BrandMonogram name={displayName} />
      )}
      <span className="text-center text-[13px] font-semibold tracking-[-0.02em] text-foreground/75 transition-colors group-hover:text-primary">
        {displayName}
      </span>
    </div>
  );
}
