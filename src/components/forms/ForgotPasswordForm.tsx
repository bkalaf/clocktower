// src/components/forms/ForgotPasswordForm.tsx
import { useCallback, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { forgotPassword } from '@/lib/api';
import { FormControl } from './FormControl';
import { Modal } from '../Modal';
import { useInvalidateAuth } from '../useInvalidateAuth';

const forgotPasswordSchema = z.object({
    email: z.email('Invalid email')
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

type ForgotPasswordFormProps = {
    onSuccess?: () => void;
    returnTo?: string;
};

type ForgotPasswordControlsProps = {
    formName: string;
    safeReturnTo: string;
    submitted: boolean;
};

function ForgotPasswordControls({ formName, safeReturnTo, submitted }: ForgotPasswordControlsProps) {
    return function RenderForgotPasswordControls(form: UseFormReturn<ForgotPasswordFormValues>) {
        const {
            register,
            formState: { errors }
        } = form;
        return (
            <>
                <div className='space-y-1 text-sm'>
                    <FormControl
                        label='E-mail'
                        formName={formName}
                        register={register}
                        errors={errors}
                        name='email'
                        type='email'
                        autoComplete='email'
                        placeholder='you@example.com'
                    />
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
                {submitted && (
                    <p className='text-sm text-emerald-300'>
                        If an account exists, you will receive an email with reset instructions shortly.
                    </p>
                )}
            </>
        );
    };
}

export function ForgotPasswordForm({ onSuccess, returnTo }: ForgotPasswordFormProps) {
    const invalidate = useInvalidateAuth();
    const [submitted, setSubmitted] = useState(false);
    const safeReturnTo = returnTo ?? '/';
    const onSubmit = useCallback(
        async (values: ForgotPasswordFormValues) => {
            setSubmitted(false);
            await forgotPassword(values.email);
            setSubmitted(true);
            onSuccess?.();
        },
        [onSuccess]
    );

    return (
        <Modal
            title='Reset your password'
            description="Enter your email and we'll send you reset instructions."
            zodSchema={forgotPasswordSchema}
            defaultValues={{ email: '' }}
            defaultErrorMsg='Unable to send reset email'
            invalidate={invalidate}
            onSubmit={onSubmit}
            returnTo={returnTo}
            closeOnSubmit={false}
        >
            {ForgotPasswordControls({
                formName: 'forgot-password',
                safeReturnTo,
                submitted
            })}
        </Modal>
    );
}
