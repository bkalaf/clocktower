// src/client/dev/DevGrimoirePanel.tsx
import { useState } from 'react';

export function DevGrimoirePanel({ roomId, matchId }: { roomId: string; matchId: string }) {
    if (!import.meta.env.DEV) return null;
    if (!roomId || !matchId) return null;

    const [open, setOpen] = useState(false);
    const [data, setData] = useState<any>(null);
    const [err, setErr] = useState<string | null>(null);

    const load = async () => {
        setErr(null);
        try {
            const res = await fetch(
                `/api/dev/grimoire?roomId=${encodeURIComponent(roomId)}&matchId=${encodeURIComponent(matchId)}`,
                {
                    credentials: 'include'
                }
            );
            if (!res.ok) {
                setErr(`Failed: ${res.status}`);
                return;
            }
            const json = await res.json();
            setData(json);
        } catch (error) {
            setErr(error instanceof Error ? error.message : 'Unknown error');
        }
    };

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: 12,
                    right: 12,
                    zIndex: 9999
                }}
            >
                Dev Grimoire
            </button>
        );
    }

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 12,
                right: 12,
                width: 420,
                height: 520,
                overflow: 'auto',
                background: 'white',
                border: '1px solid #ccc',
                padding: 12,
                zIndex: 9999
            }}
        >
            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
                <strong>Dev Grimoire</strong>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={load}>Refresh</button>
                    <button onClick={() => setOpen(false)}>Close</button>
                </div>
            </div>
            {err ?
                <div style={{ color: 'crimson' }}>{err}</div>
            :   null}
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>
                {data ? JSON.stringify(data, null, 2) : 'No data loaded'}
            </pre>
        </div>
    );
}
