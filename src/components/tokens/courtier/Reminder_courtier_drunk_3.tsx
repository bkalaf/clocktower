// src/components/tokens/courtier/Reminder_courtier_drunk_3.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/courtier.png?url';

const reminderMeta = {
    key: 'courtier_drunk_3',
    label: 'Drunk 3',
    backgroundImage: iconSrc
};

export type ReminderCourtierDrunk3Props = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderCourtierDrunk3(props: ReminderCourtierDrunk3Props) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderCourtierDrunk3;
