// src/routes/_splash/index.tsx
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';

export const Route = createFileRoute('/_splash/')({
    component: DashboardRoute
});

function DashboardRoute() {
    const context = Route.useRouteContext();
    const isAuth = useMemo(() => context.userId !== null, [context.userId]);
    const navigate = useNavigate();
    if (isAuth) {
        navigate({ to: '/rooms' });
    }
    return <div className='flex h-auto text-6xl text-wrap font-extrabold font-rubik'>WELCOME TO CLOCKTOWER</div>;
    // return <TownSquareExperience />;
}
