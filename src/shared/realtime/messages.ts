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
    | ErrorMessage;

export type IncomingMessage =
    | { type: 'CREATE_ROOM'; room: Room; requestId?: string }
    | { type: 'JOIN_ROOM'; roomId: string; userId?: string; requestId?: string }
    | { type: 'LEAVE_ROOM'; roomId: string; requestId?: string }
    | { type: 'ROOM_EVENT'; roomId: string; event: RoomEvents; requestId?: string }
    | { type: 'LIST_ROOMS'; requestId?: string };
