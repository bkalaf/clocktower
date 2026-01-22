// src/components/tokens/lleech/Reminder_lleech_dead.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/lleech.png?url';

const reminderMeta = {
    key: 'lleech_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderLleechDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderLleechDead(props: ReminderLleechDeadProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderLleechDead;
