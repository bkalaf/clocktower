// src/components/grimoire/GrimoireBoard.tsx
import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { builtinScripts } from '@/data/scripts';
import { cn } from '@/lib/utils';
import backgroundImage from '@/assets/images/background.jpg?url';
import tokenBase from '@/assets/images/token.png?url';
import * as React from 'react';
import { SelectScriptDialog } from './modals/SelectScriptDialog';
import { AssignTokensDialog } from './modals/AssignTokensDialog';
import { FabledPickerDialog } from './modals/FabledPickerDialog';
import { ReminderPickerDialog } from './modals/ReminderPickerDialog';
import { ReminderToken, type ReminderTokenMeta } from './ReminderToken';
import { Token } from './Token';
import { ScriptDropdown } from './topbar/ScriptDropdown';
import { ToolsMenu } from './topbar/ToolsMenu';

export type SeatState = {
    seatId: number;
    name: string;
    tokenImg: string;
    nightOrderBadges?: Array<{ n: number; color: 'red' | 'blue' | 'gray' }>;
    reminders: string[];
};

export type GrimoireState = {
    roomId: string;
    matchId: string;
    scriptId: string;
    seats: SeatState[];
};

const reminderOptions: ReminderTokenMeta[] = [
    {
        key: 'night-watch',
        label: 'Night Watch',
        icon: '🌙',
        color: '#f97316',
        description: 'Active during night order'
    },
    {
        key: 'claim',
        label: 'Claim',
        icon: '🪧',
        color: '#fb7185',
        description: 'Claimed or special role'
    },
    {
        key: 'ghost',
        label: 'Ghost',
        icon: '👻',
        color: '#a855f7',
        description: 'Ghost vote reminder'
    },
    {
        key: 'poison',
        label: 'Poison',
        icon: '☠️',
        color: '#e11d48',
        description: 'Poisoned or marked'
    },
    {
        key: 'favor',
        label: 'Favor',
        icon: '✨',
        color: '#facc15',
        description: 'Special favor token'
    },
    {
        key: 'silence',
        label: 'Silence',
        icon: '🤫',
        color: '#38bdf8',
        description: 'Muted by effects'
    }
];

const fabledOptions = [
    {
        id: 'starborn',
        name: 'Starborn',
        description: 'Sees beyond the first night',
        tokenImg: tokenBase
    },
    {
        id: 'dreamer',
        name: 'Dreamer',
        description: 'Remembers whos sleeps awake',
        tokenImg: tokenBase
    },
    {
        id: 'seer',
        name: 'Seer',
        description: 'The classic insight',
        tokenImg: tokenBase
    }
];

const initialState: GrimoireState = {
    roomId: 'demo-room',
    matchId: 'match-001',
    scriptId: 'trouble-brewing',
    seats: [
        {
            seatId: 0,
            name: 'Harper',
            tokenImg: tokenBase,
            nightOrderBadges: [{ n: 1, color: 'blue' }],
            reminders: []
        },
        {
            seatId: 1,
            name: 'Cort',
            tokenImg: tokenBase,
            nightOrderBadges: [{ n: 2, color: 'red' }],
            reminders: []
        },
        {
            seatId: 2,
            name: 'Selene',
            tokenImg: tokenBase,
            reminders: []
        },
        {
            seatId: 3,
            name: 'Morrow',
            tokenImg: tokenBase,
            nightOrderBadges: [{ n: 3, color: 'gray' }],
            reminders: []
        },
        {
            seatId: 4,
            name: 'Vale',
            tokenImg: tokenBase,
            reminders: []
        },
        {
            seatId: 5,
            name: 'Ivy',
            tokenImg: tokenBase,
            reminders: []
        },
        {
            seatId: 6,
            name: 'Finn',
            tokenImg: tokenBase,
            reminders: []
        },
        {
            seatId: 7,
            name: 'Rook',
            tokenImg: tokenBase,
            reminders: []
        }
    ]
};

