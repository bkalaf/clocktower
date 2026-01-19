// src/components/tokens/balloonist/Reminder_balloonist_seen_townsfolk.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/balloonist.png?url';

const reminderMeta = {
    key: 'balloonist_seen_townsfolk',
    label: 'Seen Townsfolk',
    backgroundImage: iconSrc
};

export type ReminderBalloonistSeenTownsfolkProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderBalloonistSeenTownsfolk(props: ReminderBalloonistSeenTownsfolkProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderBalloonistSeenTownsfolk;

