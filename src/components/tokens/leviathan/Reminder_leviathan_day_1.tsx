// src/components/tokens/leviathan/Reminder_leviathan_day_1.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/leviathan.png?url';

const reminderMeta = {
    key: 'leviathan_day_1',
    label: 'Day 1',
    backgroundImage: iconSrc
};

export type ReminderLeviathanDay1Props = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderLeviathanDay1(props: ReminderLeviathanDay1Props) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderLeviathanDay1;
