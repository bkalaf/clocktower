// src/routes/register.tsx
import { useCallback, useEffect, useMemo } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { RegisterForm } from '../components/auth/RegisterForm';
import { authReturnToSearchSchema } from './auth/-common';

export const Route = createFileRoute('/register')({
    component: RegisterRoute,
    validateSearch: (search) => {
        const parsed = authReturnToSearchSchema.safeParse(search);
        return parsed.success ? parsed.data : {};
    }
});

function RegisterRoute() {
    const { userId } = Route.useRouteContext();
    const navigate = useNavigate();
    const isAuth = useMemo(() => userId != null, [userId]);
    const closeModal = useCallback(() => {
        navigate({ to: '..', replace: true });
    }, [navigate]);

    useEffect(() => {
        if (isAuth) {
            closeModal();
        }
    }, [closeModal, isAuth]);

    return <RegisterForm />;
}
