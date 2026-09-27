import * as React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  description?: string;
  label?: string;
  align?: 'left' | 'center';
  size?: 'default' | 'lg';
  className?: string;
  labelClassName?: string;
}

const ARABIC_RE = /[؀-ۿ]/;

export function SectionHeading({
  title,
  description,
  label = 'AFAQ',
  align = 'left',
  size = 'default',
  className,
  labelClassName,
}: SectionHeadingProps) {
  const isCenter = align === 'center';
  const isLg = size === 'lg';
  // The kicker defaults to the Latin "AFAQ" wordmark but callers (e.g. the
  // About page) also pass Arabic kickers ("مسيرتنا", "الانتساب"...). Tracking
  // and uppercase only make sense for the Latin case, so detect rather than
  // ask every caller to remember to opt out.
  const isArabicLabel = ARABIC_RE.test(label);

  return (
    <div
      className={cn(
        'space-y-5',
        isCenter ? 'text-center mx-auto' : 'text-right',
        className
      )}
    >
      {label && (
        <div className={cn('flex items-center gap-3', isCenter && 'justify-center')}>
          <span className="h-px w-8 bg-accent/40" />
          <p
            className={cn(
              'text-xs font-semibold text-accent/80',
              isArabicLabel ? 'tracking-normal' : 'uppercase tracking-widest-3',
              labelClassName
            )}
          >
            {label}
          </p>
        </div>
      )}

      {title && (
        <h2
          className={cn(
            'font-semibold tracking-tight text-white',
            isLg
              ? 'text-4xl sm:text-5xl lg:text-6xl'
              : 'text-3xl sm:text-4xl lg:text-[2.625rem]',
            isCenter && 'max-w-3xl mx-auto'
          )}
        >
          {title}
        </h2>
      )}

      {description && (
        <p
          className={cn(
            'leading-7 text-brand-400',
            isLg ? 'text-base sm:text-lg' : 'text-sm sm:text-base',
            isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
