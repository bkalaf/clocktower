// src/components/tokens/professor/Reminder_professor_alive.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/professor.png?url';

const reminderMeta = {
    key: 'professor_alive',
    label: 'Alive',
    backgroundImage: iconSrc
};

export type ReminderProfessorAliveProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderProfessorAlive(props: ReminderProfessorAliveProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderProfessorAlive;
