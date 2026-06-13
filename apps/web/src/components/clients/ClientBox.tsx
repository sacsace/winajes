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
    <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary/[0.06] text-[15px] font-semibold text-primary">
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
          'group flex min-h-[52px] items-center rounded-[12px]',
          'border border-black/[0.05] bg-white px-4 py-3',
          'transition-colors duration-200 hover:border-secondary/25 hover:bg-[#FAFBFC]',
          className,
        )}
      >
        <span className="mr-3 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary/60 transition-colors group-hover:bg-secondary" />
        <span className="text-[13px] leading-snug font-medium tracking-[-0.01em] text-foreground/85">
          {displayName}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group flex flex-col items-center justify-center gap-3 rounded-[16px]',
        'border border-black/[0.05] bg-white px-4 py-6',
        'transition-all duration-200 hover:border-secondary/20 hover:shadow-[0_4px_20px_rgba(11,45,94,0.06)]',
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
      <span className="text-center text-[14px] font-semibold tracking-[-0.02em] text-foreground/75 transition-colors group-hover:text-primary">
        {displayName}
      </span>
    </div>
  );
}
