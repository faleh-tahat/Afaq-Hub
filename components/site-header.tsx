'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { buttonVariants } from '@/components/ui/button';
import { useTranslation } from '@/components/language-provider';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslation();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleJoinClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/about') {
      e.preventDefault();
      scrollToId('join');
    } else {
      e.preventDefault();
      router.push('/about#join');
      // Fallback: if the router doesn't auto-scroll after navigation, do it manually.
      setTimeout(() => scrollToId('join'), 400);
    }
  };

  // Hairline border and denser backdrop once the page has scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While the mobile menu is open: lock page scroll, keep focus inside the
  // header, and close on Escape (returning focus to the toggle).
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab' || !headerRef.current) return;
      const focusable = headerRef.current.querySelectorAll<HTMLElement>(
        '#mobile-menu a[href], #mobile-menu button, [data-menu-toggle]'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 z-50 border-b transition-[background-color,border-color] duration-300 ease-brand',
        // No backdrop-filter while the menu is open: it would become the
        // containing block of the fixed menu panel and clip it to the header.
        open
          ? 'border-line bg-canvas'
          : scrolled
            ? 'border-line bg-canvas/90 backdrop-blur-xl'
            : 'border-transparent bg-canvas/70 backdrop-blur-md'
      )}
    >
      <div className="mx-auto flex h-header-sm w-full max-w-container items-center justify-between gap-6 px-5 sm:px-8 lg:h-header">
        {/* Logo */}
        <Link
          href="/"
          aria-label={t.logoAlt}
          className="inline-flex shrink-0 items-center rounded-control"
        >
          <Image
            src="/afaq-logo-full.png"
            alt={t.logoAlt}
            width={1705}
            height={646}
            priority
            className="h-10 w-auto object-contain lg:h-11"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {t.navLinks.slice(0, 7).map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative rounded-control px-3 py-2 text-[0.9375rem] font-medium transition-colors duration-200',
                  active ? 'text-ink' : 'text-ink-muted hover:text-ink'
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent transition-opacity duration-200',
                    active ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/about#join"
            onClick={handleJoinClick}
            className={buttonVariants({ variant: 'primary', size: 'sm' })}
          >
            {t.header.joinUs}
          </Link>
          <Link href="/contact" className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
            {t.header.contact}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          ref={toggleRef}
          type="button"
          data-menu-toggle
          aria-label={open ? t.header.closeMenu : t.header.openMenu}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className={cn(
            'inline-flex h-11 w-11 items-center justify-center rounded-control border transition-colors duration-200 lg:hidden',
            open
              ? 'border-accent/40 bg-accent/10 text-accent'
              : 'border-line-strong bg-surface text-ink hover:bg-surface-raised'
          )}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 top-header-sm overflow-y-auto border-t border-line bg-canvas lg:hidden"
          >
            <nav className="mx-auto flex min-h-full w-full max-w-container flex-col px-5 pb-8 pt-4 sm:px-8">
              <ul className="divide-y divide-line">
                {t.navLinks.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex min-h-[3.25rem] items-center justify-between gap-4 text-lead font-medium transition-colors duration-150',
                          active ? 'text-ink' : 'text-ink-secondary hover:text-ink'
                        )}
                      >
                        {item.label}
                        {active && (
                          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto grid grid-cols-2 gap-3 pt-8">
                <Link
                  href="/about#join"
                  onClick={(e) => {
                    setOpen(false);
                    handleJoinClick(e);
                  }}
                  className={buttonVariants({ size: 'lg' })}
                >
                  {t.header.joinUs}
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ variant: 'secondary', size: 'lg' })}
                >
                  {t.header.contact}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
