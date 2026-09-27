import * as React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  description?: string;
  label?: string;
  align?: 'start' | 'center';
  size?: 'default' | 'lg';
  as?: 'h1' | 'h2';
  className?: string;
  labelClassName?: string;
}

const LATIN_ONLY = /^[\x20-\x7E]+$/;

export function SectionKicker({ label, className }: { label: string; className?: string }) {
  // Letter-spacing suits Latin labels such as "AFAQ" but breaks connected
  // Arabic script, so it is only applied to Latin-only text.
  const latin = LATIN_ONLY.test(label);
  return (
    <p
      className={cn(
        'flex items-center gap-3 font-semibold text-accent',
        latin ? 'text-caption uppercase tracking-[0.18em]' : 'text-small',
        className
      )}
    >
      <span aria-hidden="true" className="kicker-rule" />
      {label}
    </p>
  );
}

export function SectionHeading({
  title,
  description,
  label = 'AFAQ',
  align = 'start',
  size = 'default',
  as: Heading = 'h2',
  className,
  labelClassName,
}: SectionHeadingProps) {
  const isCenter = align === 'center';
  const isLg = size === 'lg';

  return (
    <div className={cn('space-y-4', isCenter && 'mx-auto text-center', className)}>
      {label && (
        <SectionKicker label={label} className={cn(isCenter && 'justify-center', labelClassName)} />
      )}

      {title && (
        <Heading
          className={cn(
            'font-semibold text-ink',
            isLg ? 'text-title-1' : 'text-title-2',
            'max-w-3xl',
            isCenter && 'mx-auto'
          )}
        >
          {title}
        </Heading>
      )}

      {description && (
        <p
          className={cn(
            'max-w-prose text-ink-secondary',
            isLg ? 'text-lead' : 'text-body',
            isCenter && 'mx-auto'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