export function GrimoireBoard() {
    const boardRef = React.useRef<HTMLDivElement>(null);
    const [state, setState] = React.useState<GrimoireState>(initialState);
    const [boardSize, setBoardSize] = React.useState({ width: 0, height: 0 });
    const [scriptDialogOpen, setScriptDialogOpen] = React.useState(false);
    const [scriptViewerOpen, setScriptViewerOpen] = React.useState(false);
    const [reminderDialogOpen, setReminderDialogOpen] = React.useState(false);
    const [fabledDialogOpen, setFabledDialogOpen] = React.useState(false);
    const [assignDialogOpen, setAssignDialogOpen] = React.useState(false);

    React.useLayoutEffect(() => {
        const updateSize = () => {
            if (!boardRef.current) return;
            const { width, height } = boardRef.current.getBoundingClientRect();
            setBoardSize({ width, height });
        };

        updateSize();
        const observer = new ResizeObserver(() => updateSize());
        if (boardRef.current) {
            observer.observe(boardRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    const currentScript = React.useMemo(() => {
        return builtinScripts.find((script) => script.scriptId === state.scriptId) ?? builtinScripts[0];
    }, [state.scriptId]);

    const seatPositions = React.useMemo(() => {
        const count = state.seats.length;
        const baseRadius = Math.min(boardSize.width, boardSize.height) * 0.36;
        const radius = count > 0 ? Math.max(200, baseRadius || 220) : 220;

        return state.seats.map((seat, index) => {
            const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return {
                seat,
                style: {
                    position: 'absolute',
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)'
                } as React.CSSProperties
            };
        });
    }, [boardSize.height, boardSize.width, state.seats]);

    const handleScriptSelect = (scriptId: string) => {
        setState((prev) => ({ ...prev, scriptId }));
        setScriptDialogOpen(false);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const reminderKey = String(event.active.id);
        const dropTarget = event.over?.id;
        if (!dropTarget || !dropTarget?.toString().startsWith('seat-')) return;
        const seatId = Number(dropTarget?.toString().replace('seat-', ''));
        setState((prev) => ({
            ...prev,
            seats: prev.seats.map((seat) => {
                if (seat.seatId !== seatId) return seat;
                if (seat.reminders.includes(reminderKey)) {
                    return seat;
                }
                return {
                    ...seat,
                    reminders: [...seat.reminders, reminderKey]
                };
            })
        }));
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className='relative min-h-screen w-full overflow-hidden bg-black text-white'>
                <div
                    className='absolute inset-0 bg-cover bg-center bg-no-repeat'
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
                <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90' />
                <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0),rgba(0,0,0,0.95)_60%)]' />
                <div className='relative z-10 flex min-h-screen flex-col'>
                    <div className='absolute top-6 left-6 pointer-events-auto'>
                        <ScriptDropdown
                            scriptName={currentScript?.name ?? 'Unknown'}
                            onViewScript={() => setScriptViewerOpen(true)}
                            onChangeScript={() => setScriptDialogOpen(true)}
                        />
                    </div>
                    <div className='absolute top-6 right-6 pointer-events-auto'>
                        <ToolsMenu
                            onOpenReminders={() => setReminderDialogOpen(true)}
                            onOpenFabled={() => setFabledDialogOpen(true)}
                            onOpenAssignTokens={() => setAssignDialogOpen(true)}
                        />
                    </div>

                    <div className='relative flex flex-1 items-center justify-center p-6'>
                        <div
                            ref={boardRef}
                            className='relative flex h-[80vh] w-[80vw] max-w-[1200px] items-center justify-center rounded-[32rem] border border-white/10 bg-black/60 shadow-[0_0_60px_rgba(0,0,0,0.8)]'
                        >
                            <div className='pointer-events-none absolute inset-0 rounded-[32rem] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),rgba(0,0,0,0.9))]' />
                            <div className='absolute inset-0 rounded-[32rem] border border-white/5' />
                            <div className='absolute inset-0 flex items-center justify-center'>
                                <div className='relative flex h-64 w-64 flex-col items-center justify-center rounded-full border border-slate-500/20 bg-gradient-to-br from-slate-950/80 to-slate-900/80 px-8 py-6 text-center shadow-[0_30px_60px_rgba(0,0,0,0.75)]'>
                                    <span className='font-cinzel text-xs uppercase tracking-[0.6em] text-white/60'>
                                        Current Script
                                    </span>
                                    <span className='font-cinzel text-3xl uppercase tracking-[0.15em] text-white'>
                                        {currentScript?.name ?? 'Unknown'}
                                    </span>
                                    <div className='mt-4 flex w-full items-center justify-between text-[0.65rem] uppercase tracking-[0.45em] text-white/70'>
                                        <span className='rounded-full border border-white/20 px-3 py-1'>Day 2</span>
                                        <span className='rounded-full border border-white/20 px-3 py-1'>Night +3</span>
                                    </div>
                                </div>
                            </div>

                            {seatPositions.map(({ seat, style }) => (
                                <SeatTokenNode
                                    key={seat.seatId}
                                    seat={seat}
                                    style={style}
                                    reminderOptions={reminderOptions}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <SelectScriptDialog
                open={scriptDialogOpen}
                onOpenChange={setScriptDialogOpen}
                currentScriptId={state.scriptId}
                scripts={builtinScripts}
                onSelectScript={handleScriptSelect}
            />
            <ReminderPickerDialog
                open={reminderDialogOpen}
                onOpenChange={setReminderDialogOpen}
                reminders={reminderOptions}
            />
            <FabledPickerDialog
                open={fabledDialogOpen}
                onOpenChange={setFabledDialogOpen}
                options={fabledOptions}
            />
            <AssignTokensDialog
                open={assignDialogOpen}
                onOpenChange={setAssignDialogOpen}
                seats={state.seats.map((seat) => ({
                    seatId: seat.seatId,
                    name: seat.name,
                    tokenImg: seat.tokenImg,
                    reminders: seat.reminders
                }))}
            />

            <Dialog
                open={scriptViewerOpen}
                onOpenChange={setScriptViewerOpen}
            >
                <DialogContent className='max-w-3xl bg-black/80 border border-white/10'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl text-white font-semibold'>
                            {currentScript?.name ?? 'Script Details'}
                        </DialogTitle>
                        <DialogDescription className='text-sm text-slate-300'>
                            Characters currently assigned to {currentScript?.name ?? 'your script'}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                        {currentScript?.characters.map((character) => (
                            <div
                                key={character.id}
                                className='rounded-2xl border border-white/10 bg-slate-900/40 p-4'
                            >
                                <p className='text-sm uppercase tracking-[0.4em] text-white/60'>{character.icon}</p>
                                <p className='mt-1 text-lg font-semibold text-white'>{character.name}</p>
                            </div>
                        ))}
                    </div>
                    <DialogFooter className='mt-4 gap-2'>
                        <Button
                            variant='outline'
                            onClick={() => setScriptViewerOpen(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DndContext>
    );
}

type SeatTokenNodeProps = {
    seat: SeatState;
    style: React.CSSProperties;
    reminderOptions: ReminderTokenMeta[];
};

const SeatTokenNode = React.memo(function SeatTokenNode({ seat, style, reminderOptions }: SeatTokenNodeProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: `seat-${seat.seatId}`
    });

    return (
        <div style={style}>
            <div
                ref={setNodeRef}
                className={cn(
                    'relative flex items-center justify-center',
                    isOver && 'shadow-[0_0_35px_rgba(14,165,233,0.8)]'
                )}
            >
                <Token
                    name={seat.name}
                    image={seat.tokenImg}
                    badges={seat.nightOrderBadges?.map((badge) => ({
                        label: String(badge.n),
                        color: badge.color === 'gray' ? 'gray' : badge.color
                    }))}
                />
                {seat.reminders.map((reminderKey, index) => {
                    const meta = reminderOptions.find((r) => r.key === reminderKey);
                    if (!meta) return null;
                    const angle = (index / seat.reminders.length) * Math.PI * 2;
                    const offset = 52;
                    const x = Math.cos(angle) * offset;
                    const y = Math.sin(angle) * offset;
                    return (
                        <ReminderToken
                            key={`${seat.seatId}-${reminderKey}-${index}`}
                            reminder={meta}
                            size={26}
                            instanceId={`${seat.seatId}-${index}`}
                            className='text-[0.5rem]'
                            style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: `translate(-50%,-50%) translate(${x}px, ${y}px)`
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
});
