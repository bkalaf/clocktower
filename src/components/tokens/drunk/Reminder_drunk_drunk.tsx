// src/components/tokens/drunk/Reminder_drunk_drunk.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/drunk.png?url';

const reminderMeta = {
    key: 'drunk_drunk',
    label: 'Drunk',
    backgroundImage: iconSrc
};

export type ReminderDrunkDrunkProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderDrunkDrunk(props: ReminderDrunkDrunkProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderDrunkDrunk;
