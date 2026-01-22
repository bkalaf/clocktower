// src/components/tokens/damsel/Reminder_damsel_guess_used.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/damsel.png?url';

const reminderMeta = {
    key: 'damsel_guess_used',
    label: 'Guess used',
    backgroundImage: iconSrc
};

export type ReminderDamselGuessUsedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderDamselGuessUsed(props: ReminderDamselGuessUsedProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderDamselGuessUsed;
