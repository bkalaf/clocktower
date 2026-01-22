// src/components/tokens/flowergirl/Reminder_flowergirl_demon_voted.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/flowergirl.png?url';

const reminderMeta = {
    key: 'flowergirl_demon_voted',
    label: 'Demon voted',
    backgroundImage: iconSrc
};

export type ReminderFlowergirlDemonVotedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderFlowergirlDemonVoted(props: ReminderFlowergirlDemonVotedProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderFlowergirlDemonVoted;
