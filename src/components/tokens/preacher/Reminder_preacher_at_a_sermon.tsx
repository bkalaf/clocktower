// src/components/tokens/preacher/Reminder_preacher_at_a_sermon.tsx

import { ReminderToken, type ReminderTokenProps } from '@/components/grimoire/ReminderToken';
import iconSrc from '@/assets/icons/preacher.png?url';

const reminderMeta = {
    key: 'preacher_at_a_sermon',
    label: 'At a sermon',
    backgroundImage: iconSrc
};

export type ReminderPreacherAtASermonProps = Omit<ReminderTokenProps, 'reminder'>;

export function ReminderPreacherAtASermon(props: ReminderPreacherAtASermonProps) {
    return (
        <ReminderToken
            reminder={reminderMeta}
            {...props}
        />
    );
}

export default ReminderPreacherAtASermon;
