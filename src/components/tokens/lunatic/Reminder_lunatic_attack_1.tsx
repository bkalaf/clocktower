// src/components/tokens/lunatic/Reminder_lunatic_attack_1.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/lunatic.png?url';

const reminderMeta = {
    key: 'lunatic_attack_1',
    label: 'Attack 1',
    backgroundImage: iconSrc
};

export type ReminderLunaticAttack1Props = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderLunaticAttack1(props: ReminderLunaticAttack1Props) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderLunaticAttack1;
