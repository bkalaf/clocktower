// src/components/header/LoginDialog.tsx
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

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

type LoginDialogProps = {
    open: boolean;
    onClose: () => void;
};

export function LoginDialog({ open, onClose }: LoginDialogProps) {
    const queryClient = useQueryClient();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setError(null);
        }
    }, [open]);

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
                    <DialogTitle>Login</DialogTitle>
                    <DialogDescription>Enter your credentials to continue</DialogDescription>
                </DialogHeader>
                <form
                    className='space-y-4'
                    onSubmit={async (event) => {
                        event.preventDefault();
                        setError(null);
                        setIsLoading(true);
                        try {
                            const response = await fetch('/api/auth/login', {
                                method: 'POST',
                                credentials: 'include',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    email: form.email,
                                    password: form.password
                                })
                            });

                            if (!response.ok) {
                                const body = await response.json().catch(() => null);
                                setError(body?.message ?? 'Login failed');
                                return;
                            }

                            await queryClient.invalidateQueries({ queryKey: WHOAMI_QUERY_KEY });
                            setForm({ email: '', password: '' });
                            onClose();
                        } catch (err) {
                            setError('Unable to log in');
                        } finally {
                            setIsLoading(false);
                        }
                    }}
                >
                    <div className='space-y-1 text-sm'>
                        <label
                            htmlFor='login-email'
                            className='font-semibold text-gray-700'
                        >
                            Email
                        </label>
                        <Input
                            id='login-email'
                            type='email'
                            required
                            value={form.email}
                            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                            autoComplete='email'
                            placeholder='you@example.com'
                        />
                    </div>
                    <div className='space-y-1 text-sm'>
                        <label
                            htmlFor='login-password'
                            className='font-semibold text-gray-700'
                        >
                            Password
                        </label>
                        <Input
                            id='login-password'
                            type='password'
                            required
                            minLength={8}
                            value={form.password}
                            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                            autoComplete='current-password'
                        />
                    </div>
                    {error && <p className='text-sm text-red-500'>{error}</p>}
                    <DialogFooter className='pt-0'>
                        <Button
                            type='submit'
                            disabled={isLoading}
                            className='w-full'
                        >
                            {isLoading ? 'Logging in…' : 'Log in'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
