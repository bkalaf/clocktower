// src/components/tokens/balloonist/Reminder_balloonist_seen_traveller.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/balloonist.png?url';

const reminderMeta = {
    key: 'balloonist_seen_traveller',
    label: 'Seen Traveller',
    backgroundImage: iconSrc
};

export type ReminderBalloonistSeenTravellerProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderBalloonistSeenTraveller(props: ReminderBalloonistSeenTravellerProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderBalloonistSeenTraveller;

