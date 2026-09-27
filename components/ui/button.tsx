import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-control font-semibold',
    'transition-[background-color,border-color,color,box-shadow,filter,transform] duration-200 ease-brand',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:translate-y-px',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: 'bg-accent text-canvas hover:shadow-cta hover:brightness-110',
        secondary:
          'border border-line-strong bg-surface text-ink hover:border-line-input hover:bg-surface-raised',
        ghost: 'text-ink-secondary hover:bg-surface-raised hover:text-ink',
        link: 'text-accent underline-offset-8 hover:underline',
      },
      size: {
        sm: 'h-9 px-4 text-small',
        default: 'h-11 px-5 text-[0.9375rem]',
        lg: 'h-[3.25rem] px-7 text-body',
        icon: 'h-11 w-11 p-0',
      },
    },
    compoundVariants: [{ variant: 'link', className: 'h-auto px-0' }],
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {loading && (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
