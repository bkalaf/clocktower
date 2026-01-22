// src/components/tokens/tinker/Reminder_tinker_dead.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/tinker.png?url';

const reminderMeta = {
    key: 'tinker_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderTinkerDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderTinkerDead(props: ReminderTinkerDeadProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderTinkerDead;
