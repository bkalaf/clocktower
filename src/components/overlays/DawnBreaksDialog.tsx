// src/components/overlays/DawnBreaksDialog.tsx
import dawnBreaksImg from '@/assets/images/dawn-breaks.jpeg';
import { cn } from '../../lib/utils';
import {
    DialogHeader,
    DialogFooter,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger
} from '../ui/dialog';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectDayBreakDialog, selectRequest, toggleDayBreakDialog } from '../../store/ui/ui-slice';
import { useCallback, useMemo } from 'react';
import { runTasks } from '../../store/st-queue/st-queue-slice';

export function DawnBreaksDialog() {
    const open = useAppSelector(selectDayBreakDialog);
    const dispatch = useAppDispatch();
    const resolver = useAppSelector(selectRequest)?.resolve;

    const resolve = useMemo(() => resolver ?? (async () => {}), [resolver]);

    const onOpenChange = useCallback(async () => {
        dispatch(toggleDayBreakDialog(false));
        dispatch(runTasks());
        await resolve({ confirmed: true, value: undefined });
    }, [dispatch, resolve]);

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogTrigger />
            <DialogContent
                showCloseButton={false}
                className={cn('border-none bg-slate-950/90 p-0 text-white shadow-2xl sm:max-w-[680px]', '')}
            >
                <div className='relative overflow-hidden rounded-lg'>
                    <div className='absolute inset-0 bg-linear-to-b from-slate-950/70 via-slate-950/80 to-slate-950' />
                    <div className={cn('relative z-10 flex flex-col gap-6 px-8 py-10')}>
                        <DialogHeader className='text-center'>
                            <DialogTitle className='text-3xl font-black uppercase tracking-wide text-white drop-shadow'>
                                Dawn Breaks
                            </DialogTitle>
                            <DialogDescription className='text-base text-slate-200'>
                                Open your eyes. Day dawns.
                            </DialogDescription>
                        </DialogHeader>
                        <img
                            src={dawnBreaksImg}
                            alt='Night falls'
                            className='absolute inset-0 h-full w-full object-cover opacity-60'
                            draggable={false}
                        />
                        <DialogFooter>
                            <DialogClose onClick={onOpenChange}>Cancel</DialogClose>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
