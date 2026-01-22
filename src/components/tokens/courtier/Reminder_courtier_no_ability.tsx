// src/components/tokens/courtier/Reminder_courtier_no_ability.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/courtier.png?url';

const reminderMeta = {
    key: 'courtier_no_ability',
    label: 'No ability',
    backgroundImage: iconSrc
};

export type ReminderCourtierNoAbilityProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderCourtierNoAbility(props: ReminderCourtierNoAbilityProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderCourtierNoAbility;
