// src/env.ts
import 'dotenv/config';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
    server: {
        REDIS_URL: z.url().min(1),
        MONGODB_URI: z.url().min(1),
        MONGODB_DB: z.string().min(1),
        REALTIME_PORT: z.coerce.number().int().min(0),
        SESSION_COOKIE_NAME: z.string().min(1),
        ALLOW_DEV_GRIMOIRE: z.string().optional(),
        XSTATE_LOG_DIR: z.string().min(1).optional(),
        SOCKET_LOG_DIR: z.string().min(1).optional(),
        SCREENSHOT_LOG_DIR: z.string().min(1).optional(),
        // RENDER_TOKEN_SECRET: z.string().min(16),
        // GRIMOIRE_RENDER_PORT: z.coerce.number().int().min(1024).max(65535).default(4321),
        // GRIMOIRE_RENDER_TIMEOUT: z.coerce.number().int().min(1000).default(35000),
        // GRIMOIRE_RENDER_VIEWPORT: z.object({
        //     width: z.coerce.number().int().min(320).default(1400),
        //     height: z.coerce.number().int().min(240).default(900)
        // })
    },

    /**
     * The prefix that client-side variables must have. This is enforced both at
     * a type-level and at runtime.
     */
    clientPrefix: 'VITE_',

    client: {
        VITE_APP_TITLE: z.string().min(1).optional()
    },

    /**
     * What object holds the environment variables at runtime. This is usually
     * `process.env` or `import.meta.env`.
     */
    runtimeEnv: {
        ...process.env,
        ...import.meta.env
    },

    /**
     * By default, this library will feed the environment variables directly to
     * the Zod validator.
     *
     * This means that if you have an empty string for a value that is supposed
     * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
     * it as a type mismatch violation. Additionally, if you have an empty string
     * for a value that is supposed to be a string with a default value (e.g.
     * `DOMAIN=` in an ".env" file), the default value will never be applied.
     *
     * In order to solve these issues, we recommend that all new projects
     * explicitly specify this option as true.
     */
    emptyStringAsUndefined: true
});
