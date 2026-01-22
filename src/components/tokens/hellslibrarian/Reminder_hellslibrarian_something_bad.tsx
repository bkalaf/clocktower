// src/components/tokens/hellslibrarian/Reminder_hellslibrarian_something_bad.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/hellslibrarian.png?url';

const reminderMeta = {
    key: 'hellslibrarian_something_bad',
    label: 'Something Bad',
    backgroundImage: iconSrc
};

export type ReminderHellslibrarianSomethingBadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderHellslibrarianSomethingBad(props: ReminderHellslibrarianSomethingBadProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderHellslibrarianSomethingBad;
