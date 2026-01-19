// src/components/tokens/widow/Reminder_widow_knows.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/widow.png?url';

const reminderMeta = {
    key: 'widow_knows',
    label: 'Knows',
    backgroundImage: iconSrc
};

export type ReminderWidowKnowsProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderWidowKnows(props: ReminderWidowKnowsProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderWidowKnows;

