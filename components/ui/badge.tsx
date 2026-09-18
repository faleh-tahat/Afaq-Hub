import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-semibold transition-colors duration-200',
  {
    variants: {
      variant: {
        default:  'bg-white/8  text-brand-200 border border-white/10',
        accent:   'bg-accent/12 text-accent   border border-accent/20',
        success:  'bg-emerald-500/12 text-emerald-300 border border-emerald-500/20',
        warning:  'bg-amber-500/12 text-amber-300 border border-amber-500/20',
        danger:   'bg-red-500/12 text-red-300 border border-red-500/20',
        info:     'bg-blue-500/12 text-blue-300 border border-blue-500/20',
        muted:    'bg-brand-800/60 text-brand-400 border border-white/6',
      },
      size: {
        sm:      'px-2 py-0.5 text-2xs tracking-widest-2',
        default: 'px-3 py-1   text-xs  tracking-widest-2',
        lg:      'px-4 py-1.5 text-xs  tracking-widest-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), 'uppercase', className)}
        {...props}
      >
        {dot && (
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80 animate-pulse-dot" />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
