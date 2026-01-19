// src/components/tokens/cannibal/Reminder_cannibal_died_today.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/cannibal.png?url';

const reminderMeta = {
    key: 'cannibal_died_today',
    label: 'Died today',
    backgroundImage: iconSrc
};

export type ReminderCannibalDiedTodayProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderCannibalDiedToday(props: ReminderCannibalDiedTodayProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderCannibalDiedToday;

