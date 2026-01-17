// src/hooks/useAuthUser.ts
import { useQuery } from '@tanstack/react-query';
import { $z } from '../server/schemas/$z';
import { AuthedUser } from '../types/game';

export type WhoamiResponse = AuthedUser | null;

export const WHOAMI_QUERY_KEY = ['whoami'] as const;

export function useAuthUser() {
    const query = useQuery<WhoamiResponse>({
        queryKey: WHOAMI_QUERY_KEY,
        queryFn: async () => {
            const response = await fetch('/api/whoami', { credentials: 'include' });
            if (!response.ok) {
                throw new Error('Unable to load session');
            }
            console.log(`body`, response.json());
            return $z.authUser.parse(await response.json());
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false
    });

    return {
        ...query,
        user: query.data
    };
}
