// src/routes/forgot-password.tsx
import { useCallback } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ForgotPasswordForm } from '../components/forms/ForgotPasswordForm';
import { dialogBackgroundClassName, dialogBackgroundStyle } from '@/components/header/dialogBackground';
import { authReturnToSearchSchema, normalizeReturnTo } from './auth/-common';

export const Route = createFileRoute('/forgot-password')({
    component: ForgotPasswordRoute,
    validateSearch: (search) => {
        const parsed = authReturnToSearchSchema.safeParse(search);
        return parsed.success ? parsed.data : {};
    }
});

function ForgotPasswordRoute() {
    const navigate = useNavigate();
    const { returnTo } = Route.useSearch();
    const normalizedReturnTo = normalizeReturnTo(returnTo);

    const closeModal = useCallback(() => {
        navigate({ to: normalizedReturnTo, replace: true });
    }, [navigate, normalizedReturnTo]);

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
                    <DialogTitle className='text-white'>Reset your password</DialogTitle>
                    <DialogDescription className='text-white/80'>
                        Enter your email and we&apos;ll send you reset instructions.
                    </DialogDescription>
                </DialogHeader>
                <ForgotPasswordForm returnTo={normalizedReturnTo} />
            </DialogContent>
        </Dialog>
    );
}
