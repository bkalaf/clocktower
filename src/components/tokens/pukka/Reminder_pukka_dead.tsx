// src/components/tokens/pukka/Reminder_pukka_dead.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/pukka.png?url';

const reminderMeta = {
    key: 'pukka_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderPukkaDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderPukkaDead(props: ReminderPukkaDeadProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderPukkaDead;
