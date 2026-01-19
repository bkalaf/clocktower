// src/components/tokens/leviathan/Reminder_leviathan_day_5.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/leviathan.png?url';

const reminderMeta = {
    key: 'leviathan_day_5',
    label: 'Day 5',
    backgroundImage: iconSrc
};

export type ReminderLeviathanDay5Props = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderLeviathanDay5(props: ReminderLeviathanDay5Props) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderLeviathanDay5;

