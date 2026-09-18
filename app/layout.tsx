import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { Inter, IBM_Plex_Sans, IBM_Plex_Sans_Arabic, Fraunces } from 'next/font/google';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { LanguageProvider } from '@/components/language-provider';
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

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex',
});
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-arabic',
});
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-fraunces',
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
  keywords: [
    'تطوع',
    'تقنية',
    'أثر مجتمعي',
    'تمكين الشباب',
    'فريق تقني',
    'AFAQ',
  ],
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
        className={`${inter.variable} ${ibmPlexSans.variable} ${ibmPlexSansArabic.variable} ${fraunces.variable} font-sans bg-brand-950 text-brand-200`}
      >
        <LanguageProvider>
          <div className="min-h-screen">
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
