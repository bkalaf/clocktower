const connectMock = jest.fn();

jest.mock('mongoose', () => ({
    __esModule: true,
    default: {
        connect: connectMock
    }
}));

const importConnector = async () => {
    delete (global as any).__mongooseConn;
    const module = await import('./connectMongoose');
    return module.connectMongoose;
};

const resetEnv = () => {
    const envKeys = ['VITE_MONGODB_URI', 'MONGO_URL', 'MONGODB_URI', 'VITE_MONGODB_DB', 'MONGO_DB', 'MONGODB_DB'];
    envKeys.forEach((key) => {
        delete process.env[key];
    });
};

describe('connectMongoose', () => {
    beforeEach(() => {
        jest.resetModules();
        connectMock.mockReset();
        resetEnv();
    });

    it('throws when no Mongo URL is configured', async () => {
        const connectMongoose = await importConnector();

        await expect(connectMongoose()).rejects.toThrow('Missing MONGO_URL');
    });

    it('uses the provided Mongo URL and caches the connection', async () => {
        process.env.MONGO_URL = 'mongodb://example.com';
        process.env.MONGODB_DB = 'game-db';
        const connectionValue = { __test: 'connected' };
        connectMock.mockResolvedValue(connectionValue as any);
        const connectMongoose = await importConnector();

        const first = await connectMongoose();
        const second = await connectMongoose();

        expect(connectMock).toHaveBeenCalledWith('mongodb://example.com', { dbName: 'game-db' });
        expect(connectMock).toHaveBeenCalledTimes(1);
        expect(first).toBe(connectionValue);
        expect(second).toBe(first);
    });
});
