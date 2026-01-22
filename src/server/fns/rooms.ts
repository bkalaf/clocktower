// src/server/fns/rooms.ts
import { api } from '@/shared/api/endpoints';
import { mapRoom } from '@/server/mappers/roomMapper';
import { makeMongooseCrud } from '@/server/fns/crudFactory';
import type { Room, RoomDTO, RoomId } from '@/types/room';
import type { QueryClient } from '@tanstack/react-query';

export const roomsCrud = makeMongooseCrud({
    getEndpoint: api.rooms.get,
    updateEndpoint: api.rooms.updateOne,
    deleteEndpoint: api.rooms.deleteOne,
    idKey: '_id',
    Model: RoomModel,
    mapDto: mapRoom as (doc: RoomDocument) => RoomDTO
});

export const rooms = {
    get: roomsCrud.getOne,
    updateOne: roomsCrud.updateOne,
    deleteOne: roomsCrud.deleteOne,
    invalidateRoom: (qc: QueryClient, roomId: RoomId) =>
        qc.invalidateQueries({ queryKey: roomsCrud.getOne.queryKey({ roomId }) })
};
