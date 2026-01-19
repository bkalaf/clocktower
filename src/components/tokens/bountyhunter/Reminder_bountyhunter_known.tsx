// src/components/tokens/bountyhunter/Reminder_bountyhunter_known.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/bountyhunter.png?url';

const reminderMeta = {
    key: 'bountyhunter_known',
    label: 'Known',
    backgroundImage: iconSrc
};

export type ReminderBountyhunterKnownProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderBountyhunterKnown(props: ReminderBountyhunterKnownProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderBountyhunterKnown;

