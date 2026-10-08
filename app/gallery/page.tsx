'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/section-heading';
import { GalleryTile } from '@/components/gallery-tile';
import { GalleryStoryModal } from '@/components/gallery-story-modal';
import { useTranslation } from '@/components/language-provider';

export default function GalleryPage() {
  const t = useTranslation();
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  return (
    <div className="min-h-screen bg-brand-950 text-brand-200">
      <main className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <SectionHeading
            title={t.gallery.title}
            description={t.gallery.description}
            size="lg"
          />
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      </main>
    </div>
  );
}
