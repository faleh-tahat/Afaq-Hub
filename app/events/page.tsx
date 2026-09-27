'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
import { Card } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/components/language-provider';

export default function EventsPage() {
  const t = useTranslation();

  return (
    <div>
      <PageHeader title={t.events.title} description={t.events.description} />

      <Container className="py-14 sm:py-20">
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          {t.events.items.map((event, i) => (
            <Reveal key={event.title} delay={i * 0.06} className="h-full">
              <Card className="flex h-full flex-col">
                <span className="inline-flex items-center gap-2 self-start rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-caption font-medium text-accent">
                  <Calendar aria-hidden="true" className="h-3.5 w-3.5" />
                  {event.date}
                </span>

                <h2 className="mt-5 text-title-3 font-semibold text-ink">{event.title}</h2>
                <p className="mt-2 flex items-center gap-2 text-small text-ink-muted">
                  <MapPin aria-hidden="true" className="h-4 w-4 shrink-0" />
                  {event.location}
                </p>
                <p className="mt-4 text-body text-ink-secondary">{event.description}</p>

                <div className="mt-auto pt-6">
                  <div className="border-t border-line pt-4">
                    {/* The label already ends in an arrow, so no icon is added. */}
                    <Link
                      href="/contact"
                      className="inline-flex min-h-11 items-center text-small font-semibold text-accent underline-offset-8 hover:underline"
                    >
                      {t.events.viewDetails}
                    </Link>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal className="relative mt-14 overflow-hidden rounded-panel border border-line bg-surface px-6 py-12 text-center sm:mt-20 sm:px-12 sm:py-16">
          <div aria-hidden="true" className="absolute inset-0 bg-page-glow" />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-accent-hairline" />

          <div className="relative">
            <p className="text-small font-semibold text-accent">{t.events.stayConnectedTitle}</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-title-2 font-semibold text-ink">
              {t.events.stayConnectedDescription}
            </h2>
            <div className="mt-8 flex justify-center">
              <Link href="/contact" className={cn(buttonVariants({ size: 'lg' }), 'group')}>
                {t.events.contactButton}
                <ArrowLeft
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
