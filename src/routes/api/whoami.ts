// src/routes/api/whoami.ts
import { createFileRoute } from '@tanstack/react-router';
import { getUserFromCookie } from '../../serverFns/getId/getUserFromCookie';

export const Route = createFileRoute('/api/whoami')({
    server: {
        handlers: {
            GET: async () => {
                try {
                    const user = await getUserFromCookie();
                    return Response.json({ user });
                } catch (error) {
                    return Response.json({ user: null });
                }
            }
        }
    }
});
