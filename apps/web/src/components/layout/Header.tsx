'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Container } from '@/components/ui/Container';

const navItems = [
  { key: 'about', href: '/about' },
  { key: 'team', href: '/team' },
  { key: 'services', href: '/services' },
  { key: 'projects', href: '/projects' },
  { key: 'gallery', href: '/gallery' },
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

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const linkClass = (href: string) =>
    cn(
      'relative px-2.5 py-1.5 text-[13px] font-semibold tracking-wide transition-colors duration-200',
      isActive(href)
        ? 'text-primary'
        : 'text-muted-foreground hover:text-primary',
      isActive(href) && 'after:absolute after:right-2.5 after:bottom-0 after:left-2.5 after:h-0.5 after:bg-secondary',
    );

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 border-b transition-colors duration-300',
        'pt-[env(safe-area-inset-top)]',
        isSolid
          ? 'border-border bg-surface'
          : 'border-black/6 bg-white/92 backdrop-blur-md',
      )}
    >
      <Container className="flex h-12 items-center justify-between gap-4 sm:h-14">
        <Link href="/" className="shrink-0" onClick={() => setMobileOpen(false)}>
          <BrandLogo variant="onLight" showTagline />
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
          <nav className="hidden items-center justify-end gap-0.5 lg:flex">
            {navItems.map((item) => (
              <Link key={item.key} href={item.href} className={linkClass(item.href)}>
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <Link
            href={pathname}
            locale={switchLocale}
            className="px-1 text-xs font-bold tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            {switchLocale.toUpperCase()}
          </Link>

          <Link
            href="/contact"
            className="group hidden items-center gap-1.5 rounded-full border border-primary bg-primary px-4 py-1.5 text-[12px] font-bold tracking-wide text-white transition-colors hover:border-secondary hover:bg-secondary sm:inline-flex"
          >
            {t('contact')}
            <ArrowUpRight className="h-3.5 w-3.5 opacity-80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-primary transition-colors hover:bg-muted lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {mobileOpen && (
        <div className="max-h-[calc(100dvh-3rem-env(safe-area-inset-top))] overflow-y-auto border-t border-border bg-surface lg:hidden">
          <nav className="flex flex-col px-4 py-3 sm:px-5">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex min-h-[44px] items-center border-b border-border/70 px-1 py-3 text-sm font-semibold transition-colors',
                  isActive(item.href) ? 'text-primary' : 'text-muted-foreground hover:text-primary',
                )}
              >
                {t(item.key)}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-1.5 border border-primary bg-primary px-3 py-3 text-sm font-bold text-white"
            >
              {t('contact')}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
