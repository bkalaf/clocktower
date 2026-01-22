// src/components/tokens/thief/Reminder_thief_negative_vote.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/thief.png?url';

const reminderMeta = {
    key: 'thief_negative_vote',
    label: 'Negative vote',
    backgroundImage: iconSrc
};

export type ReminderThiefNegativeVoteProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderThiefNegativeVote(props: ReminderThiefNegativeVoteProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderThiefNegativeVote;
