// src/components/tokens/cannibal/Reminder_cannibal_poisoned.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/cannibal.png?url';

const reminderMeta = {
    key: 'cannibal_poisoned',
    label: 'Poisoned',
    backgroundImage: iconSrc
};

export type ReminderCannibalPoisonedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderCannibalPoisoned(props: ReminderCannibalPoisonedProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderCannibalPoisoned;
