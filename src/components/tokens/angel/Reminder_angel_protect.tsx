// src/components/tokens/angel/Reminder_angel_protect.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/angel.png?url';

const reminderMeta = {
    key: 'angel_protect',
    label: 'Protect',
    backgroundImage: iconSrc
};

export type ReminderAngelProtectProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderAngelProtect(props: ReminderAngelProtectProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderAngelProtect;
