// src/routes/_authed.index.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/')({
    component: RouteComponent
});

function RouteComponent() {
    return <Outlet />;
}
