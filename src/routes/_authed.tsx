// src/routes/_authed.tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { store } from '../client/state/store';
// src/routes/_authed.tsx
export function Component() {
    return (
        <div className='w-full h-full flex justify-center items-center px-6'>
            <Outlet />
        </div>
    );
}

export const Route = createFileRoute('/_authed')({
    beforeLoad: async () => {
        const value = store.getState().realtime.session?.context?.userId != null;
        if (!value) {
            console.log(`UNAUTHENTICATED: redirecting to login`);
            redirect({ to: '/auth/login' })
        }
    },
    component: Component
});
