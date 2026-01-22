// src/components/tokens/imp/Reminder_imp_dead.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/imp.png?url';

const reminderMeta = {
    key: 'imp_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderImpDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderImpDead(props: ReminderImpDeadProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderImpDead;
