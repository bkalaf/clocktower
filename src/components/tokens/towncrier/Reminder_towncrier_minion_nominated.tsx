// src/components/tokens/towncrier/Reminder_towncrier_minion_nominated.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/towncrier.png?url';

const reminderMeta = {
    key: 'towncrier_minion_nominated',
    label: 'Minion nominated',
    backgroundImage: iconSrc
};

export type ReminderTowncrierMinionNominatedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderTowncrierMinionNominated(props: ReminderTowncrierMinionNominatedProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderTowncrierMinionNominated;
