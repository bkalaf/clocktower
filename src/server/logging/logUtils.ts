const DEFAULT_MAX_LENGTH = 1024;
const ELLIPSIS = '…';

function truncate(value: string, maxLength: number) {
    return value.length <= maxLength ? value : `${value.slice(0, maxLength)}${ELLIPSIS}`;
}

export function summarizePayload(value: unknown, maxLength: number = DEFAULT_MAX_LENGTH) {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (typeof value === 'string') {
        return truncate(value, maxLength);
    }

    try {
        const serialized = JSON.stringify(value);
        if (serialized === undefined) {
            return String(value);
        }
        return truncate(serialized, maxLength);
    } catch {
        return 'unserializable';
    }
}

export function safeSerialize(value: unknown, maxLength: number = DEFAULT_MAX_LENGTH) {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (typeof value === 'string') {
        return truncate(value, maxLength);
    }
    if (typeof value === 'object') {
        return summarizePayload(value, maxLength);
    }
    return truncate(String(value), maxLength);
}
