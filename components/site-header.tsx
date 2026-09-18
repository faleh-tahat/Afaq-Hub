'use client';

import { useState } from 'react';
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
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslation();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

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

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-brand-950/90 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">

        {/* Logo */}
        <Link href="/" aria-label={t.logoAlt} className="inline-flex items-center">
          <Image
            src="/afaq-logo-full.png"
            alt={t.logoAlt}
            width={1705}
            height={646}
            priority
            className="h-14 w-auto object-contain sm:h-16"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {t.navLinks.slice(0, 7).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-active={isActive(item.href)}
              className="nav-link rounded-lg px-3 py-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/about#join"
            onClick={handleJoinClick}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'inline-flex items-center justify-center'
            )}
          >
            {t.header.joinUs}
          </Link>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'sm' }),
              'inline-flex items-center justify-center'
            )}
          >
            {t.header.contact}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          aria-label={open ? t.header.closeMenu : t.header.openMenu}
          aria-expanded={open}
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 lg:hidden',
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
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
                <Link
                  href="/about#join"
                  onClick={(e) => {
                    setOpen(false);
                    handleJoinClick(e);
                  }}
                  className={cn(
                    buttonVariants({ size: 'default' }),
                    'inline-flex items-center justify-center'
                  )}
                >
                  {t.header.joinUs}
                </Link>
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
