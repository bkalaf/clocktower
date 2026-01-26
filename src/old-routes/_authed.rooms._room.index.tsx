// src/old-routes/_authed.rooms._room.index.tsx
//src/routes/_authed.rooms.$roomId.tsx

import { createFileRoute } from '@tanstack/react-router';
import { checkAuth } from '../../../client/state/checkAuth';

export const Route = createFileRoute('/_authed/rooms/_room/')({
    beforeLoad: () => {
        checkAuth();
    },
    component: RouteComponent
});

export function RouteComponent() {
    const { roomId } = Route.useParams();
    return <div>{roomId}</div>;
}
