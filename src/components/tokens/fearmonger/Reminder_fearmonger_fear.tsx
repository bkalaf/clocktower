// src/components/tokens/fearmonger/Reminder_fearmonger_fear.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/fearmonger.png?url';

const reminderMeta = {
    key: 'fearmonger_fear',
    label: 'Fear',
    backgroundImage: iconSrc
};

export type ReminderFearmongerFearProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderFearmongerFear(props: ReminderFearmongerFearProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderFearmongerFear;

