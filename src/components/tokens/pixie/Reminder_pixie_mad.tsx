// src/components/tokens/pixie/Reminder_pixie_mad.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/pixie.png?url';

const reminderMeta = {
    key: 'pixie_mad',
    label: 'Mad',
    backgroundImage: iconSrc
};

export type ReminderPixieMadProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderPixieMad(props: ReminderPixieMadProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderPixieMad;

