// src/components/tokens/courtier/Reminder_courtier_drunk_2.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/courtier.png?url';

const reminderMeta = {
    key: 'courtier_drunk_2',
    label: 'Drunk 2',
    backgroundImage: iconSrc
};

export type ReminderCourtierDrunk2Props = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderCourtierDrunk2(props: ReminderCourtierDrunk2Props) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderCourtierDrunk2;
