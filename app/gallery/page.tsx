'use client';

import { motion } from 'framer-motion';
import { Images } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { useTranslation } from '@/components/language-provider';

const GALLERY_GRADIENTS = [
  'from-accent/20 via-blue-900/30 to-brand-900',
  'from-purple-900/40 via-brand-800/30 to-brand-900',
  'from-emerald-900/30 via-brand-800/20 to-brand-900',
  'from-blue-900/40 via-accent/10 to-brand-900',
  'from-rose-900/30 via-brand-800/20 to-brand-900',
  'from-amber-900/25 via-brand-800/20 to-brand-900',
];

export default function GalleryPage() {
  const t = useTranslation();

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
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
            >
              <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/[0.06]">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${GALLERY_GRADIENTS[i % GALLERY_GRADIENTS.length]} transition-all duration-500 group-hover:scale-105`}
                />
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'radial-gradient(circle, rgba(229,236,244,0.15) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
                <div className="absolute inset-0 bg-brand-950/0 transition-all duration-300 group-hover:bg-brand-950/30" />
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  <div className="flex justify-end">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-brand-950/60 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                      <Images className="h-4 w-4 text-brand-300" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-white drop-shadow-sm">{item.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
