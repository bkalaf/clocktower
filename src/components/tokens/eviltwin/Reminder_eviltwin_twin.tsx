// src/components/tokens/eviltwin/Reminder_eviltwin_twin.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/eviltwin.png?url';

const reminderMeta = {
    key: 'eviltwin_twin',
    label: 'Twin',
    backgroundImage: iconSrc
};

export type ReminderEviltwinTwinProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderEviltwinTwin(props: ReminderEviltwinTwinProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderEviltwinTwin;
