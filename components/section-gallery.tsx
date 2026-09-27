'use client';

import Link from 'next/link';
import { SectionHeading } from '@/components/ui/section-heading';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
import { GalleryCard } from '@/components/gallery-card';
import { useTranslation } from '@/components/language-provider';

export function SectionGallery() {
  const t = useTranslation();

  return (
    <section className="border-t border-line bg-surface/40 py-20 sm:py-28">
      <Container>
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading title={t.gallery.title} description={t.gallery.description} />
          {/* The label already ends in an arrow, so no icon is added. */}
          <Link
            href="/gallery"
            className="inline-flex min-h-11 shrink-0 items-center text-small font-semibold text-accent underline-offset-8 transition-colors hover:underline"
          >
            {t.gallery.action}
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {t.gallery.items.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.06}>
              <GalleryCard label={item.label} index={i} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
