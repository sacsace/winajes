'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

const navItems = [
  { key: 'about', href: '/about' },
  { key: 'team', href: '/team' },
  { key: 'services', href: '/services' },
  { key: 'projects', href: '/projects' },
  { key: 'performance', href: '/performance' },
  { key: 'clients', href: '/clients' },
  { key: 'news', href: '/news' },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const switchLocale = locale === 'ko' ? 'en' : 'ko';
  const isSolid = scrolled || mobileOpen;
  const isHeroHeader = isHome && !isSolid;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const linkClass = (href: string) =>
    cn(
      'relative rounded-md px-2.5 py-1.5 text-[13px] font-semibold tracking-wide transition-all duration-200',
      isActive(href)
        ? isSolid
          ? 'bg-primary/8 text-primary'
          : 'bg-white/15 text-white'
        : isSolid
          ? 'text-muted-foreground hover:bg-muted hover:text-primary'
          : 'text-white/80 hover:bg-white/10 hover:text-white',
    );

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-all duration-500',
        'pt-[env(safe-area-inset-top)]',
        isSolid && 'glass border-b border-border/60 shadow-soft',
        isHeroHeader && 'border-b border-white/10 bg-primary/40 backdrop-blur-md',
        !isSolid && !isHeroHeader && 'bg-transparent',
      )}
    >
      <Container className="flex h-14 items-center justify-between sm:h-[72px]">
        <Link href="/" className="shrink-0" onClick={() => setMobileOpen(false)}>
          <BrandLogo variant={isSolid ? 'onLight' : 'onDark'} showTagline />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link key={item.key} href={item.href} className={linkClass(item.href)}>
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={pathname}
            locale={switchLocale}
            className={cn(
              'rounded-md px-2 py-1 text-xs font-bold tracking-widest transition-colors',
              isSolid
                ? 'text-muted-foreground hover:text-primary'
                : 'text-white/65 hover:text-white',
            )}
          >
            {switchLocale.toUpperCase()}
          </Link>

          <Button
            href="/contact"
            variant={isSolid ? 'primary' : 'white'}
            size="sm"
            className="hidden sm:inline-flex"
          >
            {t('contact')}
          </Button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              'rounded-lg p-2 transition-colors lg:hidden',
              isSolid ? 'text-primary hover:bg-muted' : 'text-white hover:bg-white/10',
            )}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {mobileOpen && (
        <div className="border-t border-border bg-surface lg:hidden max-h-[calc(100dvh-3.5rem-env(safe-area-inset-top))] overflow-y-auto">
          <nav className="flex flex-col px-4 py-3 sm:px-5">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'min-h-[44px] rounded-lg px-3 py-3 text-sm font-semibold transition-colors flex items-center',
                  isActive(item.href)
                    ? 'bg-primary/8 text-primary'
                    : 'text-muted-foreground hover:bg-muted',
                )}
              >
                {t(item.key)}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-3 py-3 text-center text-sm font-semibold text-white"
            >
              {t('contact')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
