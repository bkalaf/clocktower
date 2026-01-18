// src/machines/AppShell.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { setup } from 'xstate';

export const machine = setup({
    types: {
        context: {} as { name: string; userId: string; currentRoomId: string },
        events: {} as
            | { type: 'LOGOUT' }
            | { type: 'LEAVE_ROOM' }
            | { type: 'LOGIN_SUCCESS' }
            | { type: 'ENTER_ROOM'; roomId: string }
    }
}).createMachine({
    context: {},
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
                    target: 'in_room',
                    description: '{ roomId: string }'
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
