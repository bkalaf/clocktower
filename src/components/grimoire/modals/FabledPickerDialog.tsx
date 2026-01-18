// src/components/grimoire/modals/FabledPickerDialog.tsx
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

export type FabledOption = {
    id: string;
    name: string;
    description: string;
    tokenImg?: string;
};

export type FabledPickerDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    options: FabledOption[];
    onSelectFabled?: (id: string) => void;
};

export function FabledPickerDialog({ open, onOpenChange, options, onSelectFabled }: FabledPickerDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className='max-w-4xl bg-black/70 border border-white/10'>
                <DialogHeader>
                    <DialogTitle className='text-2xl text-white font-semibold'>Fabled Tokens</DialogTitle>
                    <DialogDescription className='text-sm text-slate-300'>
                        Choose a fabled role to drop into the Grimoire table for quick reference.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className='mb-4 max-h-96 rounded-xl border border-white/10 bg-black/50 p-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                        {options.map((option) => (
                            <div
                                key={option.id}
                                className='flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/40 p-4 text-center'
                            >
                                <Token
                                    name={option.name}
                                    image={option.tokenImg}
                                    size={120}
                                />
                                <p className='text-xs uppercase tracking-[0.3em] text-white/80'>{option.description}</p>
                                {onSelectFabled && (
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() => onSelectFabled(option.id)}
                                    >
                                        Use Fabled Token
                                    </Button>
                                )}
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
