import path from 'node:path';
import { appendFile, mkdir } from 'node:fs/promises';

export function getDailyLogFilePath(logDir: string, date = new Date()) {
    const day = date.toISOString().slice(0, 10);
    return path.join(logDir, `${day}.log`);
}

export async function appendLog(logDir: string | undefined, entry: Record<string, unknown>) {
    if (!logDir) return;
    try {
        await mkdir(logDir, { recursive: true });
        const logEntry = { timestamp: entry.timestamp ?? new Date().toISOString(), ...entry };
        const line = `${JSON.stringify(logEntry)}\n`;
        await appendFile(getDailyLogFilePath(logDir), line, 'utf8');
    } catch (error) {
        console.error('Failed to append log entry', error);
    }
}
