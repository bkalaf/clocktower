import { success } from '../../utils/http';

// src/routes/api/health.ts
export function GET() {
    return success({ ok: true });
}
