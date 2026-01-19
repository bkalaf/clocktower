// src/components/tokens/shabaloth/Reminder_shabaloth_alive.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/shabaloth.png?url';

const reminderMeta = {
    key: 'shabaloth_alive',
    label: 'Alive',
    backgroundImage: iconSrc
};

export type ReminderShabalothAliveProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderShabalothAlive(props: ReminderShabalothAliveProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderShabalothAlive;

