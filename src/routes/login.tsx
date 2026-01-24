// src/routes/login.tsx
import { useCallback, useEffect, useMemo } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { LoginForm } from '../components/forms/LoginForm';
import { authReturnToSearchSchema } from './auth/-common';
import { useAppSelector } from '../client/state/hooks';
import { authSelectors } from '../client/state/authSlice';

export const Route = createFileRoute('/login')({
    component: LoginRoute,
    validateSearch: (search) => {
        const parsed = authReturnToSearchSchema.safeParse(search);
        return parsed.success ? parsed.data : {};
    }
});

function LoginRoute() {
    const context = Route.useRouteContext();
    const isAuth = useAppSelector(authSelectors.isAuth)
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
