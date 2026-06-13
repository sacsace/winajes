import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  light?: boolean;
  className?: string;
}

export function SectionHeader({
  label,
  title,
  subtitle,
  align = 'center',
  light = false,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(align === 'center' ? 'text-center' : 'text-left', className)}>
      {label && (
        <p
          className={cn(
            'mb-3 text-[11px] font-semibold tracking-[0.18em] uppercase',
            light ? 'text-accent' : 'text-secondary',
          )}
        >
          {label}
        </p>
      )}
      <h2
        className={cn(
          'text-3xl font-bold tracking-[-0.03em] md:text-4xl lg:text-[2.5rem] lg:leading-[1.08]',
          light ? 'text-white' : 'text-primary',
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-4 max-w-2xl text-[1.0625rem] leading-[1.647] tracking-[-0.022em] md:text-lg',
            align === 'center' && 'mx-auto',
            light ? 'text-white/70' : 'text-muted-foreground',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
