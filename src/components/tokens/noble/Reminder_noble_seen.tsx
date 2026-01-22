// src/components/tokens/noble/Reminder_noble_seen.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/noble.png?url';

const reminderMeta = {
    key: 'noble_seen',
    label: 'Seen',
    backgroundImage: iconSrc
};

export type ReminderNobleSeenProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderNobleSeen(props: ReminderNobleSeenProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderNobleSeen;
