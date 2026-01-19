// src/lib/api.ts
import type { AuthedUser } from '../types/game';

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

export async function whoami() {
    return apiFetch<{ user: AuthedUser | null }>('/api/whoami', {
        method: 'GET'
    });
}

export async function login(email: string, password: string) {
    return apiFetch<{ ok: boolean }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

export async function register(name: string, email: string, password: string, verificationPassword: string) {
    return apiFetch<{ ok: boolean }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, verificationPassword })
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
