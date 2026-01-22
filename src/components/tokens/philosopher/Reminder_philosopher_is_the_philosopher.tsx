// src/components/tokens/philosopher/Reminder_philosopher_is_the_philosopher.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/philosopher.png?url';

const reminderMeta = {
    key: 'philosopher_is_the_philosopher',
    label: 'Is the Philosopher',
    backgroundImage: iconSrc
};

export type ReminderPhilosopherIsThePhilosopherProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderPhilosopherIsThePhilosopher(props: ReminderPhilosopherIsThePhilosopherProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderPhilosopherIsThePhilosopher;
