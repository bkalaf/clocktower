// src/components/tokens/bonecollector/Reminder_bonecollector_has_ability.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/bonecollector.png?url';

const reminderMeta = {
    key: 'bonecollector_has_ability',
    label: 'Has ability',
    backgroundImage: iconSrc
};

export type ReminderBonecollectorHasAbilityProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderBonecollectorHasAbility(props: ReminderBonecollectorHasAbilityProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderBonecollectorHasAbility;

