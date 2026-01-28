// src/components/grimoire/GrimoirePage.tsx
import * as React from 'react';

import { GrimoireSeat } from './Grimoire';
import { GrimoireCanvas } from './GrimoireCanvas';
import { RoomSettingsMenu } from './RoomSettingsMenu';
import { NotesDrawer } from './NotesDrawer';
import {
    computeCircleMaxTokenSize,
    computeSquareMaxTokenSize,
    type LayoutMode
} from './computeLayout';
import { TownSquareProvider, useTownSquare } from '@/state/TownSquareContext';
import { useRoomUi } from '@/components/room/RoomUiContext';
import tokenBase from '@/assets/images/token.png?url';

const avatarImports = import.meta.glob('../../assets/avatars/*.png', {
    as: 'url',
    eager: true
}) as Record<string, string>;
const avatarUrls = Object.values(avatarImports).sort();

type RoomNotesHook = {
    markdown: string;
    setMarkdown: (value: string) => void;
};

function useRoomNotes(roomId?: string): RoomNotesHook {
    const [markdown, setMarkdown] = React.useState('');

    React.useEffect(() => {
        if (!roomId || typeof window === 'undefined') {
            return;
        }
        const stored = window.localStorage.getItem(`room-notes:${roomId}`);
        setMarkdown(stored ?? '');
    }, [roomId]);

    React.useEffect(() => {
        if (!roomId || typeof window === 'undefined') {
            return;
        }
        try {
            window.localStorage.setItem(`room-notes:${roomId}`, markdown);
        } catch {
            //
        }
    }, [roomId, markdown]);

    return { markdown, setMarkdown };
}

function clampValue(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

type GrimoirePageProps = {
    roomId: string;
};

export function GrimoirePage({ roomId }: GrimoirePageProps) {
    return (
        <TownSquareProvider>
            <GrimoirePageShell roomId={roomId} />
        </TownSquareProvider>
    );
}

function GrimoirePageShell({ roomId }: GrimoirePageProps) {
    const { players } = useTownSquare();
    const {
        enterRoom,
        exitRoom,
        settingsOpen,
        notesOpen,
        closeSettings,
        openNotes,
        closeNotes
    } = useRoomUi();
    const { markdown, setMarkdown } = useRoomNotes(roomId);

    const [layout, setLayout] = React.useState<LayoutMode>(() => (players.length <= 15 ? 'circle' : 'square'));
    const [manualLayout, setManualLayout] = React.useState(false);
    const [tokenSize, setTokenSize] = React.useState(120);
    const [canvasSize, setCanvasSize] = React.useState({ width: 0, height: 0 });

    React.useEffect(() => {
        enterRoom(roomId);
        return () => exitRoom();
    }, [enterRoom, exitRoom, roomId]);

    React.useEffect(() => {
        if (manualLayout) return;
        setLayout(players.length <= 15 ? 'circle' : 'square');
    }, [players.length, manualLayout]);

    const computedMaxTokenSize = React.useMemo(() => {
        const { width, height } = canvasSize;
        if (width === 0 || height === 0) {
            return 200;
        }
        const canvas = { width, height };
        const limit =
            layout === 'square'
                ? computeSquareMaxTokenSize(canvas, players.length)
                : computeCircleMaxTokenSize(canvas, players.length);
        const fallback = Number.isFinite(limit) && limit > 0 ? limit : 200;
        return Math.max(75, Math.min(200, fallback));
    }, [canvasSize.width, canvasSize.height, layout, players.length]);

    React.useEffect(() => {
        if (tokenSize > computedMaxTokenSize) {
            setTokenSize(computedMaxTokenSize);
        }
    }, [computedMaxTokenSize, tokenSize]);

    const handleLayoutChange = (next: LayoutMode) => {
        setLayout(next);
        setManualLayout(true);
    };

    const handleTokenSizeChange = (value: number) => {
        setTokenSize(clampValue(value, 75, computedMaxTokenSize));
    };

    const handleCanvasMeasure = React.useCallback((rect: { width: number; height: number }) => {
        setCanvasSize((prev) => {
            if (prev.width === rect.width && prev.height === rect.height) {
                return prev;
            }
            return rect;
        });
    }, []);

    const avatarPool = React.useMemo(() => (avatarUrls.length > 0 ? avatarUrls : [tokenBase]), []);

    const seats: GrimoireSeat[] = React.useMemo(
        () =>
            players.map((player, index) => ({
                seatId: player.id,
                playerName: player.name,
                avatarUrl: avatarPool[index % avatarPool.length],
                roleName: player.role.name,
                roleImage: tokenBase,
                reminders: player.reminders ?? []
            })),
        [players, avatarPool]
    );

    const handleNotesOpenChange = (value: boolean) => {
        if (value) {
            openNotes();
        } else {
            closeNotes();
        }
    };

    return (
        <div
            className='flex h-full min-h-screen w-full flex-col text-white'
            style={{ backgroundColor: '#1f3656' }}
        >
            <div className='relative flex flex-1 flex-col overflow-hidden'>
                <div className='relative flex-1 overflow-hidden'>
                    <GrimoireCanvas
                        seats={seats}
                        layout={layout}
                        tokenSize={tokenSize}
                        onMeasure={handleCanvasMeasure}
                    />
                    <RoomSettingsMenu
                        open={settingsOpen}
                        layout={layout}
                        tokenSize={tokenSize}
                        maxTokenSize={computedMaxTokenSize}
                        onLayoutChange={handleLayoutChange}
                        onTokenSizeChange={handleTokenSizeChange}
                        onClose={closeSettings}
                    />
                </div>
            </div>

            <NotesDrawer
                roomId={roomId}
                open={notesOpen}
                onOpenChange={handleNotesOpenChange}
                markdown={markdown}
                onChange={setMarkdown}
            />
        </div>
    );
}
