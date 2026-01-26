// src/routes/_unauthed.login.tsx
import { useCallback, useEffect, useMemo } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAppSelector } from '../client/state/hooks';
import { realtimeSelectors } from '../client/state/realtimeSlice';
import { LoginForm } from '../components/forms/LoginForm';
import { authReturnToSearchSchema } from './_unauthed/auth/-common';

export const Route = createFileRoute('/_unauthed/login')({
    component: LoginRoute,
    validateSearch: (search) => {
        const parsed = authReturnToSearchSchema.safeParse(search);
        return parsed.success ? parsed.data : {};
    }
});

function LoginRoute() {
    const context = Route.useRouteContext();
    const isAuth = useAppSelector(realtimeSelectors.selectIsAuth);
    const navigate = useNavigate();
    const { returnTo } = Route.useSearch();

    const closeModal = useCallback(() => {
        navigate({ to: returnTo ?? '..', replace: true });
    }, [navigate, returnTo]);

    useEffect(() => {
        if (isAuth) {
            closeModal();
        }
    }, [closeModal, isAuth]);

    return <LoginForm />;
}
