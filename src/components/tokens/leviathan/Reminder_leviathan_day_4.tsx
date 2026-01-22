// src/components/tokens/leviathan/Reminder_leviathan_day_4.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/leviathan.png?url';

const reminderMeta = {
    key: 'leviathan_day_4',
    label: 'Day 4',
    backgroundImage: iconSrc
};

export type ReminderLeviathanDay4Props = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderLeviathanDay4(props: ReminderLeviathanDay4Props) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderLeviathanDay4;
