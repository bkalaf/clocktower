// src/components/forms/ForgotPasswordForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from '@tanstack/react-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { forgotPassword } from '@/lib/api';

const forgotPasswordSchema = z.object({
    email: z.email('Invalid email')
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

type ForgotPasswordFormProps = {
    onSuccess?: () => void;
    returnTo?: string;
};

export function ForgotPasswordForm({ onSuccess, returnTo }: ForgotPasswordFormProps) {
    const safeReturnTo = returnTo ?? '/';
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ''
        }
    });

    return (
        <form
            className='space-y-4'
            onSubmit={handleSubmit(async (values) => {
                setServerError(null);
                try {
                    await forgotPassword(values.email);
                    reset();
                    setSubmitted(true);
                    onSuccess?.();
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Unable to send reset email';
                    setServerError(message);
                }
            })}
        >
            <div className='space-y-1 text-sm'>
                <Label
                    htmlFor='forgot-password-email'
                    className='font-semibold text-white'
                >
                    E-mail
                </Label>
                <Input
                    id='forgot-password-email'
                    type='email'
                    autoComplete='email'
                    placeholder='you@example.com'
                    {...register('email')}
                />
                {errors.email && <p className='text-xs text-red-500'>{errors.email.message}</p>}
            </div>
            <div className='flex justify-end text-sm'>
                <Link
                    to='/login'
                    search={{ returnTo: safeReturnTo }}
                    className='text-cyan-400 hover:text-cyan-300'
                >
                    Back to login
                </Link>
            </div>
            {serverError && <p className='text-sm text-red-500'>{serverError}</p>}
            {submitted && (
                <p className='text-sm text-emerald-300'>
                    If an account exists, you will receive an email with reset instructions shortly.
                </p>
            )}
            <Button
                type='submit'
                disabled={isSubmitting || submitted}
                className='w-full'
            >
                {submitted ? 'Email Sent' : 'Send reset link'}
            </Button>
        </form>
    );
}
