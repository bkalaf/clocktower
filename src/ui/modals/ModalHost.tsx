// src/ui/modals/ModalHost.tsx
import * as React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { ModalKind, NightCardType } from '../../router/search';
import { Invites } from './Invites';
import { Preferences } from './Preferences';
import { modalBackgroundStyle } from '@/components/modals/modalStyles';

type Props = {
    modal?: ModalKind;
    type?: NightCardType;
};

export function ModalHost({ modal, type }: Props) {
    const navigate = useNavigate();

    const close = React.useCallback(() => {
        navigate({
            search: (prev: Record<string, unknown>) => {
                const next = { ...(prev ?? {}) };
                delete next.modal;
                delete next.type;
                return next;
            },
            replace: true
        });
    }, [navigate]);

    if (!modal) return null;

    return (
        <Dialog
            open
            onOpenChange={(isOpen) => !isOpen && close()}
        >
            <DialogContent
                className='w-full max-w-3xl space-y-6 rounded-3xl border border-white/20 bg-black/70 shadow-[0_25px_70px_rgba(0,0,0,0.65)] backdrop-blur-xl'
                style={modalBackgroundStyle}
            >
                {modal === 'invites' && <Invites onClose={close} />}
                {modal === 'preferences' && <Preferences onClose={close} />}
                {modal === 'reveal' && (
                    <section className='space-y-4'>
                        <DialogHeader className='flex items-center justify-between gap-4'>
                            <DialogTitle className='text-white'>Reveal</DialogTitle>
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={close}
                            >
                                Close
                            </Button>
                        </DialogHeader>
                        <DialogDescription className='text-sm text-slate-400'>TODO: Reveal content</DialogDescription>
                    </section>
                )}
                {modal === 'nightCards' && (
                    <section className='space-y-4'>
                        <DialogHeader className='flex items-center justify-between gap-4'>
                            <DialogTitle className='text-white'>Night Cards</DialogTitle>
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={close}
                            >
                                Close
                            </Button>
                        </DialogHeader>
                        <DialogDescription className='text-sm text-slate-400'>
                            TODO: {type ? `type=${type}` : 'choose a card type'}
                        </DialogDescription>
                    </section>
                )}
            </DialogContent>
        </Dialog>
    );
}
