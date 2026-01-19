// src/components/tokens/snakecharmer/Reminder_snakecharmer_poisoned.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/snakecharmer.png?url';

const reminderMeta = {
    key: 'snakecharmer_poisoned',
    label: 'Poisoned',
    backgroundImage: iconSrc
};

export type ReminderSnakecharmerPoisonedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderSnakecharmerPoisoned(props: ReminderSnakecharmerPoisonedProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderSnakecharmerPoisoned;

