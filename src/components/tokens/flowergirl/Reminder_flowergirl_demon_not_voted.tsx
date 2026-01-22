// src/components/tokens/flowergirl/Reminder_flowergirl_demon_not_voted.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/flowergirl.png?url';

const reminderMeta = {
    key: 'flowergirl_demon_not_voted',
    label: 'Demon not voted',
    backgroundImage: iconSrc
};

export type ReminderFlowergirlDemonNotVotedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderFlowergirlDemonNotVoted(props: ReminderFlowergirlDemonNotVotedProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderFlowergirlDemonNotVoted;
