// src/components/tokens/bureaucrat/Reminder_bureaucrat_3_votes.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/bureaucrat.png?url';

const reminderMeta = {
    key: 'bureaucrat_3_votes',
    label: '3 votes',
    backgroundImage: iconSrc
};

export type ReminderBureaucrat3VotesProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderBureaucrat3Votes(props: ReminderBureaucrat3VotesProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderBureaucrat3Votes;
