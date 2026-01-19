// src/components/tokens/lunatic/Reminder_lunatic_attack_3.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/lunatic.png?url';

const reminderMeta = {
    key: 'lunatic_attack_3',
    label: 'Attack 3',
    backgroundImage: iconSrc
};

export type ReminderLunaticAttack3Props = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderLunaticAttack3(props: ReminderLunaticAttack3Props) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderLunaticAttack3;

