// src/components/tokens/innkeeper/Reminder_innkeeper_drunk.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/innkeeper.png?url';

const reminderMeta = {
    key: 'innkeeper_drunk',
    label: 'Drunk',
    backgroundImage: iconSrc
};

export type ReminderInnkeeperDrunkProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderInnkeeperDrunk(props: ReminderInnkeeperDrunkProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderInnkeeperDrunk;
