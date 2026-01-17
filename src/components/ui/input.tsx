import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
    'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 transition-colors',
    {
        variants: {
            intent: {
                default: '',
                subtle: 'border-transparent bg-slate-50 text-slate-700'
            }
        },
        defaultVariants: {
            intent: 'default'
        }
    }
);

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, intent, ...props }, ref) => {
        return <input ref={ref} className={cn(inputVariants({ intent }), className)} {...props} />;
    }
);

Input.displayName = 'Input';
