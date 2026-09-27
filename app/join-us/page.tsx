'use client';

import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/components/language-provider';

export default function JoinUsPage() {
  const t = useTranslation();

  return (
    <div>
      <PageHeader title={t.joinSection.title} description={t.joinSection.description} />

      <Container className="py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          {/* Roles */}
          <Reveal className="space-y-4">
            <h2 className="text-title-3 font-semibold text-ink">{t.joinSection.openRolesLabel}</h2>
            {t.joinSection.roles.map((role, i) => (
              <Card key={role.title} padding="md">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-accent/10 text-small font-semibold text-accent ring-1 ring-inset ring-accent/25 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-body font-semibold text-ink">{role.title}</h3>
                    <p className="mt-1 text-small text-ink-secondary">{role.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </Reveal>

          {/* Process */}
          <Reveal
            delay={0.08}
            className="relative self-start overflow-hidden rounded-panel border border-line bg-surface p-7 sm:p-9 lg:sticky lg:top-28"
          >
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-accent-hairline" />

            <h2 className="text-title-3 font-semibold text-ink">{t.joinSection.processTitle}</h2>

            <div className="relative mt-8">
              <span
                aria-hidden="true"
                className="absolute bottom-4 start-[15px] top-4 w-px bg-line-strong"
              />
              <ol className="space-y-6">
                {t.joinSection.processSteps.map((step, i) => (
                  <li key={i} className="relative flex items-start gap-4">
                    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line-input bg-canvas text-small font-semibold text-ink tabular-nums">
                      {i + 1}
                    </span>
                    <p className="pt-0.5 text-body text-ink-secondary">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 space-y-4 border-t border-line pt-8">
              <Button size="lg" className="group w-full">
                {t.joinSection.action}
                <ArrowLeft
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                />
              </Button>
              <p className="flex items-center justify-center gap-2 text-small text-ink-muted">
                <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-success" />
                {t.joinSection.freeToJoinNote}
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
