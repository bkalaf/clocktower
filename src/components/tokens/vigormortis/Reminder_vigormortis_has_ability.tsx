// src/components/tokens/vigormortis/Reminder_vigormortis_has_ability.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/vigormortis.png?url';

const reminderMeta = {
    key: 'vigormortis_has_ability',
    label: 'Has ability',
    backgroundImage: iconSrc
};

export type ReminderVigormortisHasAbilityProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderVigormortisHasAbility(props: ReminderVigormortisHasAbilityProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderVigormortisHasAbility;

