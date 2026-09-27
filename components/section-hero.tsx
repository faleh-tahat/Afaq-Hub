'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, User } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
import { StatsImpact } from '@/components/stats-impact';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/components/language-provider';

const EASE = [0.22, 1, 0.36, 1] as const;

export function SectionHero() {
  const t = useTranslation();

  return (
    <section className="overflow-hidden">
      {/* ── Team photo: full width at its natural ratio so every member stays in frame ── */}
      <div className="relative w-full">
        <Image
          src="/hero-team.jpeg"
          alt="AFAQ Tech Team"
          width={1600}
          height={772}
          priority
          sizes="100vw"
          className="h-auto w-full object-cover object-top lg:max-h-[80vh]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-canvas/50 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-canvas to-transparent sm:h-1/3"
        />
      </div>

      {/* ── Royal quote: overlaps the photo so it reads first, straight after the team ── */}
      <Container className="relative z-10 -mt-4 sm:-mt-10 lg:-mt-14">
        <motion.blockquote
          dir="rtl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-panel border border-gold/25 bg-surface/90 px-6 py-8 text-center shadow-elev-2 backdrop-blur-md sm:px-12 sm:py-10"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent"
          />
          <p className="text-[1.1875rem] font-semibold leading-[1.95] text-ink sm:text-[1.5rem] sm:leading-[1.9]">
            &laquo;أطلقوا طاقاتكم؛ تخيلوا المستقبل؛ وقودوا المسيرة؛ فلكم كل الدعم من الأردن. وأنا
            فخور بأن أكون واحدًا من أشد داعميكم.&raquo;
          </p>
          <footer className="mt-6 flex justify-center">
            <mark className="rounded-control bg-gold/10 px-4 py-2 text-small font-medium leading-[1.8] text-gold ring-1 ring-inset ring-gold/25 sm:text-body">
              صاحب الجلالة الهاشمية الملك عبدالله الثاني ابن الحسين المعظم، ملك المملكة الأردنية
              الهاشمية
            </mark>
          </footer>
        </motion.blockquote>
      </Container>

      {/* ── Headline, description, impact, calls to action ── */}
      <Container className="pb-20 pt-16 sm:pb-28 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="grid gap-5 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-8"
        >
          <h1 className="text-display font-bold text-ink lg:col-span-12">
            <span className="text-gradient">{t.hero.headline}</span>
          </h1>

          <p className="text-title-2 font-semibold text-accent lg:col-span-4">{t.hero.motto}</p>

          <p className="max-w-prose whitespace-pre-line text-lead text-ink-secondary lg:col-span-8">
            {t.hero.description}
          </p>
        </motion.div>

        <StatsImpact className="mt-16 sm:mt-20" />

        <Reveal className="mt-10 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/join-us" className={cn(buttonVariants({ size: 'lg' }), 'group')}>
              {t.hero.join}
              <ArrowLeft
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              />
            </Link>
            <Link href="/projects" className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
              {t.hero.explore}
            </Link>
          </div>

          {/* Member proof */}
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="flex -space-x-3 space-x-reverse">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-canvas bg-surface-raised text-ink-muted"
                  style={{ zIndex: 4 - i }}
                >
                  <User className="h-4 w-4" strokeWidth={1.75} />
                </span>
              ))}
            </div>
            <p className="text-small text-ink-muted">
              <span className="font-semibold text-ink">140+</span> {t.hero.membersJoinedLabel}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
