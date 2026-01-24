// src/client/state/checkAuth.ts
import { redirect } from '@tanstack/react-router';
import { authSelectors } from './authSlice';
import { store } from './store';

// src/client/state/checkAuth.ts
export function checkAuth() {
    if (!authSelectors.isAuth(store.getState())) {
        redirect({ to: '/login' });
    }
}
