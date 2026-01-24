// src/components/RealtimeConnector.tsx
import { useEffect } from 'react';
import { ClientOnly } from '@tanstack/react-router';

import { useAppDispatch, useAppSelector } from '@/client/state/hooks';
import { getRealtimeUrl } from '@/lib/realtime';
import { wsConnect, wsDisconnect } from '@/client/state/wsMiddleware';
import { authSelectors } from '../client/state/authSlice';

function RealtimeConnectorClient({ userId }: { userId?: string }) {
    console.log(`RealmtimeConnectorClient`);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!userId) {
            dispatch(wsDisconnect());
            return;
        }

        const url = getRealtimeUrl();
        console.log(`realtime url`, url);
        if (!url) {
            return;
        }

        dispatch(wsConnect({ url }));

        return () => {
            dispatch(wsDisconnect());
        };
    }, [dispatch, userId]);

    return null;
}

export function RealtimeConnector() {
    const userId = useAppSelector(authSelectors.selectUserId);
    return (
        <ClientOnly fallback={null}>
            <RealtimeConnectorClient userId={userId} />
        </ClientOnly>
    );
}
