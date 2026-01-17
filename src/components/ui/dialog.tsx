import { useEffect, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

type DialogProps = {
    open: boolean;
    title: string;
    description?: string;
    onClose: () => void;
    children: ReactNode;
};

export function Dialog({ open, title, description, children, onClose }: DialogProps) {
    const titleId = useId();

    useEffect(() => {
        if (!open) return;
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    if (!open || typeof document === 'undefined') return null;

    return createPortal(
        <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
            <div
                className='fixed inset-0 bg-neutral-950/70 backdrop-blur-sm'
                onClick={onClose}
                aria-hidden='true'
            />
            <div
                role='dialog'
                aria-modal='true'
                aria-labelledby={titleId}
                className={cn(
                    'relative z-10 w-full max-w-md rounded-2xl bg-white text-slate-900 shadow-2xl transition'
                )}
                onClick={(event) => event.stopPropagation()}
            >
                <div className='flex items-center justify-between border-b border-slate-200 px-6 py-4'>
                    <div>
                        <h3
                            id={titleId}
                            className='text-lg font-semibold text-slate-900'
                        >
                            {title}
                        </h3>
                        {description && <p className='text-sm text-slate-500'>{description}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        aria-label='Close dialog'
                        className='rounded-full p-2 text-slate-500 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400'
                    >
                        <X size={16} />
                    </button>
                </div>
                <div className='px-6 py-6'>{children}</div>
            </div>
        </div>,
        document.body
    );
}
