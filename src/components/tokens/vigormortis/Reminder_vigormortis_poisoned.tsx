// src/components/tokens/vigormortis/Reminder_vigormortis_poisoned.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/vigormortis.png?url';

const reminderMeta = {
    key: 'vigormortis_poisoned',
    label: 'Poisoned',
    backgroundImage: iconSrc
};

export type ReminderVigormortisPoisonedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderVigormortisPoisoned(props: ReminderVigormortisPoisonedProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderVigormortisPoisoned;
