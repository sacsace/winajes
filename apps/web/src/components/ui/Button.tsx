import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';
type ButtonSize = 'sm' | 'md' | 'lg';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-light',
  secondary: 'bg-secondary text-white hover:bg-primary',
  outline: 'border border-white/40 text-white hover:bg-white/10',
  ghost: 'text-secondary hover:text-primary hover:bg-muted',
  white: 'bg-surface text-primary hover:bg-white',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-3.5 text-sm',
};

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: undefined;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  type?: undefined;
  disabled?: undefined;
  onClick?: undefined;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-sm font-semibold tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none';

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, children } = props;
  const classes = cn(baseClass, variants[variant], sizes[size], className);

  if ('href' in props && props.href) {
    return <Link href={props.href} className={classes}>{children}</Link>;
  }

  const { type = 'button', disabled, onClick } = props as ButtonAsButton;
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
