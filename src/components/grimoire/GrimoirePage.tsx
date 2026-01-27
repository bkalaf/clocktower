// src/components/grimoire/GrimoirePage.tsx
import * as React from 'react';
import { Grimoire, type GrimoireSeat } from './Grimoire';
import { RoomSettingsMenu } from './RoomSettingsMenu';
import { NotesDrawer } from './NotesDrawer';
import { LayoutMode } from './computeLayout';
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
    const { enterRoom, exitRoom, settingsOpen, notesOpen, closeSettings, openNotes, closeNotes } = useRoomUi();
    const { markdown, setMarkdown } = useRoomNotes(roomId);

    const boardRef = React.useRef<HTMLDivElement>(null);
    const [viewport, setViewport] = React.useState({ width: 0, height: 0 });
    const [layout, setLayout] = React.useState<LayoutMode>(() => (players.length <= 15 ? 'circle' : 'square'));
    const [manualLayout, setManualLayout] = React.useState(false);
    const [tokenSize, setTokenSize] = React.useState(120);

    React.useEffect(() => {
        enterRoom(roomId);
        return () => exitRoom();
    }, [enterRoom, exitRoom, roomId]);

    React.useEffect(() => {
        if (manualLayout) return;
        const nextLayout = players.length <= 15 ? 'circle' : 'square';
        setLayout(nextLayout);
    }, [players.length, manualLayout]);

    React.useLayoutEffect(() => {
        const node = boardRef.current;
        if (!node || typeof ResizeObserver === 'undefined') return;
        const update = () => {
            const rect = node.getBoundingClientRect();
            setViewport({ width: rect.width, height: rect.height });
        };
        update();
        const observer = new ResizeObserver(update);
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    const handleLayoutChange = (next: LayoutMode) => {
        setLayout(next);
        setManualLayout(true);
    };

    const handleTokenSizeChange = (value: number) => {
        setTokenSize(clampValue(value, 75, 200));
    };

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

    const tableCenter = React.useMemo(
        () => ({
            x: viewport.width / 2,
            y: viewport.height / 2
        }),
        [viewport]
    );

    const handleNotesOpenChange = (value: boolean) => {
        if (value) {
            openNotes();
        } else {
            closeNotes();
        }
    };

    return (
        <div className='flex h-full min-h-screen w-full flex-col text-white'>
            <div className='relative flex flex-1 flex-col overflow-hidden'>
                <div
                    ref={boardRef}
                    className='relative flex-1'
                >
                    <Grimoire
                        seats={seats}
                        layout={layout}
                        tokenSize={tokenSize}
                        viewport={viewport}
                        tableCenter={tableCenter}
                    />
                    <RoomSettingsMenu
                        open={settingsOpen}
                        layout={layout}
                        tokenSize={tokenSize}
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
