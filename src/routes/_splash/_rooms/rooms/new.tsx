// src/routes/_splash/_rooms/rooms/new.tsx
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { CreateRoomForm } from '@/components/forms/CreateRoomForm';

const scriptSearchSchema = z.object({
    scriptId: z.string().optional()
});

export const Route = createFileRoute('/_splash/_rooms/rooms/new')({
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
