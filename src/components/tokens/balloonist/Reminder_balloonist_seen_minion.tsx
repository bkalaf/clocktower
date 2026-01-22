// src/components/tokens/balloonist/Reminder_balloonist_seen_minion.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/balloonist.png?url';

const reminderMeta = {
    key: 'balloonist_seen_minion',
    label: 'Seen Minion',
    backgroundImage: iconSrc
};

export type ReminderBalloonistSeenMinionProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderBalloonistSeenMinion(props: ReminderBalloonistSeenMinionProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderBalloonistSeenMinion;
