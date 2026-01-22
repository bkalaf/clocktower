// src/components/tokens/innkeeper/Reminder_innkeeper_protected.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/innkeeper.png?url';

const reminderMeta = {
    key: 'innkeeper_protected',
    label: 'Protected',
    backgroundImage: iconSrc
};

export type ReminderInnkeeperProtectedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderInnkeeperProtected(props: ReminderInnkeeperProtectedProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderInnkeeperProtected;
