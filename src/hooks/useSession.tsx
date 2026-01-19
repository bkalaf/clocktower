// src/hooks/useSession.tsx
import * as React from 'react';
import { SessionContext } from '../session/SessionProvider';

export function useSession() {
    const context = React.useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}
