// src/components/tokens/lycanthrope/Reminder_lycanthrope_dead.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/lycanthrope.png?url';

const reminderMeta = {
    key: 'lycanthrope_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderLycanthropeDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderLycanthropeDead(props: ReminderLycanthropeDeadProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderLycanthropeDead;
