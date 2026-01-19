// src/components/tokens/shabaloth/Reminder_shabaloth_dead.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/shabaloth.png?url';

const reminderMeta = {
    key: 'shabaloth_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderShabalothDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderShabalothDead(props: ReminderShabalothDeadProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderShabalothDead;

