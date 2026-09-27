import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { LanguageProvider } from '@/components/language-provider';
import { MotionProvider } from '@/components/motion-provider';
import './globals.css';

// Runs before the page paints so a hard-refresh on an inner page bounces to
// the homepage instantly, with no flash of the old page's content first.
const RELOAD_REDIRECT_SCRIPT = `
(function () {
  try {
    var entries = performance.getEntriesByType('navigation');
    var navType = entries && entries[0] && entries[0].type;
    if (navType === 'reload' && window.location.pathname !== '/') {
      window.location.replace('/');
    }
  } catch (e) {}
})();
`;

// One family for the whole site: its Latin glyphs are IBM Plex Sans, so "AFAQ",
// emails and numbers sit naturally inside Arabic lines.
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-arabic',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://afaq-team.com';
const siteTitle = 'فريق AFAQ التقني';
const siteDescription = 'شبكة تقنية تطوعية عالمية بقيادة شباب من أجل تمكين المجتمع وصناعة الأثر.';
const siteImage = `${siteUrl}/og-image.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: `%s | ${siteTitle}`,
    default: siteTitle,
  },
  description: siteDescription,
  keywords: ['تطوع', 'تقنية', 'أثر مجتمعي', 'تمكين الشباب', 'فريق تقني', 'AFAQ'],
  authors: [{ name: 'فريق AFAQ التقني' }],
  creator: 'فريق AFAQ التقني',
  publisher: 'فريق AFAQ التقني',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_JO',
    alternateLocale: ['en_US'],
    url: siteUrl,
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: siteImage,
        width: 1200,
        height: 630,
        alt: siteTitle,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [siteImage],
    creator: '@afaqteam',
  },
  verification: {
    google: '', // Add Google Search Console verification code
    yandex: '', // Add Yandex verification code if needed
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: siteTitle,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#050505',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <Script id="reload-redirect" strategy="beforeInteractive">
          {RELOAD_REDIRECT_SCRIPT}
        </Script>
      </head>
      <body
        suppressHydrationWarning
        className={`${ibmPlexSansArabic.variable} bg-canvas font-sans text-ink-secondary`}
      >
        <LanguageProvider>
          <MotionProvider>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </MotionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
