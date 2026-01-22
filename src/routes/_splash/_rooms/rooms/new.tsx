// src/routes/_splash/_rooms/rooms/new.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_splash/_rooms/rooms/new')({
    component: RouteComponent
});

function RouteComponent() {
    return <div>Hello "/_splash/_rooms/rooms/new"!</div>;
}
