// src/components/tokens/puzzlemaster/Reminder_puzzlemaster_drunk.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/puzzlemaster.png?url';

const reminderMeta = {
    key: 'puzzlemaster_drunk',
    label: 'Drunk',
    backgroundImage: iconSrc
};

export type ReminderPuzzlemasterDrunkProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderPuzzlemasterDrunk(props: ReminderPuzzlemasterDrunkProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderPuzzlemasterDrunk;
