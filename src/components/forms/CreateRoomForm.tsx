// src/components/forms/CreateRoomForm.tsx
import { useCallback, useMemo } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { Plus } from 'lucide-react';

import { listScripts } from '@/lib/scripts';
import { FormControl } from './FormControl';
import { Modal } from '../Modal';
import { useAuth } from '@/state/_useAuth';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateRoom } from '@/client/state/hooks';

const parseIntegerField = (label: string, min: number, max: number) =>
    z.preprocess(
        (value) => {
            if (value === '' || value === null || value === undefined) {
                return undefined;
            }
            if (typeof value === 'string' || typeof value === 'number') {
                const parsed = Number(value);
                return Number.isNaN(parsed) ? value : parsed;
            }
            return value;
        },
        z
            // .number({ required_error: `${label} is required`, invalid_type_error: `${label} must be a number` })
            .int(`${label} must be a whole number`)
            .min(min, `${label} must be at least ${min}`)
            .max(max, `${label} cannot be more than ${max}`)
    );

const createRoomSchema = z
    .object({
        banner: z.string().min(1, 'Room name is required'),
        visibility: z.enum(['public', 'private']),
        minPlayers: parseIntegerField('Min players', 5, 15),
        maxPlayers: parseIntegerField('Max players', 5, 15),
        maxTravellers: parseIntegerField('Max travellers', 0, 5),
        scriptId: z.string().optional()
    })
    .refine((values) => values.minPlayers <= values.maxPlayers, {
        message: 'Max players must be greater than or equal to min players',
        path: ['maxPlayers']
    });

type CreateRoomFormValues = z.infer<typeof createRoomSchema>;

type CreateRoomFormProps = {
    defaultScriptId?: string;
};

const baseDefaultValues: CreateRoomFormValues = {
    banner: '',
    visibility: 'public',
    minPlayers: 5,
    maxPlayers: 8,
    maxTravellers: 0,
    scriptId: ''
};

function RenderCreateRoomControls({ formName, defaultScriptId }: { formName: string; defaultScriptId?: string }) {
    return function CreateRoomControls(form: UseFormReturn<CreateRoomFormValues>) {
        const {
            register,
            control,
            formState: { errors }
        } = form;
        const scriptsQuery = useQuery({
            queryKey: ['scripts'],
            queryFn: () => listScripts(),
            staleTime: 1000 * 60 * 5
        });
        const scripts = scriptsQuery.data?.scripts ?? [];
        const location = useLocation();
        const navigate = useNavigate();
        const handleCreateScript = useCallback(() => {
            navigate({
                to: '/scripts/new',
                state: {
                    returnTo: `${location.pathname}${location.search}`
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any
            });
        }, [location.pathname, location.search, navigate]);

        return (
            <div className='space-y-4 text-sm'>
                <FormControl
                    label='Room name'
                    formName={formName}
                    name='banner'
                    register={register}
                    errors={errors}
                />
                <FormControl
                    label='Visibility'
                    formName={formName}
                    name='visibility'
                    type='text'
                    placeholder='public or private'
                    register={register}
                    errors={errors}
                />
                <FormControl
                    label='Script'
                    formName={formName}
                    name='scriptId'
                    register={register}
                    errors={errors}
                >
                    {({ id }) => (
                        <div className='flex gap-2'>
                            <div className='flex-1'>
                                <Controller
                                    control={control}
                                    name='scriptId'
                                    defaultValue={defaultScriptId ?? ''}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value ?? ''}
                                            onValueChange={(value) => field.onChange(value ?? '')}
                                        >
                                            <SelectTrigger
                                                id={id}
                                                className='w-full'
                                            >
                                                <SelectValue
                                                    placeholder={
                                                        scripts.length ? 'Select a script'
                                                        : scriptsQuery.isFetching ?
                                                            'Loading scripts…'
                                                        :   'No scripts available'
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {scripts.length === 0 && (
                                                    <SelectItem
                                                        value=''
                                                        disabled
                                                    >
                                                        {scriptsQuery.isFetching ?
                                                            'Loading scripts…'
                                                        :   'No scripts available'}
                                                    </SelectItem>
                                                )}
                                                {scripts.map((script) => (
                                                    <SelectItem
                                                        key={script._id}
                                                        value={script._id}
                                                    >
                                                        {script.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <Button
                                variant='ghost'
                                size='icon'
                                onClick={handleCreateScript}
                                aria-label='Create a script'
                            >
                                <Plus className='h-4 w-4' />
                            </Button>
                        </div>
                    )}
                </FormControl>
                <div className='grid gap-3 md:grid-cols-3'>
                    <FormControl
                        label='Min players'
                        formName={formName}
                        name='minPlayers'
                        type='number'
                        placeholder='5'
                        register={register}
                        errors={errors}
                    />
                    <FormControl
                        label='Max players'
                        formName={formName}
                        name='maxPlayers'
                        type='number'
                        placeholder='15'
                        register={register}
                        errors={errors}
                    />
                    <FormControl
                        label='Max travellers'
                        formName={formName}
                        name='maxTravellers'
                        type='number'
                        placeholder='0'
                        register={register}
                        errors={errors}
                    />
                </div>
                <p className='text-xs text-slate-400'>Setting max travellers above 0 enables traveller seats.</p>
            </div>
        );
    };
}

export function CreateRoomForm({ defaultScriptId }: CreateRoomFormProps) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const invalidate = useCallback(async () => {}, []);
    const defaultValues = useMemo(
        () => ({
            ...baseDefaultValues,
            scriptId: defaultScriptId ?? ''
        }),
        [defaultScriptId]
    );

    const createRoom = useCreateRoom();
    const onSubmit = useCallback(
        async (values: CreateRoomFormValues) => {
            if (!user) {
                throw new Error('You must be signed in to create a room.');
            }
            const roomId =
                globalThis.crypto?.randomUUID?.() ?? `room-${Date.now()}-${Math.random().toString(16).slice(2)}`;
            const connectedUserIds: Record<string, GameRoles> = {
                [user._id]: 'player'
            };
            const room: Room = {
                _id: roomId,
                allowTravellers: values.maxTravellers > 0,
                banner: values.banner.trim(),
                connectedUserIds,
                endedAt: undefined,
                hostUserId: user._id,
                maxPlayers: values.maxPlayers as PcPlayerCount,
                minPlayers: values.minPlayers as PcPlayerCount,
                maxTravellers: values.maxTravellers as PcTravellerCount,
                plannedStartTime: undefined,
                scriptId: values.scriptId,
                skillLevel: 'beginner',
                speed: 'moderate',
                visibility: values.visibility
            };

            const createdRoom = await createRoom(room);
            navigate({ to: `/rooms/${createdRoom.roomId}` });
        },
        [navigate, user, createRoom]
    );

    return (
        <Modal
            title='Create room'
            description='Open a new game and invite players.'
            invalidate={invalidate}
            zodSchema={createRoomSchema}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            defaultErrorMsg='Unable to create room'
            closeOnSubmit={false}
        >
            {RenderCreateRoomControls({ formName: 'create-room', defaultScriptId })}
        </Modal>
    );
}
