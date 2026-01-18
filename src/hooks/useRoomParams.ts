// src/hooks/useRoomParams.ts
import { useEffect, useState } from 'react';

function getParams() {
    if (typeof window === 'undefined') {
        return { roomId: null, matchId: null };
    }
    const search = window.location.search;
    const query = new URLSearchParams(search);
    return { roomId: query.get('roomId'), matchId: query.get('matchId') };
}

export function useRoomParams() {
    const [params, setParams] = useState(() => getParams());

    useEffect(() => {
        const handle = () => setParams(getParams());
        window.addEventListener('popstate', handle);
        return () => {
            window.removeEventListener('popstate', handle);
        };
    }, []);

    return params;
}
