'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/components/language-provider';

export default function EventsPage() {
  const t = useTranslation();

  return (
    <div className="min-h-screen bg-brand-950 text-brand-200">
      <main className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <SectionHeading
          title={t.events.title}
          description={t.events.description}
          size="lg"
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {t.events.items.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <Card className="p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-xl border border-accent/15 bg-accent/6 px-3 py-1.5">
                      <Calendar className="h-3.5 w-3.5 text-accent/60" />
                      <p className="text-2xs font-semibold text-accent/80">
                        {event.date}
                      </p>
                    </div>
                    <h2 className="text-xl font-semibold text-white">{event.title}</h2>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-white/[0.06] bg-brand-950/50 px-3 py-2 text-xs text-brand-400">
                    <MapPin className="h-3 w-3 text-brand-600" />
                    {event.location}
                  </div>
                </div>
                <p className="mt-5 text-sm leading-7 text-brand-500">{event.description}</p>
                <div className="mt-6 border-t border-white/[0.06] pt-5">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400 transition-colors hover:text-white"
                  >
                    {t.events.viewDetails}
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 overflow-hidden rounded-4xl border border-white/[0.08] bg-gradient-to-br from-brand-800/50 to-brand-950 p-10 text-center shadow-glow sm:p-14"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          <p className="text-xs font-semibold text-accent/70">
            {t.events.stayConnectedTitle}
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
            {t.events.stayConnectedDescription}
          </h2>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className={cn(buttonVariants({ size: 'lg' }), 'inline-flex items-center gap-2 group')}
            >
              {t.events.contactButton}
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
