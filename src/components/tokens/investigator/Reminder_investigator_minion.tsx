// src/components/tokens/investigator/Reminder_investigator_minion.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/investigator.png?url';

const reminderMeta = {
    key: 'investigator_minion',
    label: 'Minion',
    backgroundImage: iconSrc
};

export type ReminderInvestigatorMinionProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderInvestigatorMinion(props: ReminderInvestigatorMinionProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderInvestigatorMinion;
