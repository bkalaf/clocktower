// src/components/tokens/legion/Reminder_legion_about_to_die.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/legion.png?url';

const reminderMeta = {
    key: 'legion_about_to_die',
    label: 'About to die',
    backgroundImage: iconSrc
};

export type ReminderLegionAboutToDieProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderLegionAboutToDie(props: ReminderLegionAboutToDieProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderLegionAboutToDie;
