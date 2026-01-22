// src/components/townsquare/modals/NightOrderModal.tsx

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

export function NightOrderModal({ open, onOpenChange }: Props) {
    const { players, nightOrder } = useTownSquare();

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
                    <DialogTitle className='text-2xl text-white font-semibold'>Night Order</DialogTitle>
                    <DialogDescription className='text-sm text-slate-300'>
                        Show who wakes when during the night draft.
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-3'>
                    {players.map((player, index) => {
                        const order = nightOrder.get(index);
                        if (!order) return null;
                        return (
                            <div
                                key={player.id}
                                className='flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-2 text-[0.75rem]'
                            >
                                <span className='font-medium uppercase tracking-[0.3em]'>{player.name}</span>
                                <span className='flex gap-2 text-xs uppercase tracking-[0.4em] text-white/70'>
                                    <span>First: {order.first}</span>
                                    <span>Other: {order.other}</span>
                                </span>
                            </div>
                        );
                    })}
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
