import { getRequest } from '@tanstack/react-start/server';
import { getUserFromReq } from '../../server/getUserFromReq';
import { HttpError } from '../../errors';
import { success } from '../../utils/http';

// src/routes/api/whoami.ts
export function GET() {
    const req = getRequest();
    const user = getUserFromReq(req);
    if (!user) return HttpError.UNAUTHORIZED('UNAUTHORIZED: You are not logged in');
    return success({ user });
}
