import type { ReactElement, ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { LoginDialog, LogoutDialog, RegisterDialog, TopBar } from './index';
import { WHOAMI_QUERY_KEY } from '@/hooks/useAuthUser';

jest.mock('@tanstack/react-router', () => ({
    Link: ({ children }: { children: ReactNode }) => <a>{children}</a>
}));

const originalFetch = globalThis.fetch;

const createClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false
            }
        }
    });

const renderWithClient = (ui: ReactElement) => {
    const queryClient = createClient();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    return { ...render(ui, { wrapper }), queryClient, invalidateSpy };
};

afterEach(() => {
    jest.restoreAllMocks();
    globalThis.fetch = originalFetch;
});

describe('TopBar', () => {
    it('shows login/register when anonymous', () => {
        const noop = jest.fn();
        render(
            <TopBar
                user={null}
                isAuthLoading={false}
                onMenuOpen={noop}
                onOpenLogin={noop}
                onOpenRegister={noop}
                onOpenLogout={noop}
            />
        );

        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    it('shows logout and avatar when user is present', () => {
        const noop = jest.fn();
        render(
            <TopBar
                user={{
                    userId: 'user:1',
                    name: 'Tester',
                    email: 'test@example.com',
                    roles: ['user']
                }}
                isAuthLoading={false}
                onMenuOpen={noop}
                onOpenLogin={noop}
                onOpenRegister={noop}
                onOpenLogout={noop}
            />
        );

        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
        expect(screen.getByText('Tester')).toBeInTheDocument();
    });
});

describe('LoginDialog', () => {
    it('submits credentials and invalidates whoami', async () => {
        const fetchMock = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ ok: true })
        });
        globalThis.fetch = fetchMock as typeof globalThis.fetch;

        const onClose = jest.fn();
        const { invalidateSpy } = renderWithClient(
            <LoginDialog
                open
                onClose={onClose}
            />
        );

        fireEvent.change(screen.getByLabelText(/Email/i), {
            target: { value: 'hi@example.com' }
        });
        fireEvent.change(screen.getByLabelText(/Password/i), {
            target: { value: 'password123' }
        });

        fireEvent.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/auth/login',
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
        );

        const requestBody = JSON.parse(fetchMock.mock.calls[0][1]?.body);
        expect(requestBody).toEqual({
            email: 'hi@example.com',
            password: 'password123'
        });

        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: WHOAMI_QUERY_KEY });
    });
});

describe('RegisterDialog', () => {
    it('registers a user and invalidates whoami', async () => {
        const fetchMock = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ ok: true })
        });
        globalThis.fetch = fetchMock as typeof globalThis.fetch;

        const onClose = jest.fn();
        const { invalidateSpy } = renderWithClient(
            <RegisterDialog
                open
                onClose={onClose}
            />
        );

        fireEvent.change(screen.getByLabelText(/Full name/i), {
            target: { value: 'New User' }
        });
        fireEvent.change(screen.getByLabelText(/^Email$/i), {
            target: { value: 'new@example.com' }
        });
        fireEvent.change(screen.getByLabelText(/^Password$/i), {
            target: { value: 'password123' }
        });
        fireEvent.change(screen.getByLabelText(/Confirm password/i), {
            target: { value: 'password123' }
        });

        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/auth/register',
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
        );

        const requestBody = JSON.parse(fetchMock.mock.calls[0][1]?.body);
        expect(requestBody).toEqual({
            name: 'New User',
            email: 'new@example.com',
            password: 'password123',
            verificationPassword: 'password123'
        });

        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: WHOAMI_QUERY_KEY });
    });
});

describe('LogoutDialog', () => {
    it('logs out and invalidates whoami', async () => {
        const fetchMock = jest.fn().mockResolvedValue({ ok: true });
        globalThis.fetch = fetchMock as typeof globalThis.fetch;

        const onClose = jest.fn();
        const { invalidateSpy } = renderWithClient(
            <LogoutDialog
                open
                onClose={onClose}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /log out/i }));

        await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/auth/logout',
            expect.objectContaining({
                method: 'POST',
                credentials: 'include'
            })
        );

        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: WHOAMI_QUERY_KEY });
    });
});
