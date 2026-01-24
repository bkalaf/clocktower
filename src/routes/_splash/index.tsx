// src/routes/_splash/index.tsx
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useAppSelector } from '../../client/state/hooks';
import { authSelectors } from '../../client/state/authSlice';

export const Route = createFileRoute('/_splash/')({
    component: DashboardRoute
});

function DashboardRoute() {
    const isAuth = useAppSelector(authSelectors.isAuth);
    const navigate = useNavigate();
    if (isAuth) {
        navigate({ to: '/rooms' });
    }
    return <div className='flex h-auto text-6xl text-wrap font-extrabold font-rubik'>WELCOME TO EIDOLON</div>;
    // return <TownSquareExperience />;
}
