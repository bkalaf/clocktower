// src/components/tokens/stormcatcher/Reminder_stormcatcher_safe.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/stormcatcher.png?url';

const reminderMeta = {
    key: 'stormcatcher_safe',
    label: 'Safe',
    backgroundImage: iconSrc
};

export type ReminderStormcatcherSafeProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderStormcatcherSafe(props: ReminderStormcatcherSafeProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderStormcatcherSafe;
