// src/components/tokens/fibbin/Reminder_fibbin_used.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/fibbin.png?url';

const reminderMeta = {
    key: 'fibbin_used',
    label: 'Used',
    backgroundImage: iconSrc
};

export type ReminderFibbinUsedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderFibbinUsed(props: ReminderFibbinUsedProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderFibbinUsed;
