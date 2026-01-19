// src/routes/api/auth/forgot-password.ts
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { parseJsonBody } from '../../../server/parseJsonBody';

const ForgotPasswordBodySchema = z.object({
    email: z.email('Enter a valid email address')
});

export const Route = createFileRoute('/api/auth/forgot-password')({
    server: {
        handlers: {
            POST: async ({ request }) => {
                const parsed = await parseJsonBody(request, ForgotPasswordBodySchema);
                if (!parsed.ok) {
                    return parsed.response;
                }

                const { email } = parsed.data;
                const token = randomUUID();
                console.info(`[forgot-password] ${email} requested a reset token: ${token}`);

                return new Response(JSON.stringify({ ok: true }), { status: 200 });
            }
        }
    }
});
