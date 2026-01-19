// src/components/tokens/toymaker/Reminder_toymaker_final_night_no_attack.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/toymaker.png?url';

const reminderMeta = {
    key: 'toymaker_final_night_no_attack',
    label: 'Final Night: No Attack',
    backgroundImage: iconSrc
};

export type ReminderToymakerFinalNightNoAttackProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderToymakerFinalNightNoAttack(props: ReminderToymakerFinalNightNoAttackProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderToymakerFinalNightNoAttack;

