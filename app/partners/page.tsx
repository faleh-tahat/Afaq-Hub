'use client';

import { PageHeader } from '@/components/ui/page-header';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
import { useTranslation } from '@/components/language-provider';

export default function PartnersPage() {
  const t = useTranslation();

  return (
    <div>
      <PageHeader title={t.partners.title} description={t.partners.description} />

      <Container className="py-14 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {t.partners.list.map((partner, i) => (
            <Reveal key={partner} delay={i * 0.05} className="h-full">
              <div className="relative flex h-full min-h-[10rem] flex-col items-center justify-center gap-2 overflow-hidden rounded-card border border-line bg-surface px-6 py-10 text-center">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-circuit opacity-40 [mask-image:radial-gradient(closest-side,black,transparent)]"
                />
                <p className="relative text-caption font-medium text-ink-muted">
                  {t.partners.itemLabel}
                </p>
                <h2 className="relative text-title-3 font-semibold text-ink">{partner}</h2>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
