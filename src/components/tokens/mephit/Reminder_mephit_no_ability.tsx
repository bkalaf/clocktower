// src/components/tokens/mephit/Reminder_mephit_no_ability.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/mephit.png?url';

const reminderMeta = {
    key: 'mephit_no_ability',
    label: 'No ability',
    backgroundImage: iconSrc
};

export type ReminderMephitNoAbilityProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderMephitNoAbility(props: ReminderMephitNoAbilityProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderMephitNoAbility;
