// src/lib/api.ts
import { createServerFn } from '@tanstack/react-start';
import type { AuthedUser } from '../types/game';
import { getSessionCookie } from '../server/auth/cookies';
import { ensureSessionActor, stopSessionActor } from '../server/sessionService';
import { getUserFromCookie } from '../serverFns/getId/getUserFromCookie';
import z from 'zod/v4';
import { UserModel } from '../db/models/User';
import { loginServerFn } from '../routes/api/auth/-login';
import type { UserSettings } from '../schemas/settings';

const defaultHeaders = {
    'Content-Type': 'application/json'
};

export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
    const { headers, credentials, ...rest } = options;
    const response = await fetch(path, {
        credentials: credentials ?? 'include',
        headers: {
            ...defaultHeaders,
            ...headers
        },
        ...rest
    });

    const text = await response.text();
    let data: unknown;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = null;
    }

    if (!response.ok) {
        const message =
            typeof data === 'object' && data && 'message' in data ?
                ((data as { message?: string }).message ?? response.statusText)
            :   response.statusText;
        throw new Error(message || 'Request failed');
    }

    return data as T;
}

export const whoamiFn = createServerFn({
    method: 'GET'
}).handler(async () => {
    const user: AuthedUser | null = await getUserFromCookie();
    const sessionId = getSessionCookie();
    if (!user) {
        if (sessionId) {
            stopSessionActor(sessionId);
        }
        return { user: null };
    }

    if (sessionId) {
        const sessionActor = ensureSessionActor(sessionId);
        sessionActor.send({ type: 'LOGIN_SUCCESS', userId: user._id, username: user.username });
    }

    return { user };
});

export async function whoami() {
    return apiFetch<{ user: AuthedUser | null }>('/api/whoami', {
        method: 'GET'
    });
}

export async function updateThemeSettings(settings: UserSettings) {
    return apiFetch<{ ok: boolean; settings: UserSettings }>('/api/auth/settings', {
        method: 'PATCH',
        body: JSON.stringify(settings)
    });
}

export async function login(email: string, password: string) {
    return loginServerFn({ data: { email, password } });
    // return apiFetch<{ ok: boolean }>('/api/auth/login', {
    //     method: 'POST',
    //     body: JSON.stringify({ email, password })
    // });
}

const checkUserNameInput = z.object({
    username: z.string().min(5, 'Must be over 5 characters')
});
const checkEmailInput = z.object({
    email: z.email()
});

export const checkUserName = createServerFn({
    method: 'GET'
})
    .inputValidator(checkUserNameInput)
    .handler(async ({ data }) => {
        const result = await UserModel.find(data).countDocuments();
        if (result > 0) return { ok: false, msg: 'Username already in use.' };
        return { ok: true };
    });
export const checkEmail = createServerFn({
    method: 'GET'
})
    .inputValidator(checkEmailInput)
    .handler(async ({ data }) => {
        const result = await UserModel.find(data).countDocuments();
        if (result > 0) return { ok: false, msg: 'E-mail already in use.' };
        return { ok: true };
    });

export async function register(username: string, email: string, password: string, verificationPassword: string) {
    const emailResult = await checkEmail({ data: { email } });
    const usernameResult = await checkUserName({ data: { username } });
    if (!emailResult.ok) {
        return emailResult;
    } else if (!usernameResult.ok) {
        return usernameResult;
    }
    return apiFetch<{ ok: boolean; msg?: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, verificationPassword })
    });
}

export async function logout() {
    return apiFetch<{ ok: boolean }>('/api/auth/logout', {
        method: 'POST'
    });
}

export async function forgotPassword(email: string) {
    return apiFetch<{ ok: boolean }>('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
    });
}
