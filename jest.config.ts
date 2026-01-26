import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: [
        '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)',
        '<rootDir>/scripts/**/?(*.)+(spec|test).[jt]s?(x)'
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json'
        }
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/']
};

export default config;
