// src/components/tokens/gossip/Reminder_gossip_dead.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/gossip.png?url';

const reminderMeta = {
    key: 'gossip_dead',
    label: 'Dead',
    backgroundImage: iconSrc
};

export type ReminderGossipDeadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderGossipDead(props: ReminderGossipDeadProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderGossipDead;

