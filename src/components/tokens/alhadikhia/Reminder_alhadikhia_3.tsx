// src/components/tokens/alhadikhia/Reminder_alhadikhia_3.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/alhadikhia.png?url';

const reminderMeta = {
    key: 'alhadikhia_3',
    label: '3',
    backgroundImage: iconSrc
};

export type ReminderAlhadikhia3Props = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderAlhadikhia3(props: ReminderAlhadikhia3Props) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderAlhadikhia3;

