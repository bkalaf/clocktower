// src/components/tokens/professor/Reminder_professor_no_ability.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/professor.png?url';

const reminderMeta = {
    key: 'professor_no_ability',
    label: 'No ability',
    backgroundImage: iconSrc
};

export type ReminderProfessorNoAbilityProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderProfessorNoAbility(props: ReminderProfessorNoAbilityProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderProfessorNoAbility;
