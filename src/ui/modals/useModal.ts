import * as React from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { ModalKind, NightCardType } from '../../router/search';

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
            });
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
        });
    }, [navigate]);

    return { open, close };
}
