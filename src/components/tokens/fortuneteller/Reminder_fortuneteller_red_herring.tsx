// src/components/tokens/fortuneteller/Reminder_fortuneteller_red_herring.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/fortuneteller.png?url';

const reminderMeta = {
    key: 'fortuneteller_red_herring',
    label: 'Red herring',
    backgroundImage: iconSrc
};

export type ReminderFortunetellerRedHerringProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderFortunetellerRedHerring(props: ReminderFortunetellerRedHerringProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderFortunetellerRedHerring;

