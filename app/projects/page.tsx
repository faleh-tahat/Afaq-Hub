'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/components/language-provider';

const CARD_ACCENTS = [
  'border-t-accent/30',
  'border-t-blue-500/30',
  'border-t-purple-500/30',
];

export default function ProjectsPage() {
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
            title={t.projects.title}
            description={t.projects.description}
            size="lg"
          />
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {t.projects.items.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className="h-full"
            >
              <Card
                className={`group flex h-full flex-col justify-between gap-8 border-t-2 p-7 ${CARD_ACCENTS[i % CARD_ACCENTS.length]}`}
              >
                <div className="space-y-4">
                  <p className="text-2xs font-bold text-accent/70">
                    {project.category}
                  </p>
                  <h2 className="text-xl font-semibold leading-snug text-white">
                    {project.title}
                  </h2>
                  <p className="text-sm leading-6 text-brand-500">{project.subtitle}</p>
                </div>

                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ variant: 'secondary', size: 'sm' }),
                    'group/btn inline-flex w-full items-center justify-center gap-2'
                  )}
                >
                  {t.projects.action}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-all duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 group-hover/btn:opacity-100" />
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
