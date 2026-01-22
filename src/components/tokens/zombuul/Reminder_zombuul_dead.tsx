// src/components/tokens/zombuul/Reminder_zombuul_dead.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/zombuul.png?url';

const reminderMeta = {
    key: 'zombuul_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderZombuulDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderZombuulDead(props: ReminderZombuulDeadProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderZombuulDead;
