// src/server/screenshot/renderServer.ts
import http from 'node:http';
import { env } from '@/env';
import { appendLog } from '../logging/diskLogger';
import { getScreenshotJob } from './jobStore';
import type { ScreenshotJob, GrimoireViewModel } from './types';
import crypto from 'node:crypto';

const BASE_URL = `http://localhost:${env.GRIMOIRE_RENDER_PORT}`;

const secret = env.RENDER_TOKEN_SECRET;

let server: http.Server | null = null;
let serverInitialized = false;

const screenshotLogDir = env.SCREENSHOT_LOG_DIR;

function logRenderServer(entry: Record<string, unknown>) {
    void appendLog(screenshotLogDir, { service: 'screenshot', ...entry });
}

export function createRenderToken(jobId: string, expiresAt: number) {
    const payload = `${jobId}:${expiresAt}`;
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const token = Buffer.from(`${payload}:${signature}`).toString('base64url');
    return token;
}

export function verifyRenderToken(token: string) {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const [jobId, expiresRaw, signature] = decoded.split(':');
    if (!jobId || !expiresRaw || !signature) {
        throw new Error('invalid');
    }
    const expiresAt = Number(expiresRaw);
    if (Number.isNaN(expiresAt)) throw new Error('invalid');
    if (expiresAt < Date.now()) {
        throw new Error('expired');
    }
    const payload = `${jobId}:${expiresAt}`;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    if (expected !== signature) {
        throw new Error('invalid');
    }
    const job = getScreenshotJob(jobId);
    if (!job) throw new Error('not_found');
    if (job.expiresAt < Date.now()) throw new Error('expired');
    return job;
}

export async function ensureRenderServer() {
    if (serverInitialized) return;
    server = http.createServer((req, res) => {
        if (!req.url) {
            res.writeHead(400);
            res.end('Missing URL');
            return;
        }
        const url = new URL(req.url, BASE_URL);
        if (req.method !== 'GET' || url.pathname !== '/render/grimoire') {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        logRenderServer({
            event: 'render_request_received',
            method: req.method,
            path: url.pathname,
            query: url.searchParams.toString(),
            remoteAddress: req.socket.remoteAddress
        });
        const token = url.searchParams.get('token');
        if (!token) {
            logRenderServer({
                event: 'render_request_missing_token',
                path: url.pathname,
                remoteAddress: req.socket.remoteAddress
            });
            res.writeHead(400);
            res.end('missing token');
            return;
        }
        let job: ScreenshotJob;
        try {
            job = verifyRenderToken(token);
        } catch (error) {
            logRenderServer({
                event: 'render_request_forbidden',
                remoteAddress: req.socket.remoteAddress,
                errorMessage: (error as Error).message
            });
            res.writeHead(403);
            res.end(`forbidden: ${(error as Error).message}`);
            return;
        }

        logRenderServer({
            event: 'render_job_verified',
            jobId: job.id,
            matchId: job.matchId
        });

        if (!job.viewModel) {
            res.writeHead(500);
            logRenderServer({
                event: 'render_request_missing_view',
                jobId: job.id,
                matchId: job.matchId
            });
            res.end('job missing view');
            return;
        }

        const html = renderHtml(job.viewModel);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
        logRenderServer({
            event: 'render_response_served',
            jobId: job.id,
            matchId: job.matchId
        });
    });

    await new Promise<void>((resolve, reject) => {
        server?.listen(env.GRIMOIRE_RENDER_PORT, () => {
            serverInitialized = true;
            logRenderServer({
                event: 'server_started',
                port: env.GRIMOIRE_RENDER_PORT
            });
            resolve();
        });
        server?.once('close', () => {
            logRenderServer({ event: 'server_shutdown' });
        });
        server?.on('error', (error) => {
            logRenderServer({
                event: 'server_error',
                errorMessage: (error as Error).message
            });
            reject(error);
        });
    });
}

function renderHtml(view: GrimoireViewModel) {
    const seatRows = view.seats
        .map(
            (seat) => `
            <div class="seat-card">
                <div class="seat-header">
                    <span class="player-name">${seat.playerName}</span>
                    <span class="role-name">${seat.roleName}</span>
                </div>
                <div class="seat-meta">
                    <span class="pill ${seat.alignment}">${seat.alignment}</span>
                    <span class="spot">Seat ${seat.seatId}</span>
                </div>
                <div class="seat-tags">
                    ${seat.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>`
        )
        .join('');

    const noteSection = view.misinfoNote
        ? `<p class="note">MISINFO NOTE: ${view.misinfoNote}</p>`
        : '';
    const activeNotes =
        view.activeNotes.length > 0
            ? `<p class="note">${view.activeNotes.join(' · ')}</p>`
            : '';

    return `
        <!doctype html>
        <html>
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Storyteller ${view.phaseLabel}</title>
            <style>
                body {
                    margin: 0;
                    background: radial-gradient(circle at top, #1e293b, #0f172a);
                    color: #f8fafc;
                    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
                    min-height: 100vh;
                }
                #grimoire-root {
                    width: 1200px;
                    margin: 32px auto;
                    padding: 32px;
                    border-radius: 28px;
                    background: rgba(15, 23, 42, 0.9);
                    box-shadow: 0 20px 40px rgba(15, 23, 42, 0.8);
                    border: 1px solid rgba(156, 163, 175, 0.2);
                }
                h1 {
                    margin: 0;
                    font-size: 28px;
                    letter-spacing: 0.04em;
                }
                .note {
                    margin: 8px 0 0;
                    font-size: 14px;
                    color: #94a3b8;
                }
                .seats {
                    margin-top: 24px;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 16px;
                }
                .seat-card {
                    background: rgba(15, 23, 42, 0.6);
                    border-radius: 18px;
                    padding: 16px;
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .seat-header {
                    display: flex;
                    justify-content: space-between;
                    font-size: 16px;
                    font-weight: 600;
                }
                .role-name {
                    color: #fbbf24;
                }
                .seat-meta {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }
                .pill {
                    padding: 4px 10px;
                    border-radius: 999px;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-weight: 600;
                }
                .pill.good {
                    background: rgba(16, 185, 129, 0.15);
                    color: #4ade80;
                }
                .pill.evil {
                    background: rgba(239, 68, 68, 0.15);
                    color: #f87171;
                }
                .pill.unknown {
                    background: rgba(148, 163, 184, 0.2);
                    color: #cbd5f5;
                }
                .seat-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }
                .tag {
                    background: rgba(255, 255, 255, 0.08);
                    border-radius: 999px;
                    padding: 4px 10px;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div id="grimoire-root">
                <h1>${view.phaseLabel}</h1>
                ${noteSection}
                ${activeNotes}
                <div class="seats">
                    ${seatRows}
                </div>
            </div>
        </body>
        </html>
    `;
}

export function getRenderEndpoint(jobId: string, expiresAt: number) {
    const token = createRenderToken(jobId, expiresAt);
    return `${BASE_URL}/render/grimoire?token=${encodeURIComponent(token)}`;
}
