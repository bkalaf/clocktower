// src/routes/game/grim.tsx
import { useEffect, useRef } from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { whoamiFn } from '@/lib/api';

const WINDOW_FEATURES = 'width=1100,height=820,resizable,scrollbars,noopener';

export const Route = createFileRoute('/game/grim')({
    loader: async () => {
        const { user } = await whoamiFn();
        if (!user) {
            redirect({ to: '/login' });
        }
        return null;
    },
    component: GameGrimProxy
});

function GameGrimProxy() {
    const popupRef = useRef<Window | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (popupRef.current && !popupRef.current.closed) {
            popupRef.current.focus();
            return;
        }
        const popup = window.open('/game/grim/window', 'game-grim-window', WINDOW_FEATURES);
        if (popup) {
            popupRef.current = popup;
        } else {
            console.warn('Game grim popup was blocked by the browser.');
        }
    }, []);

    useEffect(() => {
        return () => {
            if (popupRef.current && !popupRef.current.closed) {
                popupRef.current.close();
            }
            popupRef.current = null;
        };
    }, []);

    return null;
}
