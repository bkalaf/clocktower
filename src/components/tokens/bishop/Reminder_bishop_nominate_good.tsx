// src/components/tokens/bishop/Reminder_bishop_nominate_good.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/bishop.png?url';

const reminderMeta = {
    key: 'bishop_nominate_good',
    label: 'Nominate good',
    backgroundImage: iconSrc
};

export type ReminderBishopNominateGoodProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderBishopNominateGood(props: ReminderBishopNominateGoodProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderBishopNominateGood;
