// src/components/tokens/grandmother/Reminder_grandmother_grandchild.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/grandmother.png?url';

const reminderMeta = {
    key: 'grandmother_grandchild',
    label: 'Grandchild',
    backgroundImage: iconSrc
};

export type ReminderGrandmotherGrandchildProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderGrandmotherGrandchild(props: ReminderGrandmotherGrandchildProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderGrandmotherGrandchild;

