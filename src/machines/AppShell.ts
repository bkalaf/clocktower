// src/machines/AppShell.ts

import { setup } from 'xstate';

const initialContext = {
    name: '',
    displayName: '',
    userId: undefined,
    currentRoomId: undefined
};
export const machine = setup({
    types: {
        context: initialContext as {
            name: string;
            displayName: string;
            userId?: string;
            currentRoomId?: string;
            currentGameId?: string;
            sessionId?: string;
        },
        events: {} as
            | { type: 'LOGOUT' }
            | { type: 'LEAVE_ROOM' }
            | { type: 'LOGIN_SUCCESS' }
            | { type: 'ENTER_ROOM'; roomId: string }
    }
}).createMachine({
    context: initialContext,
    id: 'AppShell',
    initial: 'unauthenticated',
    states: {
        unauthenticated: {
            on: {
                LOGIN_SUCCESS: {
                    target: 'lobby'
                }
            }
        },
        lobby: {
            on: {
                ENTER_ROOM: {
                    target: 'in_room'
                },
                LOGOUT: {
                    target: 'unauthenticated'
                }
            }
        },
        in_room: {
            on: {
                LEAVE_ROOM: {
                    target: 'lobby'
                },
                LOGOUT: {
                    target: 'unauthenticated'
                }
            }
        }
    }
});
