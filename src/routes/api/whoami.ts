// src/routes/api/whoami.ts
import { createFileRoute } from '@tanstack/react-router';
import { getUserFromReq } from '../../server/getUserFromReq';
import { $z } from '../../server/schemas/$z';

export const Route = createFileRoute('/api/whoami')({
    server: {
        handlers: {
            GET: async ({ request }: { request: Request }) => {
                try {
                    const user = await getUserFromReq(request);
                    console.log(`user`, user);
                    if (user.ok) return user.json();
                    return user;
                } catch (error) {
                    console.log(error);
                    throw error;
                }
            }
        }
    }
});
