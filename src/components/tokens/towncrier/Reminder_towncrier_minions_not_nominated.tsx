// src/components/tokens/towncrier/Reminder_towncrier_minions_not_nominated.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/towncrier.png?url';

const reminderMeta = {
    key: 'towncrier_minions_not_nominated',
    label: 'Minions not nominated',
    backgroundImage: iconSrc
};

export type ReminderTowncrierMinionsNotNominatedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderTowncrierMinionsNotNominated(props: ReminderTowncrierMinionsNotNominatedProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderTowncrierMinionsNotNominated;

