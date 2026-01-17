// src/routes/api/whoami.ts
import { createFileRoute } from '@tanstack/react-router';
import { getUserFromReq } from '../../server/getUserFromReq';

export const Route = createFileRoute('/api/whoami')({
    server: {
        handlers: {
            GET: async ({ request }: { request: Request }) => {
                try {
                    const user = await getUserFromReq(request);
                    console.log(`user`, user);
                    if (!user) return Response.json({ user: null }, { status: 200 });
                    return Response.json({ user }, { status: 200 });
                } catch (error) {
                    console.log(error);
                    throw error;
                }
            }
        }
    }
});
