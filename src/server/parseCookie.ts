// src/server/parseCookie.ts

export function parseCookie(cookieHeader: string, name: string) {
    const parts = cookieHeader.split(';').map((s) => s.trim());
    const found = parts.find((p) => p.startsWith(name + '='));
    if (!found) return null;
    return decodeURIComponent(found.slice(name.length + 1));
}
