/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/safeStringify.ts
export function safeStringify(value: unknown): string {
    if (value == null) {
        return String(value); // "null" | "undefined"
    }

    try {
        // Prefer toJSON if present and callable
        if (typeof value === 'object' && 'toJSON' in value && typeof (value as any).toJSON === 'function') {
            return JSON.stringify((value as any).toJSON());
        }

        // Fall back to toString if present
        if (typeof (value as any).toString === 'function') {
            return (value as any).toString();
        }

        // Last resort
        return String(value);
    } catch {
        // Absolutely never throw from logging / serialization
        try {
            return String(value);
        } catch {
            return '[unstringifiable]';
        }
    }
}
