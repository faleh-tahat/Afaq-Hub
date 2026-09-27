'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/components/language-provider';

export default function ProjectsPage() {
  const t = useTranslation();

  return (
    <div>
      <PageHeader title={t.projects.title} description={t.projects.description} />

      <Container className="py-14 sm:py-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {t.projects.items.map((project, i) => (
            <Reveal key={project.title} delay={i * 0.06} className="h-full">
              <Card className="relative flex h-full flex-col overflow-hidden">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-accent-hairline opacity-70"
                />

                <p className="text-small font-semibold text-accent">{project.category}</p>
                <h2 className="mt-3 text-title-3 font-semibold text-ink">{project.title}</h2>
                <p className="mt-3 text-body text-ink-secondary">{project.subtitle}</p>

                <div className="mt-auto pt-8">
                  {/* The label already ends in an arrow, so no icon is added. */}
                  <Link
                    href="/contact"
                    className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}
                  >
                    {t.projects.action}
                  </Link>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
