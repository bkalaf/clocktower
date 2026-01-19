// src/components/townsquare/TownSquareBoard.tsx
import * as React from 'react';
import { Button } from '@/components/ui/button';
import tokenBase from '@/assets/images/token.png?url';
import { Token } from '@/components/grimoire/Token';
import { ReminderToken } from '@/components/grimoire/ReminderToken';
import { useTownSquare } from '@/state/TownSquareContext';

const iconSources = import.meta.glob('../../assets/icons/*.png', { as: 'url' }) as Record<string, string>;

const snakeCase = (value: string) =>
    value
        .toLowerCase()
        .replace(/[’'`]/g, '')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '');

export function TownSquareBoard() {
    const boardRef = React.useRef<HTMLDivElement | null>(null);
    const [boardSize, setBoardSize] = React.useState({ width: 0, height: 0 });
    const [selectedPlayerIndex, setSelectedPlayerIndex] = React.useState<number | null>(null);
    const { players, nightOrder, actions } = useTownSquare();

    React.useEffect(() => {
        const updateSize = () => {
            if (!boardRef.current) return;
            const { width, height } = boardRef.current.getBoundingClientRect();
            setBoardSize({ width, height });
        };

        updateSize();
        const observer = new ResizeObserver(updateSize);
        if (boardRef.current) {
            observer.observe(boardRef.current);
        }
        return () => observer.disconnect();
    }, []);

    const seatPositions = React.useMemo(() => {
        if (players.length === 0) {
            return [];
        }
        const count = players.length;
        const baseRadius = Math.min(boardSize.width, boardSize.height) * 0.4;
        const radius = Math.max(180, baseRadius || 280);
        return players.map((player, index) => {
            const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return {
                player,
                index,
                style: {
                    position: 'absolute',
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                    width: 160,
                    height: 160
                } as React.CSSProperties,
                angle
            };
        });
    }, [boardSize.height, boardSize.width, players]);

    const selectedPlayer = selectedPlayerIndex !== null ? players[selectedPlayerIndex] : null;

    const handleToggleDead = () => {
        if (selectedPlayerIndex === null || !selectedPlayer) return;
        actions.updatePlayer(selectedPlayerIndex, { isDead: !selectedPlayer.isDead });
    };

    const handleToggleMarked = () => {
        if (selectedPlayerIndex === null || !selectedPlayer) return;
        actions.updatePlayer(selectedPlayerIndex, { isMarked: !selectedPlayer.isMarked });
    };

    const handleAddReminder = () => {
        if (selectedPlayerIndex === null || !selectedPlayer) return;
        const nextReminder = `Mark ${selectedPlayer.name}`;
        actions.updatePlayer(selectedPlayerIndex, {
            reminders: [...selectedPlayer.reminders, nextReminder]
        });
    };

    const centerBadge = (
        <div className='relative flex h-48 w-48 flex-col items-center justify-center rounded-full border border-white/20 bg-black/70 text-center text-[0.7rem] uppercase tracking-[0.4em] text-white/70 shadow-[0_20px_60px_rgba(0,0,0,0.8)]'>
            <span className='font-cinzel text-[0.75rem] leading-none'>Current Script</span>
            <span className='mt-2 font-cinzel text-2xl uppercase tracking-[0.18em] text-white'>Storyteller</span>
            <div className='mt-3 flex items-center gap-1 text-[0.55rem] uppercase tracking-[0.35em] text-white/70'>
                <span className='rounded-full border border-white/30 px-2'>Day 2</span>
                <span className='rounded-full border border-white/30 px-2'>Night +3</span>
            </div>
        </div>
    );

    return (
        <div className='flex flex-col gap-6 rounded-3xl border border-white/10 bg-black/40 px-4 py-6 shadow-[0_40px_80px_rgba(0,0,0,0.8)] backdrop-blur-xl'>
            <div
                ref={boardRef}
                className='relative mx-auto flex h-[70vh] w-full max-w-[1200px] items-center justify-center overflow-visible rounded-[36rem] border border-white/5 bg-black/60 p-4'
            >
                <div className='pointer-events-none absolute inset-0 rounded-[36rem] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),rgba(0,0,0,0.9))]' />
                <div className='absolute inset-0 rounded-[36rem] border border-white/10' />
                <div className='absolute inset-0 flex items-center justify-center'>{centerBadge}</div>
                {seatPositions.map(({ player, index, style }) => (
                    <SeatToken
                        key={player.id}
                        player={player}
                        index={index}
                        style={style}
                        nightOrder={nightOrder.get(index)}
                        onClick={() => setSelectedPlayerIndex(index)}
                    />
                ))}
            </div>

            <div className='grid gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80'>
                {selectedPlayer ? (
                    <>
                        <p className='font-semibold uppercase tracking-[0.3em]'>{selectedPlayer.name}</p>
                        <div className='flex flex-wrap gap-2'>
                            <Button variant='outline' size='sm' onClick={handleToggleDead}>
                                {selectedPlayer.isDead ? 'Revive' : 'Mark Dead'}
                            </Button>
                            <Button variant='outline' size='sm' onClick={handleToggleMarked}>
                                {selectedPlayer.isMarked ? 'Unmark' : 'Mark for attention'}
                            </Button>
                            <Button variant='outline' size='sm' onClick={handleAddReminder}>
                                Add Reminder
                            </Button>
                        </div>
                    </>
                ) : (
                    <p className='uppercase tracking-[0.3em] text-white/70'>Select a seat to inspect a player.</p>
                )}
            </div>
        </div>
    );
}

type SeatTokenProps = {
    player: ReturnType<typeof useTownSquare>['players'][number];
    index: number;
    style: React.CSSProperties;
    nightOrder?: { first: number; other: number };
    onClick?: () => void;
};

function SeatToken({ player, style, nightOrder, onClick }: SeatTokenProps) {
    const iconKey = `../../assets/icons/${player.role.id}.png`;
    const iconSrc = iconSources[iconKey] ?? tokenBase;
    return (
        <div style={style}>
            <div className='relative flex items-center justify-center'>
                <div className='absolute inset-0 rounded-full border border-white/20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),rgba(0,0,0,0.9))]' />
                <button
                    type='button'
                    onClick={onClick}
                    className='relative flex items-center justify-center rounded-full border-4 border-slate-900/80 p-2 shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition hover:border-emerald-400/80'
                >
                    <Token name={player.role.name} image={iconSrc} size={150} />
                </button>
                {nightOrder && (
                    <div className='pointer-events-none absolute bottom-2 flex gap-1 text-[0.55rem] uppercase tracking-[0.35em] text-white/70'>
                        <span className='rounded-full border border-white/30 bg-black/50 px-2'>
                            F {nightOrder.first}
                        </span>
                        <span className='rounded-full border border-white/30 bg-black/50 px-2'>
                            O {nightOrder.other}
                        </span>
                    </div>
                )}
                {player.reminders.map((reminder, idx) => {
                    const meta = {
                        key: `${player.role.id}-${snakeCase(reminder)}-${idx}`,
                        label: reminder,
                        backgroundImage: iconSrc
                    };
                    const angle = (idx / player.reminders.length) * Math.PI * 2;
                    const distance = 65;
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    return (
                        <ReminderToken
                            key={meta.key}
                            reminder={meta}
                            size={26}
                            className='text-[0.6rem]'
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
}
