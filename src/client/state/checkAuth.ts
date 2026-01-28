// src/client/state/checkAuth.ts
import { redirect } from '@tanstack/react-router';
import { store } from './store';
import { authSelectors } from './authSlice';

// src/client/state/checkAuth.ts
export function checkAuth() {
    if (!authSelectors.selectIsAuth(store.getState().auth)) {
        redirect({ to: '/login' });
    }
}
