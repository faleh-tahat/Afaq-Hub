import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva('rounded-card border', {
  variants: {
    variant: {
      default: 'border-line bg-surface',
      raised: 'border-line-strong bg-surface-raised shadow-elev-1',
      // Only for cards that are themselves interactive.
      interactive:
        'border-line bg-surface transition-[border-color,background-color,transform] duration-200 ease-brand hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-raised',
    },
    padding: {
      none: '',
      sm: 'p-5',
      md: 'p-6',
      default: 'p-6 sm:p-7',
      lg: 'p-7 sm:p-9',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'default',
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardVariants({ variant, padding }), className)} {...props} />
    );
  }
);

Card.displayName = 'Card';

export { Card, cardVariants };
