// src/server/screenshot/playwright.ts
import { chromium, type Browser } from 'playwright';
import { env } from '@/env';
import { ensureRenderServer, getRenderEndpoint } from './renderServer';
import type { ScreenshotJob } from './types';

let browser: Browser | null = null;

async function getBrowser() {
    if (!browser) {
        browser = await chromium.launch({ headless: true });
    }
    return browser;
}

export async function renderJobViaPlaywright(job: ScreenshotJob) {
    await ensureRenderServer();
    const bw = await getBrowser();
    const page = await bw.newPage();
    await page.setViewportSize({
        width: env.GRIMOIRE_RENDER_VIEWPORT.width,
        height: env.GRIMOIRE_RENDER_VIEWPORT.height
    });

    const endpoint = getRenderEndpoint(job.id, job.expiresAt);
    await page.goto(endpoint, {
        waitUntil: 'networkidle',
        timeout: env.GRIMOIRE_RENDER_TIMEOUT
    });

    await page.waitForSelector('#grimoire-root', { timeout: env.GRIMOIRE_RENDER_TIMEOUT });
    const root = await page.$('#grimoire-root');
    if (!root) {
        await page.close();
        throw new Error('render root missing');
    }

    const buffer = await root.screenshot({ type: 'png' });
    await page.close();
    return buffer;
}
