'use client';

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { useTranslation } from '@/components/language-provider';
import { cn } from '@/lib/utils';

export function SiteFooter() {
  const t = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] bg-brand-950">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr]">

          {/* Brand Column */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest-3 text-accent/70">
                {t.siteTitle}
              </p>
              <p className="mt-3 max-w-sm text-sm leading-7 text-brand-500">
                {t.footer.copy}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/join-us"
                className={cn(
                  buttonVariants({ variant: 'primary', size: 'sm' }),
                  'inline-flex items-center justify-center'
                )}
              >
                {t.footer.join}
              </Link>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: 'secondary', size: 'sm' }),
                  'inline-flex items-center justify-center'
                )}
              >
                {t.footer.contact}
              </Link>
            </div>
          </div>

          {/* Explore Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest-3 text-brand-300">
              {t.footer.explore}
            </h3>
            <ul className="mt-5 space-y-3">
              {t.navLinks.slice(0, 6).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-brand-500 transition-colors duration-150 hover:text-brand-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest-3 text-brand-300">
              {t.footer.legal}
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-brand-500 transition-colors duration-150 hover:text-brand-200"
                >
                  {t.footer.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-brand-500 transition-colors duration-150 hover:text-brand-200"
                >
                  {t.footer.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row lg:px-8">
          <p className="text-xs text-brand-600">
            &copy; {year} {t.siteTitle}. {t.footer.rightsReserved}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
            <p className="text-xs text-brand-600">{t.footer.systemsOperational}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
