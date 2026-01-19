// src/components/tokens/duchess/Reminder_duchess_visitor.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/duchess.png?url';

const reminderMeta = {
    key: 'duchess_visitor',
    label: 'Visitor',
    backgroundImage: iconSrc
};

export type ReminderDuchessVisitorProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderDuchessVisitor(props: ReminderDuchessVisitorProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderDuchessVisitor;

