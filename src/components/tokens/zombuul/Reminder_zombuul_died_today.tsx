// src/components/tokens/zombuul/Reminder_zombuul_died_today.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/zombuul.png?url';

const reminderMeta = {
    key: 'zombuul_died_today',
    label: 'Died today',
    backgroundImage: iconSrc
};

export type ReminderZombuulDiedTodayProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderZombuulDiedToday(props: ReminderZombuulDiedTodayProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderZombuulDiedToday;

