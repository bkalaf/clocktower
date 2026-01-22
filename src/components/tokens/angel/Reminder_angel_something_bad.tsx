// src/components/tokens/angel/Reminder_angel_something_bad.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/angel.png?url';

const reminderMeta = {
    key: 'angel_something_bad',
    label: 'Something Bad',
    backgroundImage: iconSrc
};

export type ReminderAngelSomethingBadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderAngelSomethingBad(props: ReminderAngelSomethingBadProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderAngelSomethingBad;
