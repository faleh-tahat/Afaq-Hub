'use client';

import { type LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { cn } from '@/lib/utils';

export interface CommitteeCardItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function CommitteeCards({
  items,
  className,
}: {
  items: CommitteeCardItem[];
  className?: string;
}) {
  return (
    <div
      dir="rtl"
      className={cn('grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3', className)}
    >
      {items.map((item, i) => {
        const Icon = item.icon;

        return (
          <Reveal key={item.title} delay={(i % 3) * 0.06} className="h-full">
            <article className="relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface p-6 sm:p-7">
              {/* Faint circuit texture in the corner, echoing the logo mark */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -end-6 -top-6 h-40 w-40 bg-circuit opacity-70 [mask-image:radial-gradient(closest-side,black,transparent)]"
              />

              <span
                aria-hidden="true"
                className="relative flex h-12 w-12 items-center justify-center rounded-control bg-accent/10 text-accent ring-1 ring-inset ring-accent/25"
              >
                <Icon className="h-6 w-6" strokeWidth={1.6} />
              </span>

              <h2 className="relative mt-6 text-title-3 font-semibold text-ink">{item.title}</h2>
              <p className="relative mt-3 text-body text-ink-secondary">{item.description}</p>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
