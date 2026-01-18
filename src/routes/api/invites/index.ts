// src/routes/api/invites/index.ts
import { createFileRoute } from '@tanstack/react-router';
import { getUserFromCookie } from '../../../serverFns/getId/getUserFromCookie';
import { InviteModel } from '../../../db/models/Invite';

export const Route = createFileRoute('/api/invites/')({
    server: {
        handlers: {
            GET: async () => {
                const user = await getUserFromCookie();
                if (!user) {
                    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
                }
                const invites = await InviteModel.find({
                    invitedUserId: user._id,
                    status: 'pending',
                    expiresAt: { $gt: new Date() }
                }).lean();
                return Response.json(invites);
            }
        }
    }
});
