// src/components/tokens/spiritofivory/Reminder_spiritofivory_no_extra_evil.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/spiritofivory.png?url';

const reminderMeta = {
    key: 'spiritofivory_no_extra_evil',
    label: 'No extra evil',
    backgroundImage: iconSrc
};

export type ReminderSpiritofivoryNoExtraEvilProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderSpiritofivoryNoExtraEvil(props: ReminderSpiritofivoryNoExtraEvilProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderSpiritofivoryNoExtraEvil;
