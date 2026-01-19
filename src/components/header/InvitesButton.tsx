import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { fetchInvites } from '@/client/api/invites';
import { useModal } from '@/hooks/useModal';

export function InvitesButton() {
    const { data, isLoading } = useQuery({
        queryKey: ['invites'],
        queryFn: fetchInvites,
        staleTime: 30 * 1000,
        refetchInterval: 30 * 1000,
        retry: false
    });

    const invites = Array.isArray(data) ? data : [];
    const { open } = useModal();

    return (
        <Button
            variant='ghost'
            size='sm'
            onClick={() => open('invites')}
        >
            Invites
            {isLoading ?
                <span className='ml-2 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400' />
            : invites.length > 0 ?
                <span className='ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-semibold text-white'>
                    {invites.length}
                </span>
            :   null}
        </Button>
    );
}
