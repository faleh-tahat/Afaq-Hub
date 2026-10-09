import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// page.tsx is a client component, so the route's metadata lives here.
// The root layout's template turns this into «من نحن | فريق AFAQ التقني».
export const metadata: Metadata = {
  title: 'من نحن',
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
