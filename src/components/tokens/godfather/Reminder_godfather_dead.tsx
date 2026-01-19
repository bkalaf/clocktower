// src/components/tokens/godfather/Reminder_godfather_dead.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/godfather.png?url';

const reminderMeta = {
    key: 'godfather_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderGodfatherDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderGodfatherDead(props: ReminderGodfatherDeadProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderGodfatherDead;

