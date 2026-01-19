// src/components/tokens/goblin/Reminder_goblin_claimed.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/goblin.png?url';

const reminderMeta = {
    key: 'goblin_claimed',
    label: 'Claimed',
    backgroundImage: iconSrc
};

export type ReminderGoblinClaimedProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderGoblinClaimed(props: ReminderGoblinClaimedProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderGoblinClaimed;

