// src/server/services/aiUsers.ts
import { AiUserModel } from '../models/AiUser';
import type { AiUserRecord } from '../models/AiUser';

const shuffle = <T>(items: T[]): T[] => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

let aiUsersCache: AiUserRecord[] = [];
let cachePromise: Promise<AiUserRecord[]> | null = null;

export const loadAiUsersCache = async (): Promise<AiUserRecord[]> => {
    if (aiUsersCache.length) {
        return aiUsersCache;
    }
    if (!cachePromise) {
        const promise = (async () => {
            const docs = await AiUserModel.find().lean<AiUserRecord[]>().exec();
            aiUsersCache = docs;
            return aiUsersCache;
        })();
        cachePromise = promise;
        promise.finally(() => {
            cachePromise = null;
        });
    }
    return cachePromise!;
};

export const getRandomAiUsers = (count: number): AiUserRecord[] => {
    if (aiUsersCache.length === 0) {
        throw new Error('AI user cache is empty');
    }
    if (count > aiUsersCache.length) {
        throw new Error('not enough AI users available');
    }
    const shuffled = shuffle(aiUsersCache);
    return shuffled.slice(0, count);
};
