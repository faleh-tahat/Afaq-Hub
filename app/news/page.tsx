'use client';

import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/components/language-provider';

export default function NewsPage() {
  const t = useTranslation();

  return (
    <div>
      <PageHeader title={t.news.title} description={t.news.description} />

      <Container className="py-14 sm:py-20">
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          {t.news.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06} className="h-full">
              <Card className="flex h-full flex-col">
                <p className="flex items-center gap-2 text-caption font-medium text-ink-muted">
                  <CalendarDays aria-hidden="true" className="h-4 w-4" />
                  {item.date}
                </p>
                <h2 className="mt-4 text-title-3 font-semibold text-ink">{item.title}</h2>
                <p className="mt-3 text-body text-ink-secondary">{t.news.summary}</p>

                <div className="mt-auto pt-6">
                  <div className="border-t border-line pt-4">
                    {/* The label already ends in an arrow, so no icon is added. */}
                    <Link
                      href="/contact"
                      className="inline-flex min-h-11 items-center text-small font-semibold text-accent underline-offset-8 hover:underline"
                    >
                      {t.news.contactLink}
                    </Link>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
