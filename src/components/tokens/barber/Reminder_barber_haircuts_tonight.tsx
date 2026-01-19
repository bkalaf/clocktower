// src/components/tokens/barber/Reminder_barber_haircuts_tonight.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/barber.png?url';

const reminderMeta = {
    key: 'barber_haircuts_tonight',
    label: 'Haircuts tonight',
    backgroundImage: iconSrc
};

export type ReminderBarberHaircutsTonightProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderBarberHaircutsTonight(props: ReminderBarberHaircutsTonightProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderBarberHaircutsTonight;

