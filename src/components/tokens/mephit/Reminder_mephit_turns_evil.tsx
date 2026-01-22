// src/components/tokens/mephit/Reminder_mephit_turns_evil.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/mephit.png?url';

const reminderMeta = {
    key: 'mephit_turns_evil',
    label: 'Turns evil',
    backgroundImage: iconSrc
};

export type ReminderMephitTurnsEvilProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderMephitTurnsEvil(props: ReminderMephitTurnsEvilProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderMephitTurnsEvil;
