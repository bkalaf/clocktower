// src/components/tokens/devilsadvocate/Reminder_devilsadvocate_survives_execution.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/devilsadvocate.png?url';

const reminderMeta = {
    key: 'devilsadvocate_survives_execution',
    label: 'Survives execution',
    backgroundImage: iconSrc
};

export type ReminderDevilsadvocateSurvivesExecutionProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderDevilsadvocateSurvivesExecution(props: ReminderDevilsadvocateSurvivesExecutionProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderDevilsadvocateSurvivesExecution;
