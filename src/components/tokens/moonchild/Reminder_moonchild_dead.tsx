// src/components/tokens/moonchild/Reminder_moonchild_dead.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/moonchild.png?url';

const reminderMeta = {
    key: 'moonchild_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderMoonchildDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderMoonchildDead(props: ReminderMoonchildDeadProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderMoonchildDead;
