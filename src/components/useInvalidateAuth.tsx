// src/components/useInvalidateAuth.tsx
import { useQueryClient } from '@tanstack/react-query';

export const useInvalidateAuth = () => {
    const queryClient = useQueryClient();
    return async () => await queryClient.invalidateQueries({ queryKey: ['whoami'] });
};
