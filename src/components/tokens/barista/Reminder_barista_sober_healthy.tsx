// src/components/tokens/barista/Reminder_barista_sober_healthy.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/barista.png?url';

const reminderMeta = {
    key: 'barista_sober_healthy',
    label: 'Sober & Healthy',
    backgroundImage: iconSrc
};

export type ReminderBaristaSoberHealthyProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderBaristaSoberHealthy(props: ReminderBaristaSoberHealthyProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderBaristaSoberHealthy;
