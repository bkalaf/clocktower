// src/components/tokens/gambler/Reminder_gambler_dead.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/gambler.png?url';

const reminderMeta = {
    key: 'gambler_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderGamblerDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderGamblerDead(props: ReminderGamblerDeadProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderGamblerDead;
