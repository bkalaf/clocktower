// src/hooks/useAuthUser.ts
import { useQuery } from '@tanstack/react-query';

export type AuthUser = {
    userId: string;
    name: string;
    email: string;
    roles: string[];
};

export type WhoamiResponse = {
    user: AuthUser | null;
};

export const WHOAMI_QUERY_KEY = ['whoami'] as const;

export function useAuthUser() {
    const query = useQuery<WhoamiResponse>({
        queryKey: WHOAMI_QUERY_KEY,
        queryFn: async () => {
            const response = await fetch('/api/whoami', { credentials: 'include' });
            if (!response.ok) {
                throw new Error('Unable to load session');
            }
            return response.json();
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    });

    return {
        ...query,
        user: query.data?.user ?? null
    };
}
