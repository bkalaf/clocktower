// src/components/tokens/poppygrower/Reminder_poppygrower_evil_wakes.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/poppygrower.png?url';

const reminderMeta = {
    key: 'poppygrower_evil_wakes',
    label: 'Evil wakes',
    backgroundImage: iconSrc
};

export type ReminderPoppygrowerEvilWakesProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderPoppygrowerEvilWakes(props: ReminderPoppygrowerEvilWakesProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderPoppygrowerEvilWakes;

