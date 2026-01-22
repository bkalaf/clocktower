// src/components/tokens/witch/Reminder_witch_cursed.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/witch.png?url';

const reminderMeta = {
    key: 'witch_cursed',
    label: 'Cursed',
    backgroundImage: iconSrc
};

export type ReminderWitchCursedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderWitchCursed(props: ReminderWitchCursedProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderWitchCursed;
