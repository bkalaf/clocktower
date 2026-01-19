// src/components/auth/RegisterForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from '@tanstack/react-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { register as registerRequest } from '@/lib/api';

const registerSchema = z
    .object({
        username: z.string().min(2, 'Full name is required'),
        email: z.email('Invalid email'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        verificationPassword: z.string().min(8, 'Password confirmation is required')
    })
    .refine((data) => data.password === data.verificationPassword, {
        message: 'Passwords must match',
        path: ['verificationPassword']
    });

type RegisterFormValues = z.infer<typeof registerSchema>;

type RegisterFormProps = {
    onSuccess: () => Promise<void> | void;
    returnTo?: string;
};

export function RegisterForm({ onSuccess, returnTo }: RegisterFormProps) {
    const safeReturnTo = returnTo ?? '/';
    const [serverError, setServerError] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            verificationPassword: ''
        }
    });

    return (
        <form
            className='space-y-4'
            onSubmit={handleSubmit(async (values) => {
                setServerError(null);
                try {
                    await registerRequest(values.username, values.email, values.password, values.verificationPassword);
                    reset();
                    await onSuccess();
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Unable to create account';
                    setServerError(message);
                }
            })}
        >
            <div className='space-y-1 text-sm'>
                <Label
                    htmlFor='register-name'
                    className='font-semibold text-white'
                >
                    Your user name
                </Label>
                <Input
                    id='register-username'
                    type='text'
                    autoComplete='name'
                    {...register('username')}
                />
                {errors.username && <p className='text-xs text-red-500'>{errors.username.message}</p>}
            </div>
            <div className='space-y-1 text-sm'>
                <Label
                    htmlFor='register-email'
                    className='font-semibold text-white'
                >
                    E-mail
                </Label>
                <Input
                    id='register-email'
                    type='email'
                    autoComplete='email'
                    {...register('email')}
                />
                {errors.email && <p className='text-xs text-red-500'>{errors.email.message}</p>}
            </div>
            <div className='space-y-1 text-sm'>
                <Label
                    htmlFor='register-password'
                    className='font-semibold text-white'
                >
                    Password
                </Label>
                <Input
                    id='register-password'
                    type='password'
                    autoComplete='new-password'
                    {...register('password')}
                />
                {errors.password && <p className='text-xs text-red-500'>{errors.password.message}</p>}
            </div>
            <div className='space-y-1 text-sm'>
                <Label
                    htmlFor='register-verification-password'
                    className='font-semibold text-white'
                >
                    Confirm password
                </Label>
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
            <div className='flex justify-end text-sm'>
                <Link
                    to='/login'
                    search={{ returnTo: safeReturnTo }}
                    className='text-cyan-400 hover:text-cyan-300'
                >
                    Already have an account?
                </Link>
            </div>
            {serverError && <p className='text-sm text-red-500'>{serverError}</p>}
            <Button
                type='submit'
                disabled={isSubmitting}
                className='w-full'
                variant='default'
            >
                {isSubmitting ? 'Registering…' : 'Register'}
            </Button>
        </form>
    );
}
