/* eslint-disable react/no-unescaped-entities */
// src/routes/_splash/_rooms/rooms/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { connectMongoose } from '../../../../db/connectMongoose';
import { Room, RoomModel } from '../../../../db/models/Room';
import { AuthedUser } from '../../../../types/game';
import { Script } from '../../../../db/models/Script';
import { useMemo } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { createColumnHeader } from '../../../../hooks/createColumnHeader';
import { createColumnData } from '../../../../hooks/createColumnData';

export const getAll = createServerFn({
    method: 'GET'
}).handler(async () => {
    await connectMongoose();
    const result = await RoomModel.find({}).exec();
    console.log(`result`, result);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return [{ _id: '1', banner: 'Banner' }] as any as RoomFK[];
});

export type RoomFK = FK<FK<Room, 'hostUserId', AuthedUser>, 'scriptId', Script>;

const columns: MRT_ColumnDef<RoomFK>[] = [
    { accessorKey: '_id', header: 'ID' },
    { accessorKey: 'banner', header: 'Banner' },
    { accessorKey: 'visibility', header: 'Visibility' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'hostUserId.username', header: 'Host' },
    {
        accessorFn: (data) => data?.scriptId?.edition ?? data?.scriptId?.name ?? '<unselected>',
        header: 'Script',
        id: 'scriptId'
    },
    { accessorKey: 'plannedStartTime', header: 'Planned Start' },
    { accessorKey: 'minPlayers', header: 'Min Players' },
    { accessorKey: 'maxPlayers', header: 'Max Players' },
    { accessorKey: 'allowTravelers', header: 'Allow Travellers' },
    { accessorKey: 'maxTravelers', header: 'Max Travellers' },
    { accessorFn: (data) => data?.scriptId?.skillLevel ?? data?.skillLevel, header: 'Skill Level', id: 'skillLevel' }
];

export const Route = createFileRoute('/_splash/_rooms/rooms/')({
    beforeLoad: ({ context }) => {
        context.queryClient.ensureQueryData({
            queryKey: ['rooms'],
            queryFn: getAll
        });
    },
    component: RouteComponent,
    loader: ({ context }) => {
        return context.queryClient.ensureQueryData({
            queryKey: ['rooms'],
            queryFn: getAll
        });
    }
});

const TableHeaders = createColumnHeader(columns);
const TableRow = createColumnData(columns);

function RouteComponent() {
    const data = Route.useLoaderData();
    return (
        <div className='flex flex-col w-full self-start overflow-auto'>
            <div className='flex'>Rooms Open</div>
            <table className='w-full bg-white text-black border border-black'>
                <thead>
                    <TableHeaders />
                </thead>
                <tbody>
                    {data.map((room) => (
                        <TableRow
                            key={room._id}
                            data={room}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
