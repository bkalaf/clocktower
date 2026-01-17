// src/errors/index.ts
import { safeStringify } from '../utils/safeStringify';

// src/errors/index.ts
export class HttpError extends Error {
    status: number;
    code: string;
    extra: unknown;

    constructor(status: number, code: string, message: string, extra?: unknown) {
        super(message);
        this.status = status;
        this.code = code;
        this.extra = extra;
    }
    static FORBIDDEN(message: string) {
        const code = $STATUS_CODES.FORBIDDEN;
        return new HttpError(code, $STATUS_CODES2[code as keyof typeof $STATUS_CODES2], message);
    }
    static NOT_FOUND(message: string) {
        const code = $STATUS_CODES.NOT_FOUND;
        return new HttpError(code, $STATUS_CODES2[code as keyof typeof $STATUS_CODES2], message);
    }
    static BAD_REQUEST(message: string, extra?: unknown) {
        const code = $STATUS_CODES.BAD_REQUEST;
        // const response = new Response(extra as any ?? {}, {
        //     headers: { 'Content-Type': 'applicatoin/json' },
        //     status: code,
        //     statusText: $STATUS_CODES2[code as keyof typeof $STATUS_CODES2]
        // });
        return new HttpError(code, $STATUS_CODES2[code as keyof typeof $STATUS_CODES2], message, extra);
    }
    static BAD_REQUEST_RESPONSE(message: string, extra?: unknown) {
        const code = $STATUS_CODES.BAD_REQUEST;
        const response = new Response(JSON.stringify({ message, ...(extra ?? {}) }), {
            headers: { 'Content-Type': 'application/json' },
            status: code,
            statusText: $STATUS_CODES2[code as keyof typeof $STATUS_CODES2]
        });
        return response;
    }
    static OK(message: string) {
        const code = $STATUS_CODES.OK;
        return new HttpError(code, $STATUS_CODES2[code as keyof typeof $STATUS_CODES2], message);
    }
    static METHOD_NOT_ALLOWED(message: string) {
        const code = $STATUS_CODES.METHOD_NOT_ALLOWED;
        return new HttpError(code, $STATUS_CODES2[code as keyof typeof $STATUS_CODES2], message);
    }
    static UNAUTHORIZED(message: string) {
        const code = $STATUS_CODES.UNAUTHORIZED;
        return new HttpError(code, $STATUS_CODES2[code as keyof typeof $STATUS_CODES2], message);
    }
    static UNAUTHORIZED_RESPONSE(message: string, extra?: unknown) {
        const code = $STATUS_CODES.UNAUTHORIZED;
        const response = new Response(JSON.stringify({ message, ...(extra ?? {}) }), {
            headers: { 'Content-Type': 'application/json' },
            status: code,
            statusText: $STATUS_CODES2[code as keyof typeof $STATUS_CODES2]
        });
        return response;
    }
    static CONFLICT_RESPONSE(message: string, extra?: unknown) {
        const code = $STATUS_CODES.CONFLICT;
        const response = new Response(safeStringify({ message, ...(extra ?? {}) }), {
            headers: { 'Content-Type': 'application/json' },
            status: code,
            statusText: $STATUS_CODES2[code as keyof typeof $STATUS_CODES2]
        });
        return response;
    }
}

export const $STATUS_CODES2 = {
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    204: 'No Content',
    100: 'Continue',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    408: 'Request Timeout',
    409: 'Conflict',
    425: 'Too Early',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable'
};

export const $STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    CONTINUE: 100,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    REQUEST_TIMEOUT: 408,
    CONFLICT: 409,
    TOO_EARLY: 425,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
};
