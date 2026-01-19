// src/components/tokens/librarian/Reminder_librarian_wrong.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/librarian.png?url';

const reminderMeta = {
    key: 'librarian_wrong',
    label: 'Wrong',
    backgroundImage: iconSrc
};

export type ReminderLibrarianWrongProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderLibrarianWrong(props: ReminderLibrarianWrongProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderLibrarianWrong;

