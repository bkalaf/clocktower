// src/routes/_authed.rooms._room.$roomId._st.tsx
import { useEffect, useRef } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { loadPrivilegedUser } from '@/routes/_authed/-privilegedLoader';

const WINDOW_FEATURES = 'width=1200,height=840,resizable,scrollbars,noopener';

export const Route = createFileRoute('/_authed/rooms/_room/$roomId/_st')({
    loader: async () => {
        await loadPrivilegedUser();
        return null;
    },
    component: StorytellerReviewProxy
});

function StorytellerReviewProxy() {
    const { roomId } = Route.useParams();
    const popupRef = useRef<Window | null>(null);
    const popupRoomRef = useRef<string | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !roomId) {
            return;
        }

        if (popupRoomRef.current && popupRoomRef.current !== roomId) {
            if (popupRef.current && !popupRef.current.closed) {
                popupRef.current.close();
            }
            popupRef.current = null;
            popupRoomRef.current = null;
        }

        if (popupRef.current && !popupRef.current.closed) {
            popupRef.current.focus();
            popupRoomRef.current = roomId;
            return;
        }

        const target = `/rooms/${encodeURIComponent(roomId)}/st/window`;
        const popup = window.open(target, `storyteller-review-${roomId}`, WINDOW_FEATURES);
        if (popup) {
            popupRef.current = popup;
            popupRoomRef.current = roomId;
        } else {
            console.warn('Storyteller review popup was blocked or failed to open.');
        }
    }, [roomId]);

    useEffect(() => {
        return () => {
            if (popupRef.current && !popupRef.current.closed) {
                popupRef.current.close();
            }
            popupRef.current = null;
            popupRoomRef.current = null;
        };
    }, []);

    return null;
}
