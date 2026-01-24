import { useEffect } from 'react';
import { ClientOnly } from '@tanstack/react-router';

import { useAppDispatch } from '@/client/state/hooks';
import { getRealtimeUrl } from '@/lib/realtime';
import { wsConnect, wsDisconnect } from '@/client/state/wsMiddleware';

function RealtimeConnectorClient({ userId }: { userId?: string }) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!userId) {
            dispatch(wsDisconnect());
            return;
        }

        const url = getRealtimeUrl();
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

export function RealtimeConnector({ userId }: { userId?: string }) {
    return (
        <ClientOnly fallback={null}>
            <RealtimeConnectorClient userId={userId} />
        </ClientOnly>
    );
}
