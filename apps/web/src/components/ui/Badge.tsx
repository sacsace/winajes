import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'muted';

const variants: Record<BadgeVariant, string> = {
  default: 'border-primary/25 bg-primary/8 text-primary',
  secondary: 'border-secondary/25 bg-secondary/8 text-secondary',
  success: 'border-emerald-600/25 bg-emerald-500/8 text-emerald-800',
  warning: 'border-amber-600/25 bg-amber-500/8 text-amber-800',
  muted: 'border-border bg-muted text-muted-foreground',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-2 py-0.5 text-[11px] font-semibold',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
