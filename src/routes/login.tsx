// src/routes/login.tsx
import { useCallback, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoginForm } from '../components/auth/LoginForm';
import { dialogBackgroundClassName, dialogBackgroundStyle } from '@/components/header/dialogBackground';
import { useAuth } from '@/state/useAuth';
import { authReturnToSearchSchema, normalizeReturnTo } from './auth/-common';

export const Route = createFileRoute('/login')({
    component: LoginRoute,
    validateSearch: (search) => {
        const parsed = authReturnToSearchSchema.safeParse(search);
        return parsed.success ? parsed.data : {};
    }
});

function LoginRoute() {
    const navigate = useNavigate();
    const { refreshWhoami, user, loading } = useAuth();
    const { returnTo } = Route.useSearch();
    const normalizedReturnTo = normalizeReturnTo(returnTo);

    const closeModal = useCallback(() => {
        navigate({ to: normalizedReturnTo, replace: true });
    }, [navigate, normalizedReturnTo]);

    useEffect(() => {
        if (!loading && user) {
            closeModal();
        }
    }, [user, loading, closeModal]);

    const handleSuccess = useCallback(async () => {
        await refreshWhoami();
        closeModal();
    }, [refreshWhoami, closeModal]);

    return (
        <Dialog
            open
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    closeModal();
                }
            }}
        >
            <DialogContent
                className={dialogBackgroundClassName}
                style={dialogBackgroundStyle}
            >
                <DialogHeader>
                    <DialogTitle className='text-white'>Welcome back</DialogTitle>
                    <DialogDescription className='text-white/80'>Sign in to continue</DialogDescription>
                </DialogHeader>
                <LoginForm
                    onSuccess={handleSuccess}
                    returnTo={normalizedReturnTo}
                />
            </DialogContent>
        </Dialog>
    );
}
