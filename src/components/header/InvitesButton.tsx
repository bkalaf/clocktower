// src/components/header/InvitesButton.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { fetchInvites, acceptInvite, rejectInvite } from '@/client/api/invites';

export function InvitesButton() {
    const { data, isLoading } = useQuery({
        queryKey: ['invites'],
        queryFn: fetchInvites,
        staleTime: 30 * 1000,
        refetchInterval: 30 * 1000,
        retry: false
    });
    const queryClient = useQueryClient();
    const [panelOpen, setPanelOpen] = useState(false);

    const acceptMutation = useMutation({
        mutationFn: (inviteId: string) => acceptInvite(inviteId),
        onSuccess: () => queryClient.invalidateQueries(['invites'])
    });
    const rejectMutation = useMutation({
        mutationFn: (inviteId: string) => rejectInvite(inviteId),
        onSuccess: () => queryClient.invalidateQueries(['invites'])
    });

    const invites = Array.isArray(data) ? data : [];

    const handleAccept = async (inviteId: string) => {
        try {
            await acceptMutation.mutateAsync(inviteId);
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : 'Could not accept invite');
        }
    };

    const handleReject = async (inviteId: string) => {
        try {
            await rejectMutation.mutateAsync(inviteId);
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : 'Could not reject invite');
        }
    };

    return (
        <div className='relative'>
            <Button variant='ghost' size='sm' onClick={() => setPanelOpen((prev) => !prev)}>
                Invites
                {isLoading ? (
                    <span className='ml-2 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400' />
                ) : invites.length > 0 ? (
                    <span className='ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-semibold text-white'>
                        {invites.length}
                    </span>
                ) : null}
            </Button>
            {panelOpen ? (
                <div className='absolute right-0 top-[110%] z-50 w-72 rounded-xl border border-white/10 bg-slate-950/95 p-3 shadow-lg shadow-black/40'>
                    <div className='mb-2 text-xs font-semibold uppercase tracking-wide text-white/60'>Pending Invites</div>
                    {invites.length === 0 ? (
                        <div className='rounded-xl border border-white/5 bg-white/5 px-3 py-4 text-sm text-slate-300'>
                            No pending invites
                        </div>
                    ) : (
                        <div className='flex flex-col gap-2'>
                            {invites.map((invite: any) => (
                                <div key={invite._id} className='rounded-xl border border-white/5 bg-white/5 p-3 text-sm text-white'>
                                    <div className='flex items-center justify-between'>
                                        <span className='font-medium'>
                                            {invite.kind === 'seat' ? 'Seat Invite' : 'Spectator'}
                                        </span>
                                        <span className='text-xs text-slate-400'>
                                            {new Date(invite.expiresAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className='text-xs text-slate-400'>From: {invite.createdByUserId}</div>
                                    <div className='mt-3 flex gap-2'>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => handleAccept(invite._id)}
                                            disabled={acceptMutation.isLoading}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={() => handleReject(invite._id)}
                                            disabled={rejectMutation.isLoading}
                                        >
                                            Decline
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}
