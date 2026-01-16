// src/db/connectMongoose.ts
import mongoose from 'mongoose';

console.log(process.env);

declare global {
    var __mongooseConn: { promise: Promise<typeof mongoose> | null; conn: typeof mongoose | null } | undefined;
}

const cached = global.__mongooseConn ?? (global.__mongooseConn = { promise: null, conn: null });

export async function connectMongoose() {
    const mongoUrl = process.env.VITE_MONGODB_URI ?? process.env.MONGO_URL ?? process.env.MONGODB_URI ?? '';
    const mongoDb = process.env.VITE_MONGODB_DB ?? process.env.MONGO_DB ?? process.env.MONGODB_DB ?? '';

    if (!mongoUrl) {
        throw new Error('Missing MONGO_URL');
    }
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(mongoUrl, { dbName: mongoDb });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
