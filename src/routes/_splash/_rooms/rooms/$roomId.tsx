// src/routes/_splash/_rooms/rooms/$roomId.tsx

import { createFileRoute } from '@tanstack/react-router';
import { checkAuth } from '../../../../client/state/checkAuth';

export const Route = createFileRoute('/_splash/_rooms/rooms/$roomId')({
    beforeLoad: () => {
        checkAuth();
    },
    component: RouteComponent
});

export function RouteComponent() {
    const { roomId } = Route.useParams();
    return <div>{roomId}</div>;
}
