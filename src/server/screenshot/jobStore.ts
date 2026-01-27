// src/server/screenshot/jobStore.ts
import { randomUUID } from 'crypto';
import type { ScreenshotJob, ScreenshotPolicy, ScreenshotStatus, GrimoireViewModel, MisinfoPlan } from './types';

const ACK_TIMEOUT_DEFAULT = 30_000;

const jobs = new Map<string, ScreenshotJob>();
const ackResolvers = new Map<string, (value: 'ack' | 'timeout') => void>();

export function createScreenshotJob(args: {
    matchId: string;
    roomId: string;
    gameId: string;
    phaseId: string;
    seatId: number;
    recipientPlayerId: string;
    policy: ScreenshotPolicy;
    seed: string;
    revisionHash: string;
    viewModel?: GrimoireViewModel;
    misinfoPlan?: MisinfoPlan;
    expiresAt?: number;
}): ScreenshotJob {
    const now = Date.now();
    const job: ScreenshotJob = {
        id: randomUUID(),
        gameId: args.gameId,
        matchId: args.matchId,
        roomId: args.roomId,
        phaseId: args.phaseId,
        seatId: args.seatId,
        recipientPlayerId: args.recipientPlayerId,
        policy: args.policy,
        seed: args.seed,
        revisionHash: args.revisionHash,
        status: 'queued',
        expiresAt: args.expiresAt ?? now + ACK_TIMEOUT_DEFAULT,
        viewModel: args.viewModel,
        misinfoPlan: args.misinfoPlan,
        createdAt: now
    };
    jobs.set(job.id, job);
    return job;
}

export function getScreenshotJob(jobId: string) {
    return jobs.get(jobId);
}

export function updateScreenshotJob(jobId: string, patch: Partial<ScreenshotJob>) {
    const job = jobs.get(jobId);
    if (!job) return;
    const updated = { ...job, ...patch };
    jobs.set(jobId, updated);
    return updated;
}

export function markJobRendering(jobId: string) {
    return updateScreenshotJob(jobId, { status: 'rendering' });
}

export function completeJob(jobId: string, pngBuffer: Buffer) {
    return updateScreenshotJob(jobId, { status: 'done', pngBuffer });
}

export function failJob(jobId: string, message: string) {
    return updateScreenshotJob(jobId, { status: 'failed', lastError: message });
}

export function waitForJobAck(jobId: string, timeoutMs?: number) {
    return new Promise<'ack' | 'timeout'>((resolve) => {
        const existing = ackResolvers.get(jobId);
        if (existing) {
            existing('timeout');
        }
        const timer = setTimeout(() => {
            ackResolvers.delete(jobId);
            resolve('timeout');
        }, timeoutMs ?? ACK_TIMEOUT_DEFAULT);
        ackResolvers.set(jobId, (value) => {
            clearTimeout(timer);
            resolve(value);
            ackResolvers.delete(jobId);
        });
    });
}

export function acknowledgeJob(jobId: string) {
    const resolver = ackResolvers.get(jobId);
    if (resolver) {
        resolver('ack');
    }
    updateScreenshotJob(jobId, { ackedAt: Date.now() });
}

export function allJobs() {
    return Array.from(jobs.values());
}

export function pendingJobs() {
    return Array.from(jobs.values()).filter((job) => job.status !== 'done' && job.status !== 'failed');
}
