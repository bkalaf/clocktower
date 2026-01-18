// src/components/grimoire/modals/ReminderPickerDialog.tsx
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
import { ReminderToken, type ReminderTokenMeta } from '../ReminderToken';
import * as React from 'react';

export type ReminderPickerDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reminders: ReminderTokenMeta[];
};

export function ReminderPickerDialog({ open, onOpenChange, reminders }: ReminderPickerDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className='max-w-3xl bg-black/70 border border-white/10'>
                <DialogHeader>
                    <DialogTitle className='text-2xl text-white font-semibold'>Reminder Tokens</DialogTitle>
                    <DialogDescription className='text-sm text-slate-300'>
                        Drag a reminder icon from the Grimoire to the seat that needs it. The tokens stay clipped to the
                        player circle so you always know who is marked.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className='mb-4 max-h-96 rounded-xl border border-white/10 bg-black/50 p-4'>
                    <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                        {reminders.map((reminder) => (
                            <div
                                key={reminder.key}
                                className='flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/40 p-3 text-center'
                            >
                                <ReminderToken
                                    reminder={reminder}
                                    draggableId={`reminder-${reminder.key}`}
                                    size={40}
                                />
                                <p className='text-xs uppercase tracking-[0.3em] text-white/70'>{reminder.label}</p>
                                {reminder.description && (
                                    <p className='text-[0.65rem] text-slate-300'>{reminder.description}</p>
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
