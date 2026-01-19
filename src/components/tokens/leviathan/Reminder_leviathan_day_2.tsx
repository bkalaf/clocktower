// src/components/tokens/leviathan/Reminder_leviathan_day_2.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/leviathan.png?url';

const reminderMeta = {
    key: 'leviathan_day_2',
    label: 'Day 2',
    backgroundImage: iconSrc
};

export type ReminderLeviathanDay2Props = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderLeviathanDay2(props: ReminderLeviathanDay2Props) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderLeviathanDay2;

