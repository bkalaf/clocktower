// src/components/tokens/scarletwoman/Reminder_scarletwoman_demon.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/scarletwoman.png?url';

const reminderMeta = {
    key: 'scarletwoman_demon',
    label: 'Demon',
    backgroundImage: iconSrc
};

export type ReminderScarletwomanDemonProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderScarletwomanDemon(props: ReminderScarletwomanDemonProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderScarletwomanDemon;
