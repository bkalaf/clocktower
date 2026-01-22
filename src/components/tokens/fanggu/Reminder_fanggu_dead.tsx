// src/components/tokens/fanggu/Reminder_fanggu_dead.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/fanggu.png?url';

const reminderMeta = {
    key: 'fanggu_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderFangguDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderFangguDead(props: ReminderFangguDeadProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderFangguDead;
