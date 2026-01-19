// src/components/tokens/seamstress/Reminder_seamstress_no_ability.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/seamstress.png?url';

const reminderMeta = {
    key: 'seamstress_no_ability',
    label: 'No ability',
    backgroundImage: iconSrc
};

export type ReminderSeamstressNoAbilityProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderSeamstressNoAbility(props: ReminderSeamstressNoAbilityProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderSeamstressNoAbility;

