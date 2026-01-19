// src/components/tokens/golem/Reminder_golem_can_not_nominate.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/golem.png?url';

const reminderMeta = {
    key: 'golem_can_not_nominate',
    label: 'Can not nominate',
    backgroundImage: iconSrc
};

export type ReminderGolemCanNotNominateProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderGolemCanNotNominate(props: ReminderGolemCanNotNominateProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderGolemCanNotNominate;

