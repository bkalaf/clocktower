// src/components/tokens/lunatic/Reminder_lunatic_attack_2.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/lunatic.png?url';

const reminderMeta = {
    key: 'lunatic_attack_2',
    label: 'Attack 2',
    backgroundImage: iconSrc
};

export type ReminderLunaticAttack2Props = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderLunaticAttack2(props: ReminderLunaticAttack2Props) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderLunaticAttack2;
