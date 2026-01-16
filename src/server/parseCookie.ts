// src/server/parseCookie.ts
export function parseCookie(cookieHeader: string | null, name: string) {
    if (!cookieHeader) return null;
    const parts = cookieHeader.split(';').map((s) => s.trim());
    const found = parts.find((p) => p.startsWith(name + '='));
    if (!found) return null;
    return decodeURIComponent(found.slice(name.length + 1));
}
