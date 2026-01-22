// src/components/tokens/po/Reminder_po_dead.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/po.png?url';

const reminderMeta = {
    key: 'po_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderPoDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderPoDead(props: ReminderPoDeadProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderPoDead;
