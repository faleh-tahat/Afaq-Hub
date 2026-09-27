'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/components/language-provider';

export default function AboutPage() {
  const t = useTranslation();
  const about = t.about;

  useEffect(() => {
    if (window.location.hash === '#join') {
      const timer = setTimeout(() => {
        document.getElementById('join')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-brand-950 text-brand-200">
      <main className="mx-auto max-w-5xl px-6 py-24 lg:px-8">

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading label={about.kicker} title={about.heading} size="lg" />

          <div className="mt-8 max-w-3xl space-y-5">
            {about.intro.map((paragraph, i) => (
              <p key={i} className="text-sm leading-7 text-brand-400 sm:text-base">
                {paragraph}
              </p>
            ))}
          </div>

          <p className="mt-8 text-xl font-semibold leading-8 text-transparent bg-gradient-to-r from-accent via-accent-200 to-brand-500 bg-clip-text sm:text-2xl">
            {about.motto}
          </p>
        </motion.div>

        {/* Journey / timeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-20 rounded-4xl border border-white/[0.08] bg-brand-900/60 p-8 shadow-card backdrop-blur-xl sm:p-10"
        >
          <SectionHeading
            label={about.journey.kicker}
            title=""
            labelClassName="text-xl sm:text-2xl tracking-normal normal-case"
          />

          <div className="relative mt-8 space-y-0">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/[0.06]" />

            {about.journey.timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="relative pl-8 pb-8 last:pb-0"
              >
                <div className="absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 border-brand-950 bg-brand-700" />

                <p className="text-2xs font-bold uppercase tracking-widest-3 text-accent/70">
                  {item.year} — {item.title}
                </p>
                <p className="mt-1.5 text-sm leading-6 text-brand-500">
                  {item.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Join us */}
        <motion.div
          id="join"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-4xl border border-white/[0.08] bg-brand-900/60 p-8 shadow-card backdrop-blur-xl sm:p-10"
        >
          <SectionHeading label={about.joinUs.kicker} title={about.joinUs.title} />

          <div className="mt-6 max-w-3xl space-y-5">
            {about.joinUs.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-sm leading-7 text-brand-400 sm:text-base">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={t.joinFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'group inline-flex items-center gap-2'
              )}
            >
              {about.joinUs.linkLabel}
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            </a>
          </div>
        </motion.div>

        {/* Vision */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-4xl border border-white/[0.08] bg-brand-900/60 p-8 shadow-card backdrop-blur-xl sm:p-10"
        >
          <SectionHeading label={about.vision.kicker} title={about.vision.title} />

          <div className="mt-6 max-w-3xl space-y-5">
            {about.vision.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-sm leading-7 text-brand-400 sm:text-base">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-4xl border border-white/[0.08] bg-brand-900/60 p-8 shadow-card backdrop-blur-xl sm:p-10"
        >
          <SectionHeading label={about.contact.kicker} title="" />

          <p className="mt-6 max-w-3xl text-sm leading-7 text-brand-400 sm:text-base">
            {about.contact.description}
          </p>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
              <Mail className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-xs font-medium text-brand-500">{about.contact.emailLabel}</p>
              <Link
                href={`mailto:${about.contact.email}`}
                className="text-sm font-medium text-white transition-colors hover:text-accent"
                dir="ltr"
              >
                {about.contact.email}
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
