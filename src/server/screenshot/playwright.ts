// src/server/screenshot/playwright.ts
import { chromium, type Browser } from 'playwright';
import { env } from '@/env';
import { appendLog } from '../logging/diskLogger';
import { ensureRenderServer, getRenderEndpoint } from './renderServer';
import type { ScreenshotJob } from './types';

let browser: Browser | null = null;
const screenshotLogDir = env.SCREENSHOT_LOG_DIR;

function logScreenshotJob(entry: Record<string, unknown>) {
    void appendLog(screenshotLogDir, { service: 'screenshot', ...entry });
}

async function getBrowser() {
    if (!browser) {
        browser = await chromium.launch({ headless: true });
    }
    return browser;
}

export async function renderJobViaPlaywright(job: ScreenshotJob) {
    const start = Date.now();
    logScreenshotJob({
        event: 'screenshot_request_received',
        jobId: job.id,
        matchId: job.matchId,
        policy: job.policy,
        recipientPlayerId: job.recipientPlayerId
    });

    await ensureRenderServer();
    const bw = await getBrowser();
    const page = await bw.newPage();
    await page.setViewportSize({
        width: env.GRIMOIRE_RENDER_VIEWPORT.width,
        height: env.GRIMOIRE_RENDER_VIEWPORT.height
    });

    const endpoint = getRenderEndpoint(job.id, job.expiresAt);
    try {
        await page.goto(endpoint, {
            waitUntil: 'networkidle',
            timeout: env.GRIMOIRE_RENDER_TIMEOUT
        });
        await page.waitForSelector('#grimoire-root', { timeout: env.GRIMOIRE_RENDER_TIMEOUT });
        const root = await page.$('#grimoire-root');
        if (!root) {
            throw new Error('render root missing');
        }

        const buffer = await root.screenshot({ type: 'png' });
        await page.close();
        const durationMs = Date.now() - start;
        logScreenshotJob({
            event: 'screenshot_completed',
            jobId: job.id,
            matchId: job.matchId,
            durationMs
        });
        return buffer;
    } catch (error) {
        await page.close();
        const durationMs = Date.now() - start;
        logScreenshotJob({
            event: 'screenshot_failed',
            jobId: job.id,
            matchId: job.matchId,
            errorMessage: (error as Error).message,
            durationMs
        });
        throw error;
    }
}
