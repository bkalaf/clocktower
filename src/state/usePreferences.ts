// src/state/usePreferences.ts
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import type { UserPreferenceId } from '../types/preferences';
import { DEFAULT_USER_PREFERENCES } from '../types/preferences';

const STORAGE_KEY = 'clocktower/user-preferences';

type PreferenceValues = Record<UserPreferenceId, string>;

type PreferencesContextValue = {
    values: PreferenceValues;
    setPreference: (id: UserPreferenceId, value: string) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
    const [values, setValues] = useState<PreferenceValues>(() => ({ ...DEFAULT_USER_PREFERENCES }));

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (!stored) return;
        try {
            const parsed = JSON.parse(stored) as Partial<PreferenceValues>;
            setValues((prev) => ({ ...prev, ...parsed }));
        } catch {
            console.error('Failed to parse stored user preferences.');
        }
    }, []);

    const setPreference = useCallback((id: UserPreferenceId, value: string) => {
        setValues((prev) => {
            const next = { ...prev, [id]: value };
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            }
            return next;
        });
    }, []);

    const contextValue = useMemo(() => ({ values, setPreference }), [values, setPreference]);

    return <PreferencesContext.Provider value={contextValue}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
    const context = useContext(PreferencesContext);
    if (!context) {
        throw new Error('usePreferences must be used within PreferencesProvider');
    }
    return context;
}
