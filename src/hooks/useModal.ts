// src/hooks/useModal.ts
import * as React from 'react';
import { useNavigate } from '@tanstack/react-router';

export function useModal() {
    const navigate = useNavigate();

    const open = React.useCallback(
        (modal: ModalKind, opts?: { type?: NightCardType }) => {
            navigate({
                search: (prev: Record<string, unknown>) => ({
                    ...prev,
                    modal,
                    ...(opts?.type ? { type: opts.type } : {})
                }),
                replace: true
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
        },
        [navigate]
    );

    const close = React.useCallback(() => {
        navigate({
            search: (prev: Record<string, unknown>) => {
                const next = { ...(prev ?? {}) };
                delete next.modal;
                delete next.type;
                return next;
            },
            replace: true
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
    }, [navigate]);

    return { open, close };
}
