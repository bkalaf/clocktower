import { createFileRoute } from '@tanstack/react-router';
import { parseJsonBody } from '../../../../server/parseJsonBody';
import { getUserFromCookie } from '../../../../serverFns/getId/getUserFromCookie';
import { HttpError } from '../../../../errors';
import { connectMongoose } from '../../../../db/connectMongoose';
import { UserModel } from '../../../../db/models/User';
import { zUserSettings } from '../../../../schemas/settings';

const UpdateSettingsSchema = zUserSettings;

export const Route = createFileRoute('/api/auth/settings')({
    server: {
        handlers: {
            PATCH: async ({ request }) => {
                const bodyResult = await parseJsonBody(request, UpdateSettingsSchema);
                if (!bodyResult.ok) {
                    return bodyResult.response;
                }
                const settings = bodyResult.data;
                const user = await getUserFromCookie();
                if (!user) {
                    return HttpError.UNAUTHORIZED_RESPONSE('UNAUTHORIZED');
                }

                await connectMongoose();
                const updated = await UserModel.findByIdAndUpdate(user._id, { settings }, { new: true }).lean();

                return Response.json({
                    ok: true,
                    settings: updated?.settings ?? settings
                });
            }
        }
    }
});
