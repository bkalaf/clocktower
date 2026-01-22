// src/components/tokens/revolutionary/Reminder_revolutionary_used.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/revolutionary.png?url';

const reminderMeta = {
    key: 'revolutionary_used',
    label: 'Used',
    backgroundImage: iconSrc
};

export type ReminderRevolutionaryUsedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderRevolutionaryUsed(props: ReminderRevolutionaryUsedProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderRevolutionaryUsed;
