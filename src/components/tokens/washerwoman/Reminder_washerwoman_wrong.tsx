// src/components/tokens/washerwoman/Reminder_washerwoman_wrong.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/washerwoman.png?url';

const reminderMeta = {
    key: 'washerwoman_wrong',
    label: 'Wrong',
    backgroundImage: iconSrc
};

export type ReminderWasherwomanWrongProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderWasherwomanWrong(props: ReminderWasherwomanWrongProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderWasherwomanWrong;
