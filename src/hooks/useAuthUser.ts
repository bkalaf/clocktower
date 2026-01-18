// src/hooks/useAuthUser.ts
import { useQuery } from '@tanstack/react-query';
import { AuthedUser } from '../types/game';
import { whoAmIServerFn } from '../serverFns/whoAmI';

export const WHOAMI_QUERY_KEY = ['whoami'] as const;

export function useAuthUser() {
    const query = useQuery<AuthedUser>({
        queryKey: WHOAMI_QUERY_KEY,
        queryFn: async () => {
            const result = await whoAmIServerFn();
            // console.log(`result`, result);
            return result;
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
