import { cn } from '@/lib/utils';
import { Container } from './Container';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  variant?: 'default' | 'muted' | 'dark' | 'surface';
  id?: string;
}

const variants = {
  default: 'bg-transparent',
  muted: 'bg-muted/70',
  dark: 'bg-primary text-white',
  surface: 'bg-surface/80',
};

export function Section({
  children,
  className,
  containerClassName,
  variant = 'default',
  id,
}: SectionProps) {
  return (
    <section id={id} className={cn('py-16 md:py-24', variants[variant], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
