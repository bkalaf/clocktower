// src/components/tokens/alchemist/Reminder_alchemist_is_the_alchemist.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/alchemist.png?url';

const reminderMeta = {
    key: 'alchemist_is_the_alchemist',
    label: 'Is the Alchemist',
    backgroundImage: iconSrc
};

export type ReminderAlchemistIsTheAlchemistProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderAlchemistIsTheAlchemist(props: ReminderAlchemistIsTheAlchemistProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderAlchemistIsTheAlchemist;
