// src/components/tokens/judge/Reminder_judge_no_ability.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/judge.png?url';

const reminderMeta = {
    key: 'judge_no_ability',
    label: 'No ability',
    backgroundImage: iconSrc
};

export type ReminderJudgeNoAbilityProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderJudgeNoAbility(props: ReminderJudgeNoAbilityProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderJudgeNoAbility;
