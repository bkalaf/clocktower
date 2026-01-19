// src/components/header/ScriptMenu.tsx
// TODO Not used and restored
import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/state/useAuth';
import { useRoomParams } from '@/hooks/useRoomParams';
import { fetchScripts, setRoomScript } from '@/client/api/scripts';
import { fetchRoom } from '@/client/api/rooms';
import { ScriptViewer } from './ScriptViewer';

export function ScriptMenu() {
    const { roomId } = useRoomParams();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [viewerOpen, setViewerOpen] = useState(false);

    const scriptsQuery = useQuery({
        queryKey: ['scripts'],
        queryFn: fetchScripts,
        staleTime: 5 * 60 * 1000,
        retry: false
    });

    const roomQuery = useQuery({
        queryKey: ['room', roomId],
        queryFn: () => fetchRoom(roomId!),
        enabled: Boolean(roomId),
        retry: false
    });

    const mutation = useMutation({
        mutationFn: ({ scriptId }: { scriptId: string }) => setRoomScript(roomId!, scriptId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['room', roomId]
            });
            queryClient.invalidateQueries({
                queryKey: ['scripts']
            });
        }
    });

    const roomData = roomQuery.data;
    const room = roomData?.room;
    const currentScript =
        scriptsQuery.data?.find((script: { scriptId: string }) => script.scriptId === room?.scriptId) ?? undefined;
    const scriptName = currentScript?.name ?? 'Select Script';
    const isHost = Boolean(room && user && room.hostUserId === user._id);
    const isStoryteller = roomData?.memberRole === 'storyteller';
    const storytellersExist = (roomData?.storytellerCount ?? 0) > 0;
    const canChangeScript =
        Boolean(room && room.status !== 'in_match') && (isStoryteller || (isHost && !storytellersExist));

    const handleScriptChange = async (scriptId: string) => {
        if (!roomId) return;
        try {
            await mutation.mutateAsync({ scriptId });
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : 'Failed to update script');
        }
    };

    return (
        <>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <Button
                        variant='ghost'
                        className='flex items-center gap-2 text-sm font-semibold'
                        disabled={!roomId || scriptsQuery.isLoading}
                    >
                        {scriptsQuery.isLoading ?
                            <Loader2 className='h-4 w-4 animate-spin' />
                        :   scriptName}
                        <ChevronDown className='h-4 w-4' />
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className='z-50 min-w-[220px] rounded-xl border border-white/10 bg-slate-900/90 p-2 shadow-lg shadow-black/40'>
                    <DropdownMenu.Item
                        className='rounded-lg px-3 py-2 text-sm text-white hover:bg-white/5 focus:bg-white/5'
                        onSelect={() => setViewerOpen(true)}
                    >
                        View Script
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                        className='rounded-lg px-3 py-2 text-sm text-white hover:bg-white/5 focus:bg-white/5 disabled:text-white/40'
                        disabled={!canChangeScript}
                    >
                        Change Script
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className='my-1 h-px bg-white/5' />
                    <div className='max-h-64 overflow-y-auto'>
                        {scriptsQuery.data?.map((script: { scriptId: string; name: string }) => (
                            <DropdownMenu.Item
                                key={script.scriptId}
                                className='rounded-lg px-3 py-2 text-sm text-white hover:bg-white/5 focus:bg-white/5 disabled:text-white/40'
                                onSelect={() => {
                                    if (canChangeScript && script.scriptId !== room?.scriptId) {
                                        handleScriptChange(script.scriptId);
                                    }
                                }}
                                disabled={!canChangeScript}
                            >
                                <div className='flex items-center justify-between'>
                                    <span>{script.name}</span>
                                    {room?.scriptId === script.scriptId ?
                                        <span className='text-xs text-emerald-300'>(current)</span>
                                    :   null}
                                </div>
                            </DropdownMenu.Item>
                        ))}
                    </div>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
            <ScriptViewer
                open={viewerOpen}
                onOpenChange={setViewerOpen}
                script={currentScript}
            />
        </>
    );
}
