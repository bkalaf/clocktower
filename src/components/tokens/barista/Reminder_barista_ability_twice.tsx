// src/components/tokens/barista/Reminder_barista_ability_twice.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/barista.png?url';

const reminderMeta = {
    key: 'barista_ability_twice',
    label: 'Ability twice',
    backgroundImage: iconSrc
};

export type ReminderBaristaAbilityTwiceProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderBaristaAbilityTwice(props: ReminderBaristaAbilityTwiceProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderBaristaAbilityTwice;
