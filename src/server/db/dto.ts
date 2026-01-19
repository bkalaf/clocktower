import { Types } from 'mongoose';

export type IdString = string;

export function idToString(id: unknown): IdString {
    if (!id) return '' as IdString;
    if (id instanceof Types.ObjectId) {
        return id.toString();
    }
    return String(id);
}

export function omitUndefined<T extends object>(obj: T): T {
    return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as T;
}

export function toIsoDate(value: unknown): string | null {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(String(value));
    return Number.isNaN(date.valueOf()) ? null : date.toISOString();
}
