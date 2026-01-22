// src/components/tokens/harlot/Reminder_harlot_dead.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/harlot.png?url';

const reminderMeta = {
    key: 'harlot_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderHarlotDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderHarlotDead(props: ReminderHarlotDeadProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderHarlotDead;
