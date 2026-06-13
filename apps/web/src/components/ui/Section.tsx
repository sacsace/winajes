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
  default: 'bg-background',
  muted: 'bg-muted',
  dark: 'bg-primary text-white',
  surface: 'bg-surface',
};

export function Section({
  children,
  className,
  containerClassName,
  variant = 'default',
  id,
}: SectionProps) {
  return (
    <section id={id} className={cn('py-20 md:py-28', variants[variant], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
