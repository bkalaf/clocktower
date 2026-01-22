// src/components/tokens/mezepheles/Reminder_mezepheles_no_ability.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/mezepheles.png?url';

const reminderMeta = {
    key: 'mezepheles_no_ability',
    label: 'No ability',
    backgroundImage: iconSrc
};

export type ReminderMezephelesNoAbilityProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderMezephelesNoAbility(props: ReminderMezephelesNoAbilityProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderMezephelesNoAbility;
