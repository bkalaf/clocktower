// src/components/tokens/mathematician/Reminder_mathematician_abnormal.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/mathematician.png?url';

const reminderMeta = {
    key: 'mathematician_abnormal',
    label: 'Abnormal',
    backgroundImage: iconSrc
};

export type ReminderMathematicianAbnormalProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderMathematicianAbnormal(props: ReminderMathematicianAbnormalProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderMathematicianAbnormal;
