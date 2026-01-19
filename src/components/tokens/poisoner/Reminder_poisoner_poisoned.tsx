// src/components/tokens/poisoner/Reminder_poisoner_poisoned.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/poisoner.png?url';

const reminderMeta = {
    key: 'poisoner_poisoned',
    label: 'Poisoned',
    backgroundImage: iconSrc
};

export type ReminderPoisonerPoisonedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderPoisonerPoisoned(props: ReminderPoisonerPoisonedProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderPoisonerPoisoned;

