// src/components/tokens/virgin/Reminder_virgin_no_ability.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/virgin.png?url';

const reminderMeta = {
    key: 'virgin_no_ability',
    label: 'No ability',
    backgroundImage: iconSrc
};

export type ReminderVirginNoAbilityProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderVirginNoAbility(props: ReminderVirginNoAbilityProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderVirginNoAbility;
