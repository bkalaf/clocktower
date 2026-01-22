// src/components/tokens/bishop/Reminder_bishop_nominate_evil.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/bishop.png?url';

const reminderMeta = {
    key: 'bishop_nominate_evil',
    label: 'Nominate evil',
    backgroundImage: iconSrc
};

export type ReminderBishopNominateEvilProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderBishopNominateEvil(props: ReminderBishopNominateEvilProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderBishopNominateEvil;
