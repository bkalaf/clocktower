// src/components/townsquare/modals/ReferenceModal.tsx
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { modalBackgroundStyle } from '@/components/modals/modalStyles';
import { useTownSquare } from '@/state/TownSquareContext';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function ReferenceModal({ open, onOpenChange }: Props) {
    const { players } = useTownSquare();

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent
                className='max-w-3xl rounded-3xl border border-white/20 bg-black/80'
                style={modalBackgroundStyle}
            >
                <DialogHeader>
                    <DialogTitle className='text-2xl text-white font-semibold'>Reference Sheet</DialogTitle>
                    <DialogDescription className='text-sm text-slate-300'>
                        Quick character reference for players on the board.
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-3 sm:grid-cols-2'>
                    {players.map((player) => (
                        <div
                            key={player.id}
                            className='rounded-2xl border border-white/10 bg-slate-900/40 p-4 text-sm text-white/80'
                        >
                            <div className='text-xs uppercase tracking-[0.4em] text-slate-400'>{player.role.team}</div>
                            <p className='text-lg font-semibold uppercase tracking-[0.25em]'>{player.role.name}</p>
                            <p className='text-[0.7rem]'>{player.role.ability ?? 'Lore is hidden for this board.'}</p>
                        </div>
                    ))}
                </div>
                <DialogFooter className='mt-4 gap-2'>
                    <Button
                        variant='outline'
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
