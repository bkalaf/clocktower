// src/components/tokens/pixie/Reminder_pixie_has_ability.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/pixie.png?url';

const reminderMeta = {
    key: 'pixie_has_ability',
    label: 'Has ability',
    backgroundImage: iconSrc
};

export type ReminderPixieHasAbilityProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderPixieHasAbility(props: ReminderPixieHasAbilityProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderPixieHasAbility;
