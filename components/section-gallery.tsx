'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { GalleryTile } from '@/components/gallery-tile';
import { GalleryStoryModal } from '@/components/gallery-story-modal';
import { useTranslation } from '@/components/language-provider';

export function SectionGallery() {
  const t = useTranslation();
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            title={t.gallery.title}
            description={t.gallery.description}
          />
          <Link
            href="/gallery"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent/80 transition-colors hover:text-accent"
          >
            {t.gallery.action}
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.gallery.items.map((item, i) => (
            <GalleryTile
              key={item.label}
              item={item}
              index={i}
              onOpen={(trigger) => {
                openerRef.current = trigger;
                setStoryIndex(i);
              }}
            />
          ))}
        </div>
        <GalleryStoryModal
          items={t.gallery.items}
          index={storyIndex}
          onIndexChange={setStoryIndex}
          onClose={() => setStoryIndex(null)}
          returnFocusRef={openerRef}
        />
      </div>
    </section>
  );
}
