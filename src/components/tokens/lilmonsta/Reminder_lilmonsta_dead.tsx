// src/components/tokens/lilmonsta/Reminder_lilmonsta_dead.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/lilmonsta.png?url';

const reminderMeta = {
    key: 'lilmonsta_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderLilmonstaDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderLilmonstaDead(props: ReminderLilmonstaDeadProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderLilmonstaDead;

