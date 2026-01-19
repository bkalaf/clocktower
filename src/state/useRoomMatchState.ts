import { useActorRef, useSelector } from '@xstate/react';

import { machine as matchMachine } from '@/machines/MatchMachine';
import { machine as roomMachine } from '@/machines/RoomMachine';

export function useRoomMatchState() {
    const roomService = useActorRef(roomMachine);
    const matchService = useActorRef(matchMachine);

    const roomState = useSelector(roomService, (state) => state.context);
    const matchState = useSelector(matchService, (state) => state.context);

    return { roomState, matchState };
}
