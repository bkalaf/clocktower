// src/components/auth/LoginForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from '@tanstack/react-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { login } from '@/lib/api';

const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters')
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
    onSuccess: () => Promise<void> | void;
    returnTo?: string;
};

export function LoginForm({ onSuccess, returnTo }: LoginFormProps) {
    const safeReturnTo = returnTo ?? '/';
    const [serverError, setServerError] = useState<string | null>(null);
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

    return (
        <form
            className='space-y-4'
            onSubmit={handleSubmit(async (values) => {
                setServerError(null);
                try {
                    await login(values.email, values.password);
                    reset();
                    await onSuccess();
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Unable to log in';
                    setServerError(message);
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
            <div className='flex justify-end text-sm'>
                <Link
                    to='/forgot-password'
                    search={{ returnTo: safeReturnTo }}
                    className='text-cyan-400 hover:text-cyan-300'
                >
                    Forgot password?
                </Link>
            </div>
            {serverError && <p className='text-sm text-red-500'>{serverError}</p>}
            <Button
                type='submit'
                disabled={isSubmitting}
                className='w-full'
            >
                {isSubmitting ? 'Logging in…' : 'Log in'}
            </Button>
        </form>
    );
}
