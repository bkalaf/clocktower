// src/components/tokens/alhadikhia/Reminder_alhadikhia_chose_life.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/alhadikhia.png?url';

const reminderMeta = {
    key: 'alhadikhia_chose_life',
    label: 'Chose life',
    backgroundImage: iconSrc
};

export type ReminderAlhadikhiaChoseLifeProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderAlhadikhiaChoseLife(props: ReminderAlhadikhiaChoseLifeProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderAlhadikhiaChoseLife;

