'use client';

import { PageHeader } from '@/components/ui/page-header';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';

interface LegalDocumentProps {
  title: string;
  description: string;
  sections: { title: string; content: string }[];
}

// Shared reading layout for the privacy policy and terms pages.
export function LegalDocument({ title, description, sections }: LegalDocumentProps) {
  return (
    <div>
      <PageHeader title={title} description={description} size="default" />

      <Container className="py-14 sm:py-20">
        <Reveal className="mx-auto max-w-3xl divide-y divide-line rounded-panel border border-line bg-surface px-6 sm:px-10">
          {sections.map((section) => (
            <section key={section.title} className="py-8">
              <h2 className="text-title-3 font-semibold text-ink">{section.title}</h2>
              <p className="mt-3 text-body text-ink-secondary">{section.content}</p>
            </section>
          ))}
        </Reveal>
      </Container>
    </div>
  );
}
