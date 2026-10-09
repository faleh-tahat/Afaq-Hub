'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { buttonVariants } from '@/components/ui/button';
import { useTranslation } from '@/components/language-provider';
import { cn } from '@/lib/utils';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While open: lock body scroll, close on Escape, trap Tab focus inside the
  // panel, and return focus to the toggle button on close.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const firstFocusable = menuRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !menuRef.current) return;

      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
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

    document.addEventListener('keydown', handleKeyDown);
    const toggleButton = toggleRef.current;
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      toggleButton?.focus();
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-afaq-hairline bg-brand-950/[0.82] backdrop-blur-[14px] backdrop-saturate-[1.4]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6 sm:h-[72px] lg:px-8">

        {/* Logo */}
        <Link href="/" aria-label={t.logoAlt} className="inline-flex h-11 shrink-0 items-center">
          <Image
            src="/afaq-logo-full.png"
            alt={t.logoAlt}
            width={1705}
            height={646}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav — the active link's underline sits on the header's bottom edge */}
        <nav aria-label={t.footer.explore} className="hidden h-full items-stretch gap-1 lg:flex">
          {t.navLinks.slice(0, 5).map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex items-center px-3 text-[15px] transition-colors duration-200',
                  active ? 'font-semibold text-white' : 'text-brand-400 hover:text-white'
                )}
              >
                {item.label}
                {active && (
                  <span aria-hidden className="absolute inset-x-3 -bottom-px h-0.5 bg-afaq-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Primary CTA */}
          <a
            href={t.joinFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-afaq-accent px-5 text-[15px] font-semibold text-afaq-on-accent transition-colors duration-200 hover:bg-afaq-accent-hover focus-visible:rounded-full"
          >
            {t.header.joinUs}
          </a>
          {/* Ghost CTA — below 640px it lives in the mobile menu only */}
          <Link
            href="/contact"
            className="hidden h-11 items-center justify-center whitespace-nowrap rounded-full border border-afaq-ghost px-[18px] text-[15px] font-semibold text-afaq-strong transition-colors duration-200 hover:border-afaq-ghost-hover hover:bg-white/5 focus-visible:rounded-full sm:inline-flex"
          >
            {t.header.contact}
          </Link>

          {/* Mobile Toggle */}
          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? t.header.closeMenu : t.header.openMenu}
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
            className={cn(
              'inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 lg:hidden',
              open
                ? 'border-accent/30 bg-accent/10 text-accent'
                : 'border-white/10 bg-brand-900 text-brand-300 hover:border-white/20 hover:text-white'
            )}
            onClick={() => setOpen((v) => !v)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label={open ? t.header.closeMenu : t.header.openMenu}
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden border-t border-white/[0.06] bg-brand-950/98 lg:hidden"
          >
            <div className="mx-auto max-w-7xl space-y-1 px-6 py-5">
              {t.navLinks.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={cn(
                      'flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150',
                      isActive(item.href)
                        ? 'bg-accent/8 text-white border border-accent/15'
                        : 'text-brand-300 hover:bg-brand-900/60 hover:text-white'
                    )}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <span className="ms-auto h-1.5 w-1.5 rounded-full bg-accent" />
                    )}
                  </Link>
                </motion.div>
              ))}

              <div className="mt-4 grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
                <a
                  href={t.joinFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ size: 'default' }),
                    'inline-flex items-center justify-center'
                  )}
                >
                  {t.header.joinUs}
                </a>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ variant: 'secondary', size: 'default' }),
                    'inline-flex items-center justify-center'
                  )}
                >
                  {t.header.contact}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
