// src/components/tokens/acrobat/Reminder_acrobat_dead.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/acrobat.png?url';

const reminderMeta = {
    key: 'acrobat_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderAcrobatDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderAcrobatDead(props: ReminderAcrobatDeadProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderAcrobatDead;
