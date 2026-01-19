// src/components/tokens/washerwoman/Reminder_washerwoman_townsfolk.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/washerwoman.png?url';

const reminderMeta = {
    key: 'washerwoman_townsfolk',
    label: 'Townsfolk',
    backgroundImage: iconSrc
};

export type ReminderWasherwomanTownsfolkProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderWasherwomanTownsfolk(props: ReminderWasherwomanTownsfolkProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderWasherwomanTownsfolk;

