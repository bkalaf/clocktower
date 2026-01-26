// src/routes/_authed.rooms.n.tsx
//src/routes/_authed.rooms.n.tsx
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { CreateRoomForm } from '@/components/forms/CreateRoomForm';

const scriptSearchSchema = z.object({
    scriptId: z.string().optional()
});

export const Route = createFileRoute('/_authed/rooms/n')({
    validateSearch: (search) => {
        const parsed = scriptSearchSchema.safeParse(search);
        return parsed.success ? parsed.data : {};
    },
    component: CreateRoomRoute
});

function CreateRoomRoute() {
    const search = Route.useSearch();
    return <CreateRoomForm defaultScriptId={search.scriptId} />;
}
