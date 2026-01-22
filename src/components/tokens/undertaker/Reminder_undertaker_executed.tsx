// src/components/tokens/undertaker/Reminder_undertaker_executed.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/undertaker.png?url';

const reminderMeta = {
    key: 'undertaker_executed',
    label: 'Executed',
    backgroundImage: iconSrc
};

export type ReminderUndertakerExecutedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderUndertakerExecuted(props: ReminderUndertakerExecutedProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderUndertakerExecuted;
