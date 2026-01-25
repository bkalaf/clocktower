// src/components/Modal.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useState, type ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { dialogBackgroundClassName, dialogBackgroundStyle } from './header/dialogBackground';
import z from 'zod/v4';
import { Form, FormProps } from './forms/Form';

export type ModalProps<TSchema extends z.ZodObject<any>> = {
    children: FormProps<TSchema>['children'];
    returnTo?: string;
    invalidate: () => Promise<void>;
    zodSchema: FormProps<TSchema>['zodSchema'];
    onSubmit: FormProps<TSchema>['onSubmit'];
    defaultValues: FormProps<TSchema>['defaultValues'];
    defaultErrorMsg: FormProps<TSchema>['defaultErrorMsg'];
    title?: ReactNode;
    description?: ReactNode;
    closeOnSubmit?: boolean;
};
export function Modal<TSchema extends z.ZodObject<any>>({
    children,
    returnTo,
    invalidate,
    onSubmit,
    zodSchema,
    defaultValues,
    defaultErrorMsg,
    title = 'Welcome back',
    description = 'Sign in to continue',
    closeOnSubmit = true
}: ModalProps<TSchema>) {
    const navigate = useNavigate();
    const closeModal = useCallback(() => {
        navigate({ to: '..', replace: true });
    }, [navigate]);
    const [serverError, setServerError] = useState<null | string>(null);
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
                className='bg-slate-700 text-white'
                // className={dialogBackgroundClassName}
                // style={dialogBackgroundStyle}
            >
                <DialogHeader>
                    <DialogTitle className='text-white'>{title}</DialogTitle>
                    <DialogDescription className='text-white/80'>{description}</DialogDescription>
                </DialogHeader>
                <Form
                    onSubmit={onSubmit}
                    invalidate={invalidate}
                    returnTo={returnTo}
                    serverError={serverError}
                    setServerError={setServerError}
                    zodSchema={zodSchema}
                    defaultValues={defaultValues}
                    defaultErrorMsg={defaultErrorMsg}
                    closeOnSubmit={closeOnSubmit}
                >
                    {children}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
