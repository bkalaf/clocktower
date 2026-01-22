// src/components/tokens/lilmonsta/Reminder_lilmonsta_is_the_demon.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/lilmonsta.png?url';

const reminderMeta = {
    key: 'lilmonsta_is_the_demon',
    label: 'Is the Demon',
    backgroundImage: iconSrc
};

export type ReminderLilmonstaIsTheDemonProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderLilmonstaIsTheDemon(props: ReminderLilmonstaIsTheDemonProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderLilmonstaIsTheDemon;
