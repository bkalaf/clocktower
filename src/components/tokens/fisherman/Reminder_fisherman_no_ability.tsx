// src/components/tokens/fisherman/Reminder_fisherman_no_ability.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/fisherman.png?url';

const reminderMeta = {
    key: 'fisherman_no_ability',
    label: 'No ability',
    backgroundImage: iconSrc
};

export type ReminderFishermanNoAbilityProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderFishermanNoAbility(props: ReminderFishermanNoAbilityProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderFishermanNoAbility;

