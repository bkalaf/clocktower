// src/components/tokens/leviathan/Reminder_leviathan_good_player_executed.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/leviathan.png?url';

const reminderMeta = {
    key: 'leviathan_good_player_executed',
    label: 'Good player executed',
    backgroundImage: iconSrc
};

export type ReminderLeviathanGoodPlayerExecutedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderLeviathanGoodPlayerExecuted(props: ReminderLeviathanGoodPlayerExecutedProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderLeviathanGoodPlayerExecuted;
