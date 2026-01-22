// src/components/tokens/duchess/Reminder_duchess_false_info.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/duchess.png?url';

const reminderMeta = {
    key: 'duchess_false_info',
    label: 'False Info',
    backgroundImage: iconSrc
};

export type ReminderDuchessFalseInfoProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderDuchessFalseInfo(props: ReminderDuchessFalseInfoProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderDuchessFalseInfo;
