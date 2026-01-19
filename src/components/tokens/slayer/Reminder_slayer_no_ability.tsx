// src/components/tokens/slayer/Reminder_slayer_no_ability.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/slayer.png?url';

const reminderMeta = {
    key: 'slayer_no_ability',
    label: 'No ability',
    backgroundImage: iconSrc
};

export type ReminderSlayerNoAbilityProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderSlayerNoAbility(props: ReminderSlayerNoAbilityProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderSlayerNoAbility;

