// src/components/tokens/godfather/Reminder_godfather_died_today.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/godfather.png?url';

const reminderMeta = {
    key: 'godfather_died_today',
    label: 'Died today',
    backgroundImage: iconSrc
};

export type ReminderGodfatherDiedTodayProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderGodfatherDiedToday(props: ReminderGodfatherDiedTodayProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderGodfatherDiedToday;
