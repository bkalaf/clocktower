// src/components/tokens/balloonist/Reminder_balloonist_seen_outsider.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/balloonist.png?url';

const reminderMeta = {
    key: 'balloonist_seen_outsider',
    label: 'Seen Outsider',
    backgroundImage: iconSrc
};

export type ReminderBalloonistSeenOutsiderProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderBalloonistSeenOutsider(props: ReminderBalloonistSeenOutsiderProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderBalloonistSeenOutsider;

