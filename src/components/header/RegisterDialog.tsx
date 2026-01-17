import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { WHOAMI_QUERY_KEY } from '@/hooks/useAuthUser';

type RegisterDialogProps = {
    open: boolean;
    onClose: () => void;
};

export function RegisterDialog({ open, onClose }: RegisterDialogProps) {
    const queryClient = useQueryClient();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        verificationPassword: ''
    });
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
            onClose={onClose}
            title='Create an account'
            description='We only ask for what we need'
        >
            <form
                className='space-y-4'
                onSubmit={async (event) => {
                    event.preventDefault();
                    setError(null);

                    if (form.password !== form.verificationPassword) {
                        setError('Passwords must match');
                        return;
                    }

                    setIsLoading(true);
                    try {
                        const response = await fetch('/api/auth/register', {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                name: form.name,
                                email: form.email,
                                password: form.password,
                                verificationPassword: form.verificationPassword
                            })
                        });

                        if (!response.ok) {
                            const body = await response.json().catch(() => null);
                            setError(body?.message ?? 'Registration failed');
                            return;
                        }

                        await queryClient.invalidateQueries({ queryKey: WHOAMI_QUERY_KEY });
                        setForm({
                            name: '',
                            email: '',
                            password: '',
                            verificationPassword: ''
                        });
                        onClose();
                    } catch (err) {
                        setError('Unable to create account');
                    } finally {
                        setIsLoading(false);
                    }
                }}
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
                        required
                        value={form.name}
                        onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                        autoComplete='name'
                    />
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
                        required
                        value={form.email}
                        onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                        autoComplete='email'
                    />
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
                        minLength={8}
                        required
                        value={form.password}
                        onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                        autoComplete='new-password'
                    />
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
                        minLength={8}
                        required
                        value={form.verificationPassword}
                        onChange={(event) => setForm((prev) => ({ ...prev, verificationPassword: event.target.value }))}
                        autoComplete='new-password'
                    />
                </div>
                {error && <p className='text-sm text-red-500'>{error}</p>}
                <Button
                    type='submit'
                    disabled={isLoading}
                    className='w-full'
                    variant='default'
                >
                    {isLoading ? 'Registering…' : 'Register'}
                </Button>
            </form>
        </Dialog>
    );
}
