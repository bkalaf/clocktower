// src/components/tokens/goon/Reminder_goon_drunk.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/goon.png?url';

const reminderMeta = {
    key: 'goon_drunk',
    label: 'Drunk',
    backgroundImage: iconSrc
};

export type ReminderGoonDrunkProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderGoonDrunk(props: ReminderGoonDrunkProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderGoonDrunk;
