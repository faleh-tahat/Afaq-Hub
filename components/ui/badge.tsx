import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// No uppercase or letter-spacing: most badge text is Arabic, and tracking
// breaks its connected letters.
const badgeVariants = cva('inline-flex items-center gap-1.5 rounded-full border font-medium', {
  variants: {
    variant: {
      default: 'border-line-strong bg-surface-raised text-ink-secondary',
      accent: 'border-accent/25 bg-accent/10 text-accent',
      success: 'border-success/25 bg-success/10 text-success',
      muted: 'border-line bg-surface text-ink-muted',
    },
    size: {
      sm: 'px-2.5 py-0.5 text-caption',
      default: 'px-3 py-1 text-caption',
      lg: 'px-3.5 py-1.5 text-small',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, children, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props}>
        {dot && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
