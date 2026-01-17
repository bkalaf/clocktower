import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-safe:transition-transform motion-safe:active:scale-95',
    {
        variants: {
            variant: {
                default: 'bg-slate-900 text-white hover:bg-slate-800 border border-transparent',
                ghost: 'bg-transparent text-slate-900 hover:bg-slate-100 border border-transparent',
                outline:
                    'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 shadow-sm shadow-slate-900/5',
                destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-500/30',
                subtle: 'border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100'
            },
            size: {
                default: 'h-10 px-4',
                sm: 'h-9 px-3 text-sm',
                lg: 'h-11 px-6 text-base'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(buttonVariants({ variant, size }), className)}
            {...props}
        />
    );
});

Button.displayName = 'Button';

export { buttonVariants };
