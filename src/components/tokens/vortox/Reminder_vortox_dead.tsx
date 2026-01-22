// src/components/tokens/vortox/Reminder_vortox_dead.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/vortox.png?url';

const reminderMeta = {
    key: 'vortox_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderVortoxDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderVortoxDead(props: ReminderVortoxDeadProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderVortoxDead;
