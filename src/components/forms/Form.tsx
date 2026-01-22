// src/components/forms/Form.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useTransition, useCallback } from 'react';
import { DeepPartial, UseFormReturn, useForm } from 'react-hook-form';
import z from 'zod/v4';
import { DialogFooter } from '../ui';
import { Button } from '@/components/ui/button';
import React from 'react';

export type FormProps<TSchema extends z.ZodObject<any>> = {
    zodSchema: TSchema;
    defaultValues?: DeepPartial<z.infer<TSchema>>;
    onSubmit: (values: z.infer<TSchema>, form: UseFormReturn<z.infer<TSchema>>) => void | Promise<void>;
    children: (form: UseFormReturn<z.infer<TSchema>>) => React.JSX.Element;
    defaultErrorMsg?: string;
    invalidate: () => Promise<void>;
    serverError: string | null;
    setServerError: (error: string | null) => void;
    returnTo?: string;
    closeOnSubmit?: boolean;
};

export function Form<TSchema extends z.ZodObject<any>>({
    children,
    invalidate,
    serverError,
    setServerError,
    defaultErrorMsg,
    onSubmit,
    defaultValues,
    zodSchema,
    returnTo,
    closeOnSubmit = true
}: FormProps<TSchema>) {
    const navigate = useNavigate();
    const [, startTransition] = useTransition();
    const closeForm = useCallback(() => {
        navigate({ to: returnTo ?? '..', replace: true });
    }, [navigate, returnTo]);
    const form = useForm<z.infer<TSchema>>({
        resolver: zodResolver(zodSchema) as any,

        defaultValues: defaultValues as any
    });
    const {
        handleSubmit,
        reset,
        formState: { isSubmitting }
    } = form;
    return (
        <form
            className='space-y-4'
            onSubmit={handleSubmit(async (values) => {
                setServerError(null);
                try {
                    await onSubmit(values, form);
                    reset();
                    if (closeOnSubmit) {
                        startTransition(closeForm);
                    }
                    await invalidate();
                } catch (error) {
                    const message = (error instanceof Error ? error.message : defaultErrorMsg) ?? '';
                    setServerError(message);
                }
            })}
        >
            {children(form)}
            {/*             
            <div className='space-y-1 text-sm'>
                <Label
                    htmlFor='login-email'
                    className='font-semibold text-white'
                >
                    E-mail
                </Label>
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
                <Label
                    htmlFor='login-password'
                    className='font-semibold text-white'
                >
                    Password
                </Label>
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
            </div> */}
            {serverError && <p className='text-sm text-red-500'>{serverError}</p>}
            <DialogFooter>
                <Button
                    type='button'
                    variant='secondary'
                    disabled={isSubmitting}
                    onClick={() => {
                        reset();
                        startTransition(closeForm);
                    }}
                >
                    Cancel
                </Button>
                <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full'
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            </DialogFooter>
        </form>
    );
}
