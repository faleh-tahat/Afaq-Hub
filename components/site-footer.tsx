'use client';

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { useTranslation } from '@/components/language-provider';

const footerLink =
  'inline-flex min-h-[2.25rem] items-center text-small text-ink-muted transition-colors duration-150 hover:text-ink';

export function SiteFooter() {
  const t = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-canvas">
      {/* Logo-gradient hairline */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-px h-px bg-accent-hairline opacity-60"
      />

      {/* Main Footer */}
      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_0.8fr] lg:gap-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-title-3 font-semibold text-ink">{t.siteTitle}</p>
              <p className="max-w-sm text-small text-ink-muted">{t.footer.copy}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/join-us" className={buttonVariants({ variant: 'primary', size: 'sm' })}>
                {t.footer.join}
              </Link>
              <Link
                href="/contact"
                className={buttonVariants({ variant: 'secondary', size: 'sm' })}
              >
                {t.footer.contact}
              </Link>
            </div>
          </div>

          {/* Explore Column */}
          <nav aria-labelledby="footer-explore">
            <h3 id="footer-explore" className="text-small font-semibold text-ink">
              {t.footer.explore}
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-8">
              {t.navLinks.slice(0, 6).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal Column */}
          <nav aria-labelledby="footer-legal">
            <h3 id="footer-legal" className="text-small font-semibold text-ink">
              {t.footer.legal}
            </h3>
            <ul className="mt-4">
              <li>
                <Link href="/privacy-policy" className={footerLink}>
                  {t.footer.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className={footerLink}>
                  {t.footer.terms}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-line">
        <Container className="flex flex-col items-start justify-between gap-2 py-5 sm:flex-row sm:items-center">
          <p className="text-caption text-ink-muted">
            &copy; {year} {t.siteTitle}. {t.footer.rightsReserved}
          </p>
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-success" />
            <p className="text-caption text-ink-muted">{t.footer.systemsOperational}</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
