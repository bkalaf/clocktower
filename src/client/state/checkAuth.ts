// src/client/state/checkAuth.ts
import { redirect } from '@tanstack/react-router';
import { store } from './store';
import { realtimeSelectors } from './realtimeSlice';

// src/client/state/checkAuth.ts
export function checkAuth() {
    if (!realtimeSelectors.selectIsAuth(store.getState())) {
        redirect({ to: '/login' });
    }
}
