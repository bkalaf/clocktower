// src/components/townsquare/modals/FabledModal.tsx
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import fabled from '@/assets/data/fabled.json';
import { modalBackgroundStyle } from '@/components/modals/modalStyles';
import { useTownSquare } from '@/state/TownSquareContext';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function FabledModal({ open, onOpenChange }: Props) {
    const { actions } = useTownSquare();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className='max-w-3xl rounded-3xl border border-white/20 bg-black/80'
                style={modalBackgroundStyle}
            >
                <DialogHeader>
                    <DialogTitle className='text-2xl text-white font-semibold'>Fabled Characters</DialogTitle>
                    <DialogDescription className='text-sm text-slate-300'>
                        Add fabled characters for special story beats.
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-3 sm:grid-cols-2'>
                    {fabled.map((character) => (
                        <div
                            key={character.id}
                            className='flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-sm text-white/80'
                        >
                            <strong className='text-lg uppercase tracking-[0.2em]'>{character.name}</strong>
                            <p className='text-[0.75rem]'>{character.ability}</p>
                            <Button
                                variant='ghost'
                                size='sm'
                                className='mt-2 rounded-2xl border border-white/10 text-[0.7rem] uppercase tracking-[0.35em]'
                                onClick={() => actions.addPlayer(character.name)}
                            >
                                Add Fabled
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
