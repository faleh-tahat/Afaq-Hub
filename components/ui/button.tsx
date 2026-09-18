import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold',
    'transition-all duration-200 ease-smooth',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950',
    'disabled:pointer-events-none disabled:opacity-40',
    'select-none',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-accent text-brand-950 shadow-glow-sm',
          'hover:brightness-110 hover:shadow-glow',
          'active:scale-[0.97] active:brightness-100',
        ].join(' '),
        secondary: [
          'border border-white/12 bg-brand-900 text-brand-100',
          'hover:bg-brand-800 hover:border-white/20 hover:text-white',
          'active:scale-[0.97]',
        ].join(' '),
        ghost: [
          'text-brand-300',
          'hover:text-white hover:bg-white/5',
          'active:scale-[0.97]',
        ].join(' '),
        outline: [
          'border border-accent/30 text-accent bg-transparent',
          'hover:border-accent/60 hover:bg-accent/5',
          'active:scale-[0.97]',
        ].join(' '),
        danger: [
          'bg-red-500/90 text-white border border-red-400/20',
          'hover:bg-red-500 hover:border-red-400/40',
          'active:scale-[0.97]',
        ].join(' '),
      },
      size: {
        xs:      'h-8  px-3 text-xs',
        sm:      'h-9  px-4 text-sm',
        default: 'h-11 px-5 text-sm',
        lg:      'h-13 px-7 text-base',
        xl:      'h-14 px-8 text-base',
        icon:    'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            {children}
          </>
        ) : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
