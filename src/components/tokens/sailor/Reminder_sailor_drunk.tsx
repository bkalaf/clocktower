// src/components/tokens/sailor/Reminder_sailor_drunk.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/sailor.png?url';

const reminderMeta = {
    key: 'sailor_drunk',
    label: 'Drunk',
    backgroundImage: iconSrc
};

export type ReminderSailorDrunkProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderSailorDrunk(props: ReminderSailorDrunkProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderSailorDrunk;

