// src/components/tokens/apprentice/Reminder_apprentice_is_the_apprentice.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/apprentice.png?url';

const reminderMeta = {
    key: 'apprentice_is_the_apprentice',
    label: 'Is the Apprentice',
    backgroundImage: iconSrc
};

export type ReminderApprenticeIsTheApprenticeProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderApprenticeIsTheApprentice(props: ReminderApprenticeIsTheApprenticeProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderApprenticeIsTheApprentice;
