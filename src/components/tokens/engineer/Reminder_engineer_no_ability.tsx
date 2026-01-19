// src/components/tokens/engineer/Reminder_engineer_no_ability.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/engineer.png?url';

const reminderMeta = {
    key: 'engineer_no_ability',
    label: 'No ability',
    backgroundImage: iconSrc
};

export type ReminderEngineerNoAbilityProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderEngineerNoAbility(props: ReminderEngineerNoAbilityProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderEngineerNoAbility;

