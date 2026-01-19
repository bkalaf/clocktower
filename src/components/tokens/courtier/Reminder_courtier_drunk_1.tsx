// src/components/tokens/courtier/Reminder_courtier_drunk_1.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/courtier.png?url';

const reminderMeta = {
    key: 'courtier_drunk_1',
    label: 'Drunk 1',
    backgroundImage: iconSrc
};

export type ReminderCourtierDrunk1Props = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderCourtierDrunk1(props: ReminderCourtierDrunk1Props) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderCourtierDrunk1;

