// src/routes/api/scripts/index.ts
import { createFileRoute } from '@tanstack/react-router';
import { listAvailableScripts } from '../../../server/scripts';

export const Route = createFileRoute('/api/scripts/')({
    server: {
        handlers: {
            GET: async () => {
                const scripts = await listAvailableScripts();
                return Response.json(scripts);
            }
        }
    }
});
