// src/components/tokens/huntsman/Reminder_huntsman_no_ability.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/huntsman.png?url';

const reminderMeta = {
    key: 'huntsman_no_ability',
    label: 'No ability',
    backgroundImage: iconSrc
};

export type ReminderHuntsmanNoAbilityProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderHuntsmanNoAbility(props: ReminderHuntsmanNoAbilityProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderHuntsmanNoAbility;
