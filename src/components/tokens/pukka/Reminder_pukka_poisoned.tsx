// src/components/tokens/pukka/Reminder_pukka_poisoned.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/pukka.png?url';

const reminderMeta = {
    key: 'pukka_poisoned',
    label: 'Poisoned',
    backgroundImage: iconSrc
};

export type ReminderPukkaPoisonedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderPukkaPoisoned(props: ReminderPukkaPoisonedProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderPukkaPoisoned;

