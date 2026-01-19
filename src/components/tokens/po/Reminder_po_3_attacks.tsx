// src/components/tokens/po/Reminder_po_3_attacks.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/po.png?url';

const reminderMeta = {
    key: 'po_3_attacks',
    label: '3 attacks',
    backgroundImage: iconSrc
};

export type ReminderPo3AttacksProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderPo3Attacks(props: ReminderPo3AttacksProps) {
    return <ReminderToken reminder={reminderMeta} {...props} />;
}

export default ReminderPo3Attacks;

