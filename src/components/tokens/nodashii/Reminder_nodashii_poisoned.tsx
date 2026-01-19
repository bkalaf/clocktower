// src/components/tokens/nodashii/Reminder_nodashii_poisoned.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/nodashii.png?url';

const reminderMeta = {
    key: 'nodashii_poisoned',
    label: 'Poisoned',
    backgroundImage: iconSrc
};

export type ReminderNodashiiPoisonedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderNodashiiPoisoned(props: ReminderNodashiiPoisonedProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderNodashiiPoisoned;

