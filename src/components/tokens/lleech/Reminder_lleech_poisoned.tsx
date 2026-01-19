// src/components/tokens/lleech/Reminder_lleech_poisoned.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/lleech.png?url';

const reminderMeta = {
    key: 'lleech_poisoned',
    label: 'Poisoned',
    backgroundImage: iconSrc
};

export type ReminderLleechPoisonedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderLleechPoisoned(props: ReminderLleechPoisonedProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderLleechPoisoned;

