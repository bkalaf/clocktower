// src/routes/api/auth/logout.ts
import { createFileRoute } from '@tanstack/react-router';
import $session from '../../../serverFns/$session';

export const Route = createFileRoute('/api/auth/logout')({
    server: {
        handlers: {
            POST: async () => {
                await $session.deleteById();
                return Response.json({ ok: true });
            }
        }
    }
});
