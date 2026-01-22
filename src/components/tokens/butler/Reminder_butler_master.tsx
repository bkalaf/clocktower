// src/components/tokens/butler/Reminder_butler_master.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/butler.png?url';

const reminderMeta = {
    key: 'butler_master',
    label: 'Master',
    backgroundImage: iconSrc
};

export type ReminderButlerMasterProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderButlerMaster(props: ReminderButlerMasterProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderButlerMaster;
