// src/routes/_authed.rooms._room.$roomId.index.tsx
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { checkAuth } from '@/client/state/checkAuth';

export const Route = createFileRoute('/_authed/rooms/_room/$roomId/')({
    beforeLoad: () => {
        checkAuth();
    },
    component: RouteComponent
});

function RouteComponent() {
    return <Outlet />;
}
