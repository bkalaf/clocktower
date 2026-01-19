// src/components/tokens/nodashii/Reminder_nodashii_dead.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/nodashii.png?url';

const reminderMeta = {
    key: 'nodashii_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderNodashiiDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderNodashiiDead(props: ReminderNodashiiDeadProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderNodashiiDead;

