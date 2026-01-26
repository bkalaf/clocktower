// src/ui/modals/Invites.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fetchInvites, acceptInvite, rejectInvite } from '@/client/api/invites';

// export function Invites({ onClose }: { onClose: () => void }) {
//     const queryClient = useQueryClient();
//     const { data, isLoading } = useQuery({
//         queryKey: ['invites'],
//         queryFn: fetchInvites,
//         staleTime: 30 * 1000,
//         refetchInterval: 30 * 1000,
//         retry: false
//     });

//     const acceptMutation = useMutation({
//         mutationFn: (inviteId: string) => acceptInvite(inviteId),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invites'] })
//     });

//     const rejectMutation = useMutation({
//         mutationFn: (inviteId: string) => rejectInvite(inviteId),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invites'] })
//     });

//     const invites = Array.isArray(data) ? data : [];

//     const handleAccept = async (inviteId: string) => {
//         try {
//             await acceptMutation.mutateAsync(inviteId);
//         } catch (error) {
//             console.error(error);
//             alert(error instanceof Error ? error.message : 'Could not accept invite');
//         }
//     };

//     const handleReject = async (inviteId: string) => {
//         try {
//             await rejectMutation.mutateAsync(inviteId);
//         } catch (error) {
//             console.error(error);
//             alert(error instanceof Error ? error.message : 'Could not reject invite');
//         }
//     };

//     return (
//         <div className='space-y-4'>
//             <DialogHeader className='flex items-center justify-between gap-4'>
//                 <DialogTitle className='text-white'>Invites</DialogTitle>
//                 <Button
//                     variant='ghost'
//                     size='sm'
//                     onClick={onClose}
//                 >
//                     Close
//                 </Button>
//             </DialogHeader>
//             {isLoading ?
//                 <DialogDescription className='text-sm text-slate-400'>Loading invites…</DialogDescription>
//             : invites.length === 0 ?
//                 <DialogDescription className='text-sm text-slate-400'>No pending invites.</DialogDescription>
//             :   <div className='flex flex-col gap-3'>
//                     {invites.map((invite: any) => (
//                         <div
//                             key={invite._id}
//                             className='rounded-2xl border border-white/5 bg-white/5 p-4'
//                         >
//                             <div className='flex items-center justify-between'>
//                                 <span className='font-medium text-white'>
//                                     {invite.kind === 'seat' ? 'Seat Invite' : 'Spectator'}
//                                 </span>
//                                 <span className='text-xs text-slate-400'>
//                                     {new Date(invite.expiresAt).toLocaleTimeString()}
//                                 </span>
//                             </div>
//                             <div className='text-xs text-slate-400'>From: {invite.createdByUserId}</div>
//                             <div className='mt-3 flex flex-wrap gap-2'>
//                                 <Button
//                                     variant='ghost'
//                                     size='sm'
//                                     onClick={() => handleAccept(invite._id)}
//                                     disabled={acceptMutation.isPending}
//                                 >
//                                     Accept
//                                 </Button>
//                                 <Button
//                                     variant='outline'
//                                     size='sm'
//                                     onClick={() => handleReject(invite._id)}
//                                     disabled={rejectMutation.isPending}
//                                 >
//                                     Decline
//                                 </Button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             }
//         </div>
//     );
// }
