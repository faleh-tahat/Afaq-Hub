'use client';

import { PageHeader } from '@/components/ui/page-header';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
import { GalleryCard } from '@/components/gallery-card';
import { useTranslation } from '@/components/language-provider';

export default function GalleryPage() {
  const t = useTranslation();

  return (
    <div>
      <PageHeader title={t.gallery.title} description={t.gallery.description} />

      <Container className="py-14 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {t.gallery.items.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.06}>
              <GalleryCard label={item.label} index={i} />
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
