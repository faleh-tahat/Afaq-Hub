'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/components/language-provider';

export default function NewsPage() {
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
            title={t.news.title}
            description={t.news.description}
            size="lg"
          />
        </motion.div>

        <div className="mt-14 grid gap-5 xl:grid-cols-2">
          {t.news.items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
            >
              <Card className="group p-7">
                <p className="text-2xs font-semibold uppercase tracking-widest-3 text-brand-600">
                  {item.date}
                </p>
                <h2 className="mt-4 text-lg font-semibold leading-snug text-white transition-colors group-hover:text-accent/90">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-brand-500">{t.news.summary}</p>
                <div className="mt-6 border-t border-white/[0.06] pt-5">
                  <Link
                    href="/contact"
                    className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400 transition-colors hover:text-white"
                  >
                    {t.news.contactLink}
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:-translate-x-0.5" />
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
