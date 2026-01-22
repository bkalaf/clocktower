// src/components/townsquare/modals/VoteHistoryModal.tsx

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

export function VoteHistoryModal({ open, onOpenChange }: Props) {
    const { session } = useTownSquare();

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
                    <DialogTitle className='text-2xl text-white font-semibold'>Vote History</DialogTitle>
                    <DialogDescription className='text-sm text-slate-300'>
                        Timeline of completed executions or exiles.
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-3'>
                    {session.voteHistory.length === 0 && (
                        <p className='text-sm text-white/60'>No history recorded yet.</p>
                    )}
                    {session.voteHistory.map((entry, index) => (
                        <div
                            key={`${entry.timestamp}-${index}`}
                            className='rounded-2xl border border-white/10 bg-slate-900/40 p-3 text-sm text-white/80'
                        >
                            <div className='flex items-center justify-between text-[0.65rem] text-slate-400'>
                                <span>{new Date(entry.timestamp).toLocaleString()}</span>
                                <span>{entry.type.toUpperCase()}</span>
                            </div>
                            <p className='text-[0.85rem] font-semibold uppercase tracking-[0.2em]'>
                                {entry.nominator} → {entry.nominee}
                            </p>
                            <p className='text-[0.65rem] text-slate-400'>Majority: {entry.majority}</p>
                            <p className='text-[0.7rem] text-white/70'>Votes: {entry.votes.join(', ') || '—'}</p>
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
