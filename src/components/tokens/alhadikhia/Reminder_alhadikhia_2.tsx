// src/components/tokens/alhadikhia/Reminder_alhadikhia_2.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/alhadikhia.png?url';

const reminderMeta = {
    key: 'alhadikhia_2',
    label: '2',
    backgroundImage: iconSrc
};

export type ReminderAlhadikhia2Props = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderAlhadikhia2(props: ReminderAlhadikhia2Props) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderAlhadikhia2;
