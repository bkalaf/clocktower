// src/components/tokens/exorcist/Reminder_exorcist_chosen.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/exorcist.png?url';

const reminderMeta = {
    key: 'exorcist_chosen',
    label: 'Chosen',
    backgroundImage: iconSrc
};

export type ReminderExorcistChosenProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderExorcistChosen(props: ReminderExorcistChosenProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderExorcistChosen;
