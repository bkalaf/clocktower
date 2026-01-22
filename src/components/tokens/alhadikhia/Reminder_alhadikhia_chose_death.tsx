// src/components/tokens/alhadikhia/Reminder_alhadikhia_chose_death.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/alhadikhia.png?url';

const reminderMeta = {
    key: 'alhadikhia_chose_death',
    label: 'Chose death',
    backgroundImage: iconSrc
};

export type ReminderAlhadikhiaChoseDeathProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderAlhadikhiaChoseDeath(props: ReminderAlhadikhiaChoseDeathProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderAlhadikhiaChoseDeath;
