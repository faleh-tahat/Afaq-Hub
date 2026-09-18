'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Images } from 'lucide-react';
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

export function SectionGallery() {
  const t = useTranslation();

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
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
            >
              <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/[0.06]">
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${GALLERY_GRADIENTS[i % GALLERY_GRADIENTS.length]} transition-all duration-500 group-hover:scale-105`}
                />

                {/* Pattern overlay */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'radial-gradient(circle, rgba(229,236,244,0.15) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-brand-950/0 transition-all duration-300 group-hover:bg-brand-950/30" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  <div className="flex justify-end">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-brand-950/60 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                      <Images className="h-4 w-4 text-brand-300" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white drop-shadow-sm">
                      {item.label}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
