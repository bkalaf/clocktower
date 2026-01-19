// src/components/tokens/sweetheart/Reminder_sweetheart_drunk.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/sweetheart.png?url';

const reminderMeta = {
    key: 'sweetheart_drunk',
    label: 'Drunk',
    backgroundImage: iconSrc
};

export type ReminderSweetheartDrunkProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderSweetheartDrunk(props: ReminderSweetheartDrunkProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderSweetheartDrunk;

