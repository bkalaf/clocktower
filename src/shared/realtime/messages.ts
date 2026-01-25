// src/shared/realtime/messages.ts
export type RoomsListMessage = {
    type: 'ROOMS_LIST';
    rooms: RoomSummary[];
    requestId?: string;
};

export type RoomCreatedMessage = {
    type: 'ROOM_CREATED';
    room: RoomSummary;
    requestId?: string;
};

export type RoomSnapshotMessage = {
    type: 'ROOM_SNAPSHOT';
    roomId: string;
    snapshot: RoomSnapshotPayload;
};

export type SessionStateValue = 'unauthenticated' | 'lobby' | 'in_room';

export type SessionSnapshotContext = {
    userId?: string;
    username?: string;
    currentRoomId?: string;
    isRoomHost: boolean;
};

export type SessionSnapshotMessage = {
    type: 'SESSION_SNAPSHOT';
    snapshot: {
        value: SessionStateValue;
        context: SessionSnapshotContext;
    };
};

export type JoinedRoomMessage = {
    type: 'JOINED_ROOM';
    roomId: string;
};

export type ErrorMessage = {
    type: 'ERROR';
    requestId?: string;
    message: string;
};

export type OutgoingMessage =
    | RoomsListMessage
    | RoomCreatedMessage
    | RoomSnapshotMessage
    | JoinedRoomMessage
    | SessionSnapshotMessage
    | ErrorMessage;

export type IncomingMessage =
    | { type: 'CREATE_ROOM'; room: Room; requestId?: string }
    | { type: 'JOIN_ROOM'; roomId: string; userId?: string; requestId?: string }
    | { type: 'LEAVE_ROOM'; roomId: string; requestId?: string }
    | { type: 'ROOM_EVENT'; roomId: string; event: RoomEvents; requestId?: string }
    | { type: 'LOGIN_SUCCESS'; userId: string; username: string }
    | { type: 'LIST_ROOMS'; requestId?: string };
