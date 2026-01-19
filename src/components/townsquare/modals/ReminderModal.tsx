// src/components/townsquare/modals/ReminderModal.tsx
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReminderToken } from '@/components/grimoire/ReminderToken';
import { modalBackgroundStyle } from '@/components/modals/modalStyles';

type reminderOption = {
    key: string;
    label: string;
    icon: string;
    color?: string;
    description?: string;
};

const reminderOptions: reminderOption[] = [
    { key: 'night-watch', label: 'Night Watch', icon: '🌙', color: '#f97316' },
    { key: 'claim', label: 'Claim', icon: '🪧', color: '#fb7185' },
    { key: 'ghost', label: 'Ghost', icon: '👻', color: '#a855f7' },
    { key: 'poison', label: 'Poison', icon: '☠️', color: '#e11d48' },
    { key: 'favor', label: 'Favor', icon: '✨', color: '#facc15' },
    { key: 'silence', label: 'Silence', icon: '🤫', color: '#38bdf8' }
];

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function ReminderModal({ open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className='max-w-3xl rounded-3xl border border-white/20 bg-black/80'
                style={modalBackgroundStyle}
            >
                <DialogHeader>
                    <DialogTitle className='text-2xl text-white font-semibold'>Reminder Tokens</DialogTitle>
                    <DialogDescription className='text-sm text-slate-300'>
                        Drag & drop or pick a reminder token to highlight a seat.
                    </DialogDescription>
                </DialogHeader>
                <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                    {reminderOptions.map((reminder) => (
                        <div
                            key={reminder.key}
                            className='flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/40 p-4 text-center text-sm text-white'
                        >
                            <ReminderToken
                                reminder={reminder}
                                size={48}
                                className='text-[0.55rem]'
                            />
                            <span className='uppercase tracking-[0.3em]'>{reminder.label}</span>
                            {reminder.description && <p className='text-xs text-slate-400'>{reminder.description}</p>}
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
