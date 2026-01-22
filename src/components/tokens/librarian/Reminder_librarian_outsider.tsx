// src/components/tokens/librarian/Reminder_librarian_outsider.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/librarian.png?url';

const reminderMeta = {
    key: 'librarian_outsider',
    label: 'Outsider',
    backgroundImage: iconSrc
};

export type ReminderLibrarianOutsiderProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderLibrarianOutsider(props: ReminderLibrarianOutsiderProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderLibrarianOutsider;
