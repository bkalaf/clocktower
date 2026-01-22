// src/components/tokens/tealady/Reminder_tealady_can_not_die.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/tealady.png?url';

const reminderMeta = {
    key: 'tealady_can_not_die',
    label: 'Can not die',
    backgroundImage: iconSrc
};

export type ReminderTealadyCanNotDieProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderTealadyCanNotDie(props: ReminderTealadyCanNotDieProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderTealadyCanNotDie;
