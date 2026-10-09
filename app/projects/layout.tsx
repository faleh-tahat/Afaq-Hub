import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Alexandria, Amiri } from 'next/font/google';

// Page-only fonts: Alexandria for headings, Amiri for poetry and slogans.
// IBM Plex Sans Arabic (body) already comes from the root layout.
const alexandria = Alexandria({
  subsets: ['arabic', 'latin'],
  weight: ['700', '800', '900'],
  variable: '--font-alexandria',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'المشاريع',
  description: 'ننتج: المشروع الأم لمشاريع فريق آفاق في الذكاء الاصطناعي: بيّنة ومترنّم ومهباش.',
};

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return <div className={`${alexandria.variable} ${amiri.variable}`}>{children}</div>;
}
