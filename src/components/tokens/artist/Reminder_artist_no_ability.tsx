// src/components/tokens/artist/Reminder_artist_no_ability.tsx
import * as React from 'react';
import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/artist.png?url';

const reminderMeta = {
    key: 'artist_no_ability',
    label: 'No ability',
    backgroundImage: iconSrc
};

export type ReminderArtistNoAbilityProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderArtistNoAbility(props: ReminderArtistNoAbilityProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderArtistNoAbility;
