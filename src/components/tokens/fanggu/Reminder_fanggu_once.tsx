// src/components/tokens/fanggu/Reminder_fanggu_once.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/fanggu.png?url';

const reminderMeta = {
    key: 'fanggu_once',
    label: 'Once',
    backgroundImage: iconSrc
};

export type ReminderFangguOnceProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderFangguOnce(props: ReminderFangguOnceProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderFangguOnce;
