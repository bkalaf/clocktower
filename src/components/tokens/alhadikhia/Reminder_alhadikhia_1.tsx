// src/components/tokens/alhadikhia/Reminder_alhadikhia_1.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/alhadikhia.png?url';

const reminderMeta = {
    key: 'alhadikhia_1',
    label: '1',
    backgroundImage: iconSrc
};

export type ReminderAlhadikhia1Props = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderAlhadikhia1(props: ReminderAlhadikhia1Props) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderAlhadikhia1;

