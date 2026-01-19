// src/components/townsquare/modals/RolesModal.tsx
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { modalBackgroundStyle } from '@/components/modals/modalStyles';
import { useTownSquare } from '@/state/TownSquareContext';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function RolesModal({ open, onOpenChange }: Props) {
    const { players, actions } = useTownSquare();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className='max-w-3xl rounded-3xl border border-white/20 bg-black/80'
                style={modalBackgroundStyle}
            >
                <DialogHeader>
                    <DialogTitle className='text-2xl text-white font-semibold'>Assign Roles</DialogTitle>
                    <DialogDescription className='text-sm text-slate-300'>
                        Quick assignment helper for characters and players.
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-3'>
                    {players.map((player) => (
                        <div
                            key={player.id}
                            className='flex flex-col rounded-2xl border border-white/10 bg-slate-900/40 p-4 text-sm text-white/80'
                        >
                            <div className='text-[0.65rem] uppercase tracking-[0.3em] text-slate-400'>{player.name}</div>
                            <div className='flex items-center justify-between text-lg font-semibold uppercase tracking-[0.25em]'>
                                <span>{player.role.name}</span>
                                <Button
                                    variant='ghost'
                                    size='xs'
                                    className='text-[0.6rem] uppercase tracking-[0.4em]'
                                    onClick={() => actions.updatePlayer(players.indexOf(player), { role: player.role })}
                                >
                                    Keep Role
                                </Button>
                            </div>
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
