'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { SectionHeading, SectionKicker } from '@/components/ui/section-heading';
import { buttonVariants } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
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
    <div>
      {/* Intro */}
      <section className="overflow-hidden border-b border-line bg-page-glow">
        <Container className="pb-16 pt-14 sm:pb-20 sm:pt-20">
          <Reveal className="max-w-3xl">
            <SectionHeading as="h1" label={about.kicker} title={about.heading} size="lg" />

            <div className="mt-8 space-y-5">
              {about.intro.map((paragraph, i) => (
                <p key={i} className="text-lead text-ink-secondary">
                  {paragraph}
                </p>
              ))}
            </div>

            <p className="mt-10 border-s-2 border-accent ps-5 text-title-2 font-semibold text-accent">
              {about.motto}
            </p>
          </Reveal>
        </Container>
      </section>

      <Container className="space-y-20 py-20 sm:space-y-24 sm:py-24">
        {/* Journey / timeline */}
        <Reveal>
          <h2 className="flex items-center gap-3 text-title-2 font-semibold text-ink">
            <span aria-hidden="true" className="kicker-rule" />
            {about.journey.kicker}
          </h2>

          <div className="relative mt-10">
            {/* Rail: runs down the start edge on small screens, across the top on large ones. */}
            <span
              aria-hidden="true"
              className="absolute bottom-2 start-[7px] top-2 w-px bg-line-strong lg:inset-x-0 lg:bottom-auto lg:top-[7px] lg:h-px lg:w-auto"
            />
            <ol className="grid gap-8 lg:grid-cols-4 lg:gap-6">
              {about.journey.timeline.map((item, i) => (
                <li key={item.year} className="relative ps-8 lg:ps-0 lg:pt-9">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute start-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-canvas lg:top-0',
                      i === about.journey.timeline.length - 1 ? 'bg-accent' : 'bg-line-input'
                    )}
                  />
                  <p className="text-body font-semibold text-ink">
                    <span className="text-accent tabular-nums">{item.year}</span> —{' '}
                    <span>{item.title}</span>
                  </p>
                  <p className="mt-2 text-small text-ink-muted">{item.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        {/* Join us */}
        <Reveal
          id="join"
          className="relative scroll-mt-28 overflow-hidden rounded-panel border border-accent/20 bg-surface p-7 sm:p-12"
        >
          <div aria-hidden="true" className="absolute inset-0 bg-page-glow" />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-accent-hairline" />

          <div className="relative max-w-3xl">
            <SectionHeading label={about.joinUs.kicker} title={about.joinUs.title} />

            <div className="mt-6 space-y-5">
              {about.joinUs.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-body text-ink-secondary">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-9">
              <a
                href={about.joinUs.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: 'lg' }), 'group')}
              >
                {about.joinUs.linkLabel}
                <ArrowLeft
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
          {/* Vision */}
          <Reveal className="rounded-panel border border-line bg-surface p-7 sm:p-10">
            <SectionHeading label={about.vision.kicker} title={about.vision.title} />

            <div className="mt-6 space-y-5">
              {about.vision.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-body text-ink-secondary">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          {/* Contact */}
          <Reveal
            delay={0.06}
            className="flex flex-col rounded-panel border border-line bg-surface p-7 sm:p-10"
          >
            <SectionKicker label={about.contact.kicker} />

            <p className="mt-5 text-body text-ink-secondary">{about.contact.description}</p>

            <div className="mt-8 flex items-center gap-4 rounded-card border border-line bg-canvas/60 p-4 lg:mt-auto">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-accent/10 text-accent ring-1 ring-inset ring-accent/25"
              >
                <Mail className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-caption text-ink-muted">{about.contact.emailLabel}</p>
                <Link
                  href={`mailto:${about.contact.email}`}
                  className="block truncate text-body font-medium text-ink transition-colors hover:text-accent"
                  dir="ltr"
                >
                  {about.contact.email}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
