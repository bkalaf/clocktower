// src/components/tokens/bonecollector/Reminder_bonecollector_no_ability.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/bonecollector.png?url';

const reminderMeta = {
    key: 'bonecollector_no_ability',
    label: 'No ability',
    backgroundImage: iconSrc
};

export type ReminderBonecollectorNoAbilityProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderBonecollectorNoAbility(props: ReminderBonecollectorNoAbilityProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderBonecollectorNoAbility;
