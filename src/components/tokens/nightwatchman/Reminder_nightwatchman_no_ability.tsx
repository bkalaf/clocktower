// src/components/tokens/nightwatchman/Reminder_nightwatchman_no_ability.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/nightwatchman.png?url';

const reminderMeta = {
    key: 'nightwatchman_no_ability',
    label: 'No ability',
    backgroundImage: iconSrc
};

export type ReminderNightwatchmanNoAbilityProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderNightwatchmanNoAbility(props: ReminderNightwatchmanNoAbilityProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderNightwatchmanNoAbility;
