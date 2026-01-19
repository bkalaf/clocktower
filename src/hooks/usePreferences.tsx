// src/hooks/usePreferences.tsx
import { createContext, useContext } from 'react';

import type { UserPreferenceId } from '../types/preferences';

export const STORAGE_KEY = 'clocktower/user-preferences';

export type PreferenceValues = Record<UserPreferenceId, string>;

type PreferencesContextValue = {
    values: PreferenceValues;
    setPreference: (id: UserPreferenceId, value: string) => void;
};

export const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

export function usePreferences() {
    const context = useContext(PreferencesContext);
    if (!context) {
        throw new Error('usePreferences must be used within PreferencesProvider');
    }
    return context;
}
