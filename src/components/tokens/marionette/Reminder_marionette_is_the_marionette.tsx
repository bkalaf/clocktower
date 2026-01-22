// src/components/tokens/marionette/Reminder_marionette_is_the_marionette.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/marionette.png?url';

const reminderMeta = {
    key: 'marionette_is_the_marionette',
    label: 'Is the Marionette',
    backgroundImage: iconSrc
};

export type ReminderMarionetteIsTheMarionetteProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderMarionetteIsTheMarionette(props: ReminderMarionetteIsTheMarionetteProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderMarionetteIsTheMarionette;
