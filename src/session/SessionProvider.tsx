import * as React from 'react';

type SessionState = {
    authUserId?: string;
    lastRoomId?: string;
    lastGameId?: string;
};

export type SessionContextValue = SessionState & {
    setAuthUserId: (id?: string) => void;
    setLastRoomId: (id?: string) => void;
    setLastGameId: (id?: string) => void;
    clear: () => void;
};

const SessionContext = React.createContext<SessionContextValue | null>(null);
const STORAGE_KEY = 'botc.session.v1';

function load(): SessionState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        return JSON.parse(raw) as SessionState;
    } catch {
        return {};
    }
}

function save(state: SessionState) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // ignore storage failures
    }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = React.useState<SessionState>(() => {
        if (typeof window === 'undefined') return {};
        return load();
    });

    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        save(state);
    }, [state]);

    const value = React.useMemo(
        () => ({
            ...state,
            setAuthUserId: (authUserId?: string) => setState((current) => ({ ...current, authUserId })),
            setLastRoomId: (lastRoomId?: string) => setState((current) => ({ ...current, lastRoomId })),
            setLastGameId: (lastGameId?: string) => setState((current) => ({ ...current, lastGameId })),
            clear: () => setState({})
        }),
        [state]
    );

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
    const context = React.useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}

export function createDefaultSessionContextValue(): SessionContextValue {
    return {
        authUserId: undefined,
        lastRoomId: undefined,
        lastGameId: undefined,
        setAuthUserId: () => {},
        setLastRoomId: () => {},
        setLastGameId: () => {},
        clear: () => {}
    };
}
