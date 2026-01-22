// src/components/tokens/philosopher/Reminder_philosopher_drunk.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/philosopher.png?url';

const reminderMeta = {
    key: 'philosopher_drunk',
    label: 'Drunk',
    backgroundImage: iconSrc
};

export type ReminderPhilosopherDrunkProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderPhilosopherDrunk(props: ReminderPhilosopherDrunkProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderPhilosopherDrunk;
