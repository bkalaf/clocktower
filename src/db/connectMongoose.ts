// src/db/connectMongoose.ts
import mongoose from 'mongoose';

console.log(import.meta);

const mongoUrl = import.meta.env.VITE_MONGODB_URI ?? import.meta.env.MONGO_URL ?? import.meta.env.MONGODB_URI ?? '';
const mongoDb = import.meta.env.VITE_MONGODB_DB ?? import.meta.env.MONGO_DB ?? import.meta.env.MONGODB_DB ?? '';

if (!mongoUrl) {
    throw new Error('Missing MONGO_URL');
}

declare global {
    var __mongooseConn: { promise: Promise<typeof mongoose> | null; conn: typeof mongoose | null } | undefined;
}

const cached = global.__mongooseConn ?? (global.__mongooseConn = { promise: null, conn: null });

export async function connectMongoose() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(mongoUrl, { dbName: mongoDb });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
