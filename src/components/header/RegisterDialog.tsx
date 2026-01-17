// src/components/header/RegisterDialog.tsx
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

type RegisterDialogProps = {
    open: boolean;
    onClose: () => void;
};

const registerSchema = z
    .object({
        name: z.string().min(2, 'Full name is required'),
        email: z.string().email('Invalid email'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        verificationPassword: z.string().min(8, 'Password confirmation is required')
    })
    .refine((data) => data.password === data.verificationPassword, {
        message: 'Passwords must match',
        path: ['verificationPassword']
    });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterDialog({ open, onClose }: RegisterDialogProps) {
    const queryClient = useQueryClient();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            verificationPassword: ''
        }
    });

    useEffect(() => {
        if (!open) {
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create an account</DialogTitle>
                    <DialogDescription>We only ask for what we need</DialogDescription>
                </DialogHeader>
                <form
                    className='space-y-4'
                    onSubmit={handleSubmit(async (values) => {
                        setServerError(null);
                        try {
                            const response = await fetch('/api/auth/register', {
                                method: 'POST',
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(values)
                            });

                            if (!response.ok) {
                                const body = await response.json().catch(() => null);
                                setServerError(body?.message ?? 'Registration failed');
                                return;
                            }

                            await queryClient.invalidateQueries({ queryKey: WHOAMI_QUERY_KEY });
                            reset();
                            onClose();
                        } catch (err) {
                            setServerError('Unable to create account');
                        }
                    })}
                >
                    <div className='space-y-1 text-sm'>
                        <label
                            htmlFor='register-name'
                            className='font-semibold text-gray-700'
                        >
                            Full name
                        </label>
                        <Input
                            id='register-name'
                            type='text'
                            autoComplete='name'
                            {...register('name')}
                        />
                        {errors.name && <p className='text-xs text-red-500'>{errors.name.message}</p>}
                    </div>
                    <div className='space-y-1 text-sm'>
                        <label
                            htmlFor='register-email'
                            className='font-semibold text-gray-700'
                        >
                            Email
                        </label>
                        <Input
                            id='register-email'
                            type='email'
                            autoComplete='email'
                            {...register('email')}
                        />
                        {errors.email && <p className='text-xs text-red-500'>{errors.email.message}</p>}
                    </div>
                    <div className='space-y-1 text-sm'>
                        <label
                            htmlFor='register-password'
                            className='font-semibold text-gray-700'
                        >
                            Password
                        </label>
                        <Input
                            id='register-password'
                            type='password'
                            autoComplete='new-password'
                            {...register('password')}
                        />
                        {errors.password && <p className='text-xs text-red-500'>{errors.password.message}</p>}
                    </div>
                    <div className='space-y-1 text-sm'>
                        <label
                            htmlFor='register-verification-password'
                            className='font-semibold text-gray-700'
                        >
                            Confirm password
                        </label>
                        <Input
                            id='register-verification-password'
                            type='password'
                            autoComplete='new-password'
                            {...register('verificationPassword')}
                        />
                        {errors.verificationPassword && (
                            <p className='text-xs text-red-500'>{errors.verificationPassword.message}</p>
                        )}
                    </div>
                    {serverError && <p className='text-sm text-red-500'>{serverError}</p>}
                    <DialogFooter className='pt-0'>
                        <Button
                            type='submit'
                            disabled={isSubmitting}
                            className='w-full'
                            variant='default'
                        >
                            {isSubmitting ? 'Registering…' : 'Register'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
