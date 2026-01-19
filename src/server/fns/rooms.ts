import { api } from '@/shared/api/endpoints';
import { RoomModel } from '@/db/models/Room';
import { mapRoom } from '@/server/mappers/roomMapper';
import { makeMongooseCrud } from '@/server/fns/crudFactory';
import type { RoomId } from '@/types/room';
import type { QueryClient } from '@tanstack/react-query';

export const roomsCrud = makeMongooseCrud({
    getEndpoint: api.rooms.get,
    updateEndpoint: api.rooms.updateOne,
    deleteEndpoint: api.rooms.deleteOne,
    idKey: 'roomId',
    Model: RoomModel,
    mapDto: mapRoom
});

export const rooms = {
    get: roomsCrud.getOne,
    updateOne: roomsCrud.updateOne,
    deleteOne: roomsCrud.deleteOne,
    invalidateRoom: (qc: QueryClient, roomId: RoomId) =>
        qc.invalidateQueries({ queryKey: roomsCrud.getOne.queryKey({ roomId }) })
};
