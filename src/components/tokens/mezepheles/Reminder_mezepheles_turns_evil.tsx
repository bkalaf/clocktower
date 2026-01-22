// src/components/tokens/mezepheles/Reminder_mezepheles_turns_evil.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/mezepheles.png?url';

const reminderMeta = {
    key: 'mezepheles_turns_evil',
    label: 'Turns evil',
    backgroundImage: iconSrc
};

export type ReminderMezephelesTurnsEvilProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderMezephelesTurnsEvil(props: ReminderMezephelesTurnsEvilProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderMezephelesTurnsEvil;
