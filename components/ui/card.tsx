import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-3xl transition-all duration-300 ease-smooth',
  {
    variants: {
      variant: {
        default: [
          'border border-white/[0.08] bg-brand-900/80 shadow-card',
          'hover:border-white/[0.14] hover:shadow-card-hover hover:-translate-y-0.5',
          'backdrop-blur-xl',
        ].join(' '),
        elevated: [
          'border border-white/[0.10] bg-brand-800/60 shadow-glow-sm',
          'hover:border-white/[0.18] hover:shadow-glow hover:-translate-y-1',
          'backdrop-blur-xl',
        ].join(' '),
        glass: [
          'border border-white/[0.06] bg-white/[0.03] shadow-soft',
          'hover:border-white/[0.10] hover:bg-white/[0.05] hover:-translate-y-0.5',
          'backdrop-blur-2xl',
        ].join(' '),
        flat: [
          'border border-white/[0.06] bg-brand-900/40',
          'hover:border-white/[0.10] hover:bg-brand-900/60',
        ].join(' '),
        accent: [
          'border border-accent/20 bg-brand-900/80 shadow-glow-sm',
          'hover:border-accent/35 hover:shadow-glow hover:-translate-y-0.5',
          'backdrop-blur-xl',
        ].join(' '),
      },
      padding: {
        none: '',
        sm:   'p-5',
        md:   'p-6',
        default: 'p-7',
        lg:   'p-8',
        xl:   'p-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding }), className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export { Card, cardVariants };
