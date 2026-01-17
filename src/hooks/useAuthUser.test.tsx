import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { useAuthUser } from './useAuthUser';

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false
            }
        }
    });

describe('useAuthUser', () => {
    const originalFetch = globalThis.fetch;

    afterEach(() => {
        jest.restoreAllMocks();
        globalThis.fetch = originalFetch;
    });

    it('returns the user when the whoami endpoint succeeds', async () => {
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                user: {
                    userId: 'user:123',
                    name: 'Tester',
                    email: 'tester@example.com',
                    roles: ['user']
                }
            })
        });
        globalThis.fetch = mockFetch as unknown as typeof originalFetch;

        const queryClient = createTestQueryClient();
        const wrapper = ({ children }: { children: ReactNode }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );

        const { result } = renderHook(() => useAuthUser(), { wrapper });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.user).toEqual({
            userId: 'user:123',
            name: 'Tester',
            email: 'tester@example.com',
            roles: ['user']
        });

        expect(mockFetch).toHaveBeenCalledWith('/api/whoami', { credentials: 'include' });
    });

    it('flags an error when the whoami endpoint fails', async () => {
        const mockFetch = jest.fn().mockResolvedValue({ ok: false });
        globalThis.fetch = mockFetch as unknown as typeof originalFetch;

        const queryClient = createTestQueryClient();
        const wrapper = ({ children }: { children: ReactNode }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );

        const { result } = renderHook(() => useAuthUser(), { wrapper });
        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(result.current.user).toBeNull();
    });
});
