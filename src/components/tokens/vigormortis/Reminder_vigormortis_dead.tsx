// src/components/tokens/vigormortis/Reminder_vigormortis_dead.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/vigormortis.png?url';

const reminderMeta = {
    key: 'vigormortis_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderVigormortisDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderVigormortisDead(props: ReminderVigormortisDeadProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderVigormortisDead;
