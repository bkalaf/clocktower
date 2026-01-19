// src/components/tokens/widow/Reminder_widow_poisoned.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/widow.png?url';

const reminderMeta = {
    key: 'widow_poisoned',
    label: 'Poisoned',
    backgroundImage: iconSrc
};

export type ReminderWidowPoisonedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderWidowPoisoned(props: ReminderWidowPoisonedProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderWidowPoisoned;

