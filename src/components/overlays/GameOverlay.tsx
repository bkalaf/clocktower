// src/components/overlays/GameOverlay.tsx
import * as React from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { DialogClose, DialogTrigger } from '@radix-ui/react-dialog';
import { Button } from '../ui/button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { closeDialog, selectRequest } from '../../store/ui/ui-slice';
import { dialogConfigs } from './dialogs/dialogConfigs';
import { useMemo } from 'react';

export function GameOverlay() {
    const dispatch = useAppDispatch();
    const request = useAppSelector(selectRequest);
    const open = Boolean(request);
    const dialogType = request?.options.dialogType;
    const dialogConfig = dialogType ? dialogConfigs[dialogType] : null;
    const resolver = useAppSelector(selectRequest)?.resolve;

    const resolve = useMemo(() => resolver ?? (async () => {}), [resolver]);

    const handleConfirm = React.useCallback(
        (value: any) => {
            console.log(`handleConfirm`);
            dispatch(closeDialog());
            resolve({ confirmed: true, value });
        },
        [dispatch, resolve]
    );
    const handleCancel = () => {
        dispatch(closeDialog());
        resolve?.({ confirmed: false, value: undefined });
    };
    const onSubmit = React.useCallback(
        (ev: React.FormEvent) => {
            ev.preventDefault();
            console.log(`onSubmit`, ev);
            const formdata = new FormData(ev.currentTarget as HTMLFormElement);
            const data = Object.fromEntries(formdata.entries());
            console.log(data);
            handleConfirm(data);
        },
        [handleConfirm]
    );
    return (
        <Dialog
            open={open}
            onOpenChange={handleCancel}
        >
            <DialogTrigger />
            <DialogContent
                showCloseButton={true}
                className={cn('border-none bg-slate-950/90 p-0 text-white shadow-2xl sm:max-w-[680px]')}
            >
                <form onSubmit={onSubmit}>
                    <div className='relative overflow-hidden rounded-lg'>
                        {/* {imageSrc ?
                            <img
                                src={imageSrc}
                                alt={imageAlt ?? title}
                                className='absolute inset-0 h-full w-full object-cover opacity-60'
                                draggable={false}
                            />
                        :   null} */}
                        <div className='absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/80 to-slate-950' />
                        <div className={cn('relative z-10 flex flex-col gap-6 px-8 py-10')}>
                            <DialogHeader className='text-center'>
                                <DialogTitle className='text-3xl font-black uppercase tracking-wide text-white drop-shadow'>
                                    {dialogConfig?.title}
                                </DialogTitle>
                                <DialogDescription className='text-base text-slate-200'>
                                    {dialogConfig?.description}
                                </DialogDescription>
                            </DialogHeader>
                            {dialogConfig && request ?
                                <dialogConfig.Content data={request.data as any} />
                            :   null}
                            <DialogFooter>
                                <DialogClose onClick={handleCancel}>Cancel</DialogClose>
                                <Button type='submit'>Submit</Button>
                            </DialogFooter>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
