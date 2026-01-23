// src/routes/scripts/new.tsx
import { useEffect } from 'react';
import { createFileRoute, useLocation } from '@tanstack/react-router';

import { useModal } from '@/hooks/useModal';

export const Route = createFileRoute('/scripts/new')({
    component: ScriptNewRoute
});

type ScriptRouteState = {
    returnTo?: string;
};

function ScriptNewRoute() {
    const { open } = useModal();
    const location = useLocation();
    const state = location.state as ScriptRouteState | undefined;
    const returnTo = state?.returnTo ?? '/';

    useEffect(() => {
        open('createScript', { search: { returnTo } });
    }, [open, returnTo]);

    return null;
}
