// src/routes/api/auth/me/mod.ts
import { createFileRoute } from '@tanstack/react-router';
import { HttpError } from '../../../../errors';
import { requirePrivilegedUser } from '../../../../server/auth/privileged';

const jsonResponse = (payload: unknown, status: number) =>
    new Response(JSON.stringify(payload), {
        status,
        headers: {
            'Content-Type': 'application/json'
        }
    });

export const Route = createFileRoute('/api/auth/me/mod')({
    server: {
        handlers: {
            GET: async () => {
                try {
                    const user = await requirePrivilegedUser();
                    return jsonResponse({ user }, 200);
                } catch (error) {
                    if (error instanceof HttpError) {
                        return jsonResponse({ message: error.message }, error.status);
                    }
                    throw error;
                }
            }
        }
    }
});
