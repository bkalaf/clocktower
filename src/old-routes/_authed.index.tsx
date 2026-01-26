// src/old-routes/_authed.index.tsx
import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useAppSelector } from '../client/state/hooks';
import { realtimeSelectors } from '../client/state/realtimeSlice';

export const Route = createFileRoute('/_authed/')({
    component: DashboardRoute
});

function DashboardRoute() {
    const isAuth = useAppSelector(realtimeSelectors.selectIsAuth);
    // if (isAuth) {
    //     navigate({ to: '/rooms' });
    // }
    return (
        (isAuth && <Navigate to='/rooms' />) || (
            <div className='flex h-auto text-6xl text-wrap font-extrabold font-rubik'>WELCOME TO EIDOLON</div>
        )
    );
    // return <TownSquareExperience />;
}
