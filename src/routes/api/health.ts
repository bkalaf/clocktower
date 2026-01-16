// src/routes/api/health.ts
import { createFileRoute } from '@tanstack/react-router';
import { success } from '../../utils/http';

export const Route = createFileRoute('/api/health')({
    server: {
        handlers: {
            GET: async () => {
                return success({ ok: true });
            }
        }
    }
});
