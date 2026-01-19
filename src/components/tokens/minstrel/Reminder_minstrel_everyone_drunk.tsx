// src/components/tokens/minstrel/Reminder_minstrel_everyone_drunk.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/minstrel.png?url';

const reminderMeta = {
    key: 'minstrel_everyone_drunk',
    label: 'Everyone drunk',
    backgroundImage: iconSrc
};

export type ReminderMinstrelEveryoneDrunkProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderMinstrelEveryoneDrunk(props: ReminderMinstrelEveryoneDrunkProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderMinstrelEveryoneDrunk;

