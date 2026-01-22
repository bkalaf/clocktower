// src/components/townsquare/TownSquareMenu.tsx

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTownSquare } from '@/state/TownSquareContext';
import type { TownSquareModalKind } from './TownSquareModalHost';

type Props = {
    onOpenModal: (modal: TownSquareModalKind) => void;
};

export function TownSquareMenu({ onOpenModal }: Props) {
    const { players, session, grimoire, actions } = useTownSquare();

    return (
        <div className='rounded-3xl border border-white/10 bg-black/70 p-4 shadow-[0_35px_75px_rgba(0,0,0,0.65)]'>
            <Tabs
                defaultValue='grimoire'
                className='space-y-2'
            >
                <TabsList className='grid w-full grid-cols-5 gap-1 rounded-2xl bg-white/5 p-1 text-[0.65rem] uppercase tracking-[0.35em] text-white'>
                    <TabsTrigger value='grimoire'>Grimoire</TabsTrigger>
                    <TabsTrigger value='session'>Session</TabsTrigger>
                    <TabsTrigger value='players'>Players</TabsTrigger>
                    <TabsTrigger value='characters'>Characters</TabsTrigger>
                    <TabsTrigger value='help'>Help</TabsTrigger>
                </TabsList>

                <TabsContent
                    value='grimoire'
                    className='space-y-3 rounded-2xl border border-white/10 bg-black/50 p-3 text-[0.75rem] uppercase tracking-[0.3em]'
                >
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={actions.toggleSpectator}
                    >
                        {session.isSpectator ? 'Return to Play' : 'Spectator Mode'}
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={actions.toggleNight}
                    >
                        {grimoire.isNight ? 'Switch to Day' : 'Switch to Night'}
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={actions.toggleNightOrder}
                    >
                        {grimoire.isNightOrder ? 'Hide Night Order' : 'Show Night Order'}
                    </Button>
                    <div className='flex gap-2'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => actions.setZoom(Math.max(grimoire.zoom - 1, -10))}
                        >
                            Zoom Out
                        </Button>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => actions.setZoom(Math.min(grimoire.zoom + 1, 10))}
                        >
                            Zoom In
                        </Button>
                    </div>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => actions.setBackground('')}
                    >
                        Reset Background
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onOpenModal('reminder')}
                    >
                        Reminder Tokens
                    </Button>
                </TabsContent>

                <TabsContent
                    value='session'
                    className='space-y-3 rounded-2xl border border-white/10 bg-black/50 p-3 text-[0.75rem] uppercase tracking-[0.3em]'
                >
                    <p className='text-xs text-slate-400'>{session.sessionId || 'No live session'}</p>
                    <p>{players.length} seats filled</p>
                    <p>{session.playerCount} participants in room</p>
                    <p>{session.isSpectator ? 'Spectator' : 'Storyteller'}</p>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => actions.setSessionId(`session-${Date.now()}`)}
                    >
                        Regenerate Session
                    </Button>
                </TabsContent>

                <TabsContent
                    value='players'
                    className='space-y-3 rounded-2xl border border-white/10 bg-black/50 p-3 text-[0.75rem] uppercase tracking-[0.3em]'
                >
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => actions.addPlayer()}
                    >
                        Add Player
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={actions.randomizePlayers}
                    >
                        Randomize Seats
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={actions.resetPlayers}
                    >
                        Reset Players
                    </Button>
                </TabsContent>

                <TabsContent
                    value='characters'
                    className='space-y-3 rounded-2xl border border-white/10 bg-black/50 p-3 text-[0.75rem] uppercase tracking-[0.3em]'
                >
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onOpenModal('edition')}
                    >
                        Select Edition
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onOpenModal('roles')}
                    >
                        Choose & Assign
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onOpenModal('fabled')}
                    >
                        Add Fabled
                    </Button>
                </TabsContent>

                <TabsContent
                    value='help'
                    className='space-y-3 rounded-2xl border border-white/10 bg-black/50 p-3 text-[0.75rem] uppercase tracking-[0.3em]'
                >
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onOpenModal('reference')}
                    >
                        Reference Sheet
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onOpenModal('nightOrder')}
                    >
                        Night Order
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => onOpenModal('voteHistory')}
                    >
                        Vote History
                    </Button>
                </TabsContent>
            </Tabs>
        </div>
    );
}
