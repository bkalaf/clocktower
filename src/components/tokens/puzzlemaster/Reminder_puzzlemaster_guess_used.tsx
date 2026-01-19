// src/components/tokens/puzzlemaster/Reminder_puzzlemaster_guess_used.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/puzzlemaster.png?url';

const reminderMeta = {
    key: 'puzzlemaster_guess_used',
    label: 'Guess used',
    backgroundImage: iconSrc
};

export type ReminderPuzzlemasterGuessUsedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderPuzzlemasterGuessUsed(props: ReminderPuzzlemasterGuessUsedProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderPuzzlemasterGuessUsed;

