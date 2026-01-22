// src/components/tokens/legion/Reminder_legion_dead.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/legion.png?url';

const reminderMeta = {
    key: 'legion_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderLegionDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderLegionDead(props: ReminderLegionDeadProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderLegionDead;
