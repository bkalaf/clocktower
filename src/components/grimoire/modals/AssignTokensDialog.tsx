// src/components/grimoire/modals/AssignTokensDialog.tsx
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Token } from '../Token';
import * as React from 'react';
import { modalBackgroundStyle } from '@/components/modals/modalStyles';

export type AssignTokensDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    seats: Array<{
        seatId: number;
        name: string;
        tokenImg: string;
        reminders: string[];
    }>;
};

export function AssignTokensDialog({ open, onOpenChange, seats }: AssignTokensDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent
                className='max-w-4xl rounded-3xl border border-white/10 bg-black/80 shadow-[0_30px_60px_rgba(0,0,0,0.65)]'
                style={modalBackgroundStyle}
            >
                <DialogHeader>
                    <DialogTitle className='text-2xl text-white font-semibold'>Assign Tokens</DialogTitle>
                    <DialogDescription className='text-sm text-slate-300'>
                        Drop tokens onto the matching players or click to shuffle the board.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className='mb-4 max-h-96 rounded-xl border border-white/10 bg-black/50 p-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
                        {seats.map((seat) => (
                            <div
                                key={seat.seatId}
                                className='flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/40 p-4'
                            >
                                <div className='flex items-center justify-between text-sm uppercase tracking-[0.3em] text-white/70'>
                                    <span>{seat.name}</span>
                                    <span>{`#${seat.seatId + 1}`}</span>
                                </div>
                                <Token
                                    name={seat.name}
                                    image={seat.tokenImg}
                                    size={110}
                                />
                                <div className='flex flex-wrap gap-2 text-[0.65rem] text-slate-300'>
                                    {seat.reminders.length === 0 && <span>No Reminders</span>}
                                    {seat.reminders.map((token) => (
                                        <span
                                            key={`${seat.seatId}-${token}`}
                                            className='rounded-full border border-white/20 px-2 py-0.5'
                                        >
                                            {token}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <DialogFooter className='gap-2'>
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
