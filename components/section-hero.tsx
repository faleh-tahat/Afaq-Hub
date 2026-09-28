'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { StatsImpact } from '@/components/stats-impact';
import { cn } from '@/lib/utils';
import { shimmerBlurDataURL } from '@/lib/blur-placeholder';
import { useTranslation } from '@/components/language-provider';

export function SectionHero() {
  const t = useTranslation();

  return (
    <section className="overflow-hidden bg-brand-950">

      {/* ── Hero Image — full width, all members visible ── */}
      <div className="relative w-full" style={{ height: 'clamp(320px, 72vh, 780px)' }}>
        <Image
          src="/hero-team.jpeg"
          alt="AFAQ Tech Team"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={shimmerBlurDataURL(1920, 780)}
          className="object-cover object-top"
        />
        {/* Seamless fade into content section below */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-950 to-transparent" />
        {/* Subtle dark vignette on sides */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-brand-950/60 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-brand-950/60 to-transparent" />
      </div>

      {/* ── Content — flows seamlessly below the image ── */}
      <div className="relative -mt-10 w-full">
        <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
          <motion.blockquote
            dir="rtl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.05 }}
            className="mx-auto mb-12 max-w-4xl border-y border-white/[0.08] bg-brand-950/70 px-4 py-6 text-center shadow-glow-sm backdrop-blur-sm sm:px-8 sm:py-7"
          >
            <p className="text-xl font-semibold leading-9 text-white sm:text-2xl sm:leading-10">
              &laquo;أطلقوا طاقاتكم؛ تخيلوا المستقبل؛ وقودوا المسيرة؛ فلكم كل الدعم من الأردن. وأنا فخور بأن أكون واحدًا من أشد داعميكم.&raquo;
            </p>
            <footer className="mt-4 text-base leading-8 sm:text-lg">
              <mark className="rounded bg-amber-400/20 px-2 py-1 text-amber-200">
                صاحب الجلالة الهاشمية الملك عبدالله الثاني ابن الحسين المعظم، ملك المملكة الأردنية الهاشمية
              </mark>
            </footer>
          </motion.blockquote>

          {/* Headline + description + CTAs + proof */}
          <div className="grid gap-12">

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
              className="space-y-7"
            >
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                <span className="text-gradient">{t.hero.headline}</span>
              </h1>

              <p className="text-2xl font-semibold leading-8 text-transparent bg-gradient-to-r from-accent via-accent-200 to-brand-500 bg-clip-text sm:text-3xl">
                {t.hero.motto}
              </p>

              <p className="max-w-xl whitespace-pre-line text-base leading-7 text-brand-300 sm:text-lg">
                {t.hero.description}
              </p>

              <StatsImpact />

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={t.joinFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'group inline-flex items-center justify-center gap-2'
                  )}
                >
                  {t.hero.join}
                  <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                </a>
                <Link
                  href="/projects"
                  className={cn(
                    buttonVariants({ variant: 'secondary', size: 'lg' }),
                    'inline-flex items-center justify-center'
                  )}
                >
                  {t.hero.explore}
                </Link>
              </div>

              {/* Member proof */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex -space-x-2.5 space-x-reverse">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-9 w-9 rounded-full border-2 border-brand-950 bg-gradient-to-br from-brand-600 to-brand-800"
                      style={{ zIndex: 4 - i }}
                    />
                  ))}
                </div>
                <p className="text-sm text-brand-400">
                  <span className="font-semibold text-white">140+</span>{' '}
                  {t.hero.membersJoinedLabel}
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

    </section>
  );
}
