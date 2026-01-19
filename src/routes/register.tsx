// src/routes/register.tsx
import { useCallback, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RegisterForm } from '../components/auth/RegisterForm';
import { dialogBackgroundClassName, dialogBackgroundStyle } from '@/components/header/dialogBackground';
import { useAuth } from '@/state/useAuth';
import { authReturnToSearchSchema, normalizeReturnTo } from './auth/-common';

export const Route = createFileRoute('/register')({
    component: RegisterRoute,
    validateSearch: (search) => {
        const parsed = authReturnToSearchSchema.safeParse(search);
        return parsed.success ? parsed.data : {};
    }
});

function RegisterRoute() {
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
                    <DialogTitle className='text-white'>Create an account</DialogTitle>
                    <DialogDescription className='text-white/80'>We only ask for what we need</DialogDescription>
                </DialogHeader>
                <RegisterForm
                    onSuccess={handleSuccess}
                    returnTo={normalizedReturnTo}
                />
            </DialogContent>
        </Dialog>
    );
}
