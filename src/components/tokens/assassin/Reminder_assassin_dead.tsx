// src/components/tokens/assassin/Reminder_assassin_dead.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/assassin.png?url';

const reminderMeta = {
    key: 'assassin_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderAssassinDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderAssassinDead(props: ReminderAssassinDeadProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderAssassinDead;

