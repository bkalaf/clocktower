// src/components/townsquare/modals/EditionModal.tsx
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import editions from '@/assets/data/editions.json';
import { modalBackgroundStyle } from '@/components/modals/modalStyles';
import { useTownSquare } from '@/state/TownSquareContext';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditionModal({ open, onOpenChange }: Props) {
    const { actions } = useTownSquare();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className='max-w-3xl rounded-3xl border border-white/20 bg-black/80'
                style={modalBackgroundStyle}
            >
                <DialogHeader>
                    <DialogTitle className='text-2xl text-white font-semibold'>Select Edition</DialogTitle>
                    <DialogDescription className='text-sm text-slate-300'>
                        Pick a script edition so the Grimoire can surface the right characters.
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-3 sm:grid-cols-2'>
                    {editions.map((edition) => (
                        <div
                            key={edition.id}
                            className='flex flex-col rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-sm text-white/80'
                        >
                            <div className='text-xs uppercase tracking-[0.4em] text-slate-500'>{edition.level}</div>
                            <strong className='mt-2 text-lg uppercase tracking-[0.2em]'>{edition.name}</strong>
                            <p className='mt-2 text-[0.75rem] text-slate-300'>{edition.description}</p>
                            <Button
                                variant='ghost'
                                size='sm'
                                className='mt-3 w-full rounded-2xl border border-white/10 text-[0.7rem] uppercase tracking-[0.35em]'
                                onClick={() => actions.setSessionId(edition.id)}
                            >
                                Load Edition
                            </Button>
                        </div>
                    ))}
                </div>
                <DialogFooter className='mt-4 gap-2'>
                    <Button variant='outline' onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
