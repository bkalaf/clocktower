// src/components/tokens/monk/Reminder_monk_protected.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/monk.png?url';

const reminderMeta = {
    key: 'monk_protected',
    label: 'Protected',
    backgroundImage: iconSrc
};

export type ReminderMonkProtectedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderMonkProtected(props: ReminderMonkProtectedProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderMonkProtected;
