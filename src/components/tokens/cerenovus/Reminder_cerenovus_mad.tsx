// src/components/tokens/cerenovus/Reminder_cerenovus_mad.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/cerenovus.png?url';

const reminderMeta = {
    key: 'cerenovus_mad',
    label: 'Mad',
    backgroundImage: iconSrc
};

export type ReminderCerenovusMadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderCerenovusMad(props: ReminderCerenovusMadProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderCerenovusMad;
