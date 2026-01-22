// src/components/tokens/fool/Reminder_fool_no_ability.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/fool.png?url';

const reminderMeta = {
    key: 'fool_no_ability',
    label: 'No ability',
    backgroundImage: iconSrc
};

export type ReminderFoolNoAbilityProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderFoolNoAbility(props: ReminderFoolNoAbilityProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderFoolNoAbility;
