// src/components/tokens/leviathan/Reminder_leviathan_day_3.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/leviathan.png?url';

const reminderMeta = {
    key: 'leviathan_day_3',
    label: 'Day 3',
    backgroundImage: iconSrc
};

export type ReminderLeviathanDay3Props = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderLeviathanDay3(props: ReminderLeviathanDay3Props) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderLeviathanDay3;
