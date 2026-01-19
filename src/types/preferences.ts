export type UserPreferenceId = 'density' | 'panelTone' | 'accent';

export type PreferenceOption = {
    value: string;
    label: string;
    helper?: string;
};

export interface UserPreferenceDefinition {
    id: UserPreferenceId;
    label: string;
    description: string;
    options: PreferenceOption[];
}

export const USER_PREFERENCE_DEFINITIONS: UserPreferenceDefinition[] = [
    {
        id: 'density',
        label: 'Density',
        description: 'How tight the chrome feels between the bars and widgets.',
        options: [
            {
                value: 'compact',
                label: 'Compact',
                helper: 'Small spacing for dense dashboards.'
            },
            {
                value: 'balanced',
                label: 'Balanced',
                helper: 'Default spacing between UI elements.'
            },
            {
                value: 'airy',
                label: 'Airy',
                helper: 'More breathing room across cards and buttons.'
            }
        ]
    },
    {
        id: 'panelTone',
        label: 'Panel Tone',
        description: 'The treatment of surfaces and borders in the shell.',
        options: [
            {
                value: 'soft',
                label: 'Soft Glow',
                helper: 'Subtle transparency and rounded blur.'
            },
            {
                value: 'outline',
                label: 'Outlined',
                helper: 'Sharper edges with crisp borders.'
            },
            {
                value: 'flat',
                label: 'Matte',
                helper: 'Low-contrast matte panels.'
            }
        ]
    },
    {
        id: 'accent',
        label: 'Accent Hue',
        description: 'The highlight color applied to widgets and indicators.',
        options: [
            {
                value: 'ember',
                label: 'Ember',
                helper: 'Warm copper highlights.'
            },
            {
                value: 'glacier',
                label: 'Glacier',
                helper: 'Cool cyan illumination.'
            },
            {
                value: 'violet',
                label: 'Violet',
                helper: 'Mystic purple glow.'
            }
        ]
    }
];

export const DEFAULT_USER_PREFERENCES: Record<UserPreferenceId, string> = {
    density: 'compact',
    panelTone: 'soft',
    accent: 'ember'
};
