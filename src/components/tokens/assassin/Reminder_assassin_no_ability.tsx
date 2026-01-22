// src/components/tokens/assassin/Reminder_assassin_no_ability.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/assassin.png?url';

const reminderMeta = {
    key: 'assassin_no_ability',
    label: 'No ability',
    backgroundImage: iconSrc
};

export type ReminderAssassinNoAbilityProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderAssassinNoAbility(props: ReminderAssassinNoAbilityProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderAssassinNoAbility;
