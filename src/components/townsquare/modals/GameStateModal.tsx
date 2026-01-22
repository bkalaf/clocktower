// src/components/townsquare/modals/GameStateModal.tsx

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

export function GameStateModal({ open, onOpenChange }: Props) {
    const { players, session, grimoire } = useTownSquare();

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
                    <DialogTitle className='text-2xl text-white font-semibold'>Game State</DialogTitle>
                    <DialogDescription className='text-sm text-slate-300'>
                        Snapshot of the current layout for debugging and API use.
                    </DialogDescription>
                </DialogHeader>
                <pre className='max-h-72 overflow-auto rounded-2xl border border-white/5 bg-black/50 p-3 text-[0.65rem] text-white/80'>
                    {JSON.stringify({ players, session, grimoire }, null, 2)}
                </pre>
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
