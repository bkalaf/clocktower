// src/components/header/LoginDialog.tsx
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { WHOAMI_QUERY_KEY } from '@/hooks/useAuthUser';
import { dialogBackgroundClassName, dialogBackgroundStyle } from './dialogBackground';
import { useNavigate } from '@tanstack/react-router';

type LoginDialogProps = {
    open: boolean;
    onClose: () => void;
};

const loginSchema = z.object({
    email: z.email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters')
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginDialog({ open, onClose }: LoginDialogProps) {
    const queryClient = useQueryClient();
    const [serverError, setServerError] = useState<string | null>(null);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    useEffect(() => {
        if (!open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setServerError(null);
            reset();
        }
    }, [open, reset]);

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    onClose();
                }
            }}
        >
            <DialogContent
                className={dialogBackgroundClassName}
                style={dialogBackgroundStyle}
            >
                <DialogHeader>
                    <DialogTitle className='text-white'>Login</DialogTitle>
                    <DialogDescription className='text-white/80'>Enter your credentials to continue</DialogDescription>
                </DialogHeader>
                <form
                    className='space-y-4'
                    onSubmit={handleSubmit(async (values) => {
                        setServerError(null);
                        try {
                            const response = await fetch('/api/auth/login', {
                                method: 'POST',
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(values)
                            });

                            if (!response.ok) {
                                const body = await response.json().catch(() => null);
                                setServerError(body?.message ?? 'Login failed');
                                return;
                            }

                            await queryClient.invalidateQueries({ queryKey: WHOAMI_QUERY_KEY });
                            reset();
                            onClose();
                            navigate({ to: '/' });
                        } catch (err) {
                            setServerError('Unable to log in');
                        }
                    })}
                >
                    <div className='space-y-1 text-sm'>
                        <label
                            htmlFor='login-email'
                            className='font-semibold text-white'
                        >
                            Email
                        </label>
                        <Input
                            id='login-email'
                            type='email'
                            autoComplete='email'
                            placeholder='you@example.com'
                            {...register('email')}
                        />
                        {errors.email && <p className='text-xs text-red-500'>{errors.email.message}</p>}
                    </div>
                    <div className='space-y-1 text-sm'>
                        <label
                            htmlFor='login-password'
                            className='font-semibold text-white'
                        >
                            Password
                        </label>
                        <Input
                            id='login-password'
                            type='password'
                            autoComplete='current-password'
                            {...register('password')}
                        />
                        {errors.password && <p className='text-xs text-red-500'>{errors.password.message}</p>}
                    </div>
                    {serverError && <p className='text-sm text-red-500'>{serverError}</p>}
                    <DialogFooter className='pt-0'>
                        <Button
                            type='submit'
                            disabled={isSubmitting}
                            className='w-full'
                        >
                            {isSubmitting ? 'Logging in…' : 'Log in'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
