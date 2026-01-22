// src/components/tokens/balloonist/Reminder_balloonist_seen_demon.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/balloonist.png?url';

const reminderMeta = {
    key: 'balloonist_seen_demon',
    label: 'Seen Demon',
    backgroundImage: iconSrc
};

export type ReminderBalloonistSeenDemonProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderBalloonistSeenDemon(props: ReminderBalloonistSeenDemonProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderBalloonistSeenDemon;
