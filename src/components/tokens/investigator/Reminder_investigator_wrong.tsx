// src/components/tokens/investigator/Reminder_investigator_wrong.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/investigator.png?url';

const reminderMeta = {
    key: 'investigator_wrong',
    label: 'Wrong',
    backgroundImage: iconSrc
};

export type ReminderInvestigatorWrongProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderInvestigatorWrong(props: ReminderInvestigatorWrongProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderInvestigatorWrong;
