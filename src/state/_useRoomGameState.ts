// src/state/_useRoomGameState.ts
// import { useActorRef, useSelector } from '@xstate/react';

// import { gameMachine } from '@/server/machines/GameMachine';
// import { roomMachine } from '@/server/machines/RoomMachine';

// export function useRoomGameState() {
//     const roomService = useActorRef(roomMachine);
//     const gameService = useActorRef(gameMachine);

//     const roomState = useSelector(roomService, (state) => state.context);
//     const gameState = useSelector(gameService, (state) => state.context);

//     return { roomState, gameState };
// }
