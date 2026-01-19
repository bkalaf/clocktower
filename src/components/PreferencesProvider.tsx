// src/components/PreferencesProvider.tsx
import { type ReactNode, useState, useEffect, useCallback, useMemo } from 'react';
import { DEFAULT_USER_PREFERENCES, type UserPreferenceId } from '../types/preferences';
import { PreferenceValues, STORAGE_KEY, PreferencesContext } from '../hooks/usePreferences';

export function PreferencesProvider({ children }: { children: ReactNode }) {
    const [values, setValues] = useState<PreferenceValues>(() => ({ ...DEFAULT_USER_PREFERENCES }));

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (!stored) return;
        try {
            const parsed = JSON.parse(stored) as Partial<PreferenceValues>;
            // eslint-disable-next-line react-hooks/set-state-in-effect
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
