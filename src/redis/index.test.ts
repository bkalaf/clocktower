// src/redis/index.test.ts
const connectMock = jest.fn();
const createClientMock = jest.fn(() => ({ connect: connectMock }));

jest.mock('redis', () => ({
    __esModule: true,
    createClient: createClientMock
}));

jest.mock('../env', () => ({
    env: {
        REDIS_URL: 'redis://test-redis:6379'
    }
}));

const importRedis = async () => {
    const module = await import('./index');
    return module.getRedis;
};

describe('getRedis', () => {
    beforeEach(() => {
        jest.resetModules();
        connectMock.mockReset();
        createClientMock.mockReset();
        connectMock.mockResolvedValue(undefined);
    });

    it('creates a client, connects once, and reuses it', async () => {
        const getRedis = await importRedis();

        const firstClient = await getRedis();
        expect(createClientMock).toHaveBeenCalledWith({ url: 'redis://test-redis:6379' });
        expect(connectMock).toHaveBeenCalledTimes(1);

        const secondClient = await getRedis();
        expect(secondClient).toBe(firstClient);
        expect(connectMock).toHaveBeenCalledTimes(1);
        expect(createClientMock).toHaveBeenCalledTimes(1);
    });
});
