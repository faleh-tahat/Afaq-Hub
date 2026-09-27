import * as React from 'react';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  label?: string;
  size?: 'default' | 'lg';
  className?: string;
}

// Shared top band for inner pages: the page's h1 on a faint logo-cyan glow.
export function PageHeader({ title, description, label, size = 'lg', className }: PageHeaderProps) {
  return (
    <section className={cn('overflow-hidden border-b border-line bg-page-glow', className)}>
      <Container className="pb-12 pt-14 sm:pb-16 sm:pt-20">
        <Reveal>
          <SectionHeading
            as="h1"
            title={title}
            description={description}
            label={label}
            size={size}
          />
        </Reveal>
      </Container>
    </section>
  );
}
