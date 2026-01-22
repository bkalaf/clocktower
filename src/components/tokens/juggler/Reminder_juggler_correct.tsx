// src/components/tokens/juggler/Reminder_juggler_correct.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/juggler.png?url';

const reminderMeta = {
    key: 'juggler_correct',
    label: 'Correct',
    backgroundImage: iconSrc
};

export type ReminderJugglerCorrectProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderJugglerCorrect(props: ReminderJugglerCorrectProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderJugglerCorrect;
