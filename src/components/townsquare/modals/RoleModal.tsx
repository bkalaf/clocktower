// src/components/townsquare/modals/RoleModal.tsx
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

export function RoleModal({ open, onOpenChange }: Props) {
    const { players } = useTownSquare();
    const player = players[0];

    if (!player) return null;

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
                    <DialogTitle className='text-2xl text-white font-semibold'>Role Details</DialogTitle>
                    <DialogDescription className='text-sm text-slate-300'>
                        Role insights for the currently selected seat.
                    </DialogDescription>
                </DialogHeader>
                <div className='rounded-2xl border border-white/10 bg-slate-900/40 p-4 text-sm text-white/80'>
                    <p className='text-[0.65rem] uppercase tracking-[0.3em] text-slate-400'>{player.role.team}</p>
                    <p className='text-xl font-semibold uppercase tracking-[0.25em]'>{player.role.name}</p>
                    <p className='mt-2 text-[0.75rem]'>{player.role.ability ?? 'No ability information available.'}</p>
                    <div className='mt-3 grid grid-cols-2 gap-2 text-[0.7rem] uppercase tracking-[0.35em] text-white/70'>
                        <span>First Night: {player.role.firstNight ?? '—'}</span>
                        <span>Other Night: {player.role.otherNight ?? '—'}</span>
                    </div>
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
