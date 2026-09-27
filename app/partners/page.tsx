'use client';

import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/section-heading';
import { useTranslation } from '@/components/language-provider';

export default function PartnersPage() {
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
            title={t.partners.title}
            description={t.partners.description}
            size="lg"
          />
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.partners.list.map((partner, i) => (
            <motion.div
              key={partner}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
            >
              <div className="group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/[0.06] bg-brand-900/40 px-6 py-10 text-center transition-all duration-300 hover:border-white/[0.14] hover:bg-brand-900/70 hover:-translate-y-0.5 hover:shadow-card">
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/0 to-accent/0 opacity-0 transition-opacity duration-300 group-hover:from-accent/4 group-hover:to-transparent group-hover:opacity-100" />
                <p className="relative text-xs font-semibold text-brand-600 transition-colors duration-200 group-hover:text-accent/60">
                  {t.partners.itemLabel}
                </p>
                <h3 className="relative text-base font-semibold text-brand-300 transition-colors duration-200 group-hover:text-white">
                  {partner}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
