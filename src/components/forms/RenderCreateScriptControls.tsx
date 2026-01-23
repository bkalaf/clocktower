// src/components/forms/RenderCreateScriptControls.tsx
import { useCallback, useMemo } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { createScript } from '@/lib/scripts';
import { FormControl } from './FormControl';
import { Modal } from '../Modal';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zScriptId } from '@/schemas/aliases/zScriptId';

const editionOptions = ['tb', 'bmr', 'snv', 'custom'] as const;
const skillLevelOptions = ['beginner', 'intermediate', 'advanced', 'expert', 'veteran'] as const;

const createScriptSchema = z.object({
    scriptId: zScriptId,
    name: z.string().min(1, 'Name is required').max(60, 'Name must be 60 characters or less'),
    edition: z.enum(editionOptions).optional().nullable(),
    skillLevel: z.enum(skillLevelOptions),
    isOfficial: z.boolean()
});

type CreateScriptFormValues = z.infer<typeof createScriptSchema>;

type Props = {
    returnTo?: string;
};

const defaultFormValues = (scriptId: string): CreateScriptFormValues => ({
    scriptId,
    name: '',
    edition: null,
    skillLevel: 'beginner',
    isOfficial: false
});

function RenderCreateScriptControls({ formName }: { formName: string }) {
    return function CreateScriptControls(form: UseFormReturn<CreateScriptFormValues>) {
        const {
            register,
            control,
            formState: { errors }
        } = form;
        return (
            <div className='space-y-4 text-sm'>
                <FormControl
                    label='Script ID'
                    formName={formName}
                    name='scriptId'
                    register={register}
                    errors={errors}
                />
                <FormControl
                    label='Script name'
                    formName={formName}
                    name='name'
                    register={register}
                    errors={errors}
                />
                <FormControl
                    label='Edition'
                    formName={formName}
                    name='edition'
                    register={register}
                    errors={errors}
                >
                    {({ id }) => (
                        <Controller
                            control={control}
                            name='edition'
                            defaultValue={null}
                            render={({ field }) => (
                                <Select
                                    value={field.value ?? ''}
                                    onValueChange={(value) => field.onChange(value || null)}
                                >
                                    <SelectTrigger
                                        id={id}
                                        className='w-full'
                                    >
                                        <SelectValue placeholder='Pick an edition' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {editionOptions.map((edition) => (
                                            <SelectItem
                                                key={edition}
                                                value={edition}
                                            >
                                                {edition.toUpperCase()}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    )}
                </FormControl>
                <FormControl
                    label='Skill level'
                    formName={formName}
                    name='skillLevel'
                    register={register}
                    errors={errors}
                >
                    {({ id }) => (
                        <Controller
                            control={control}
                            name='skillLevel'
                            defaultValue='beginner'
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={(value) => field.onChange(value)}
                                >
                                    <SelectTrigger
                                        id={id}
                                        className='w-full'
                                    >
                                        <SelectValue placeholder='Choose a skill level' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {skillLevelOptions.map((level) => (
                                            <SelectItem
                                                key={level}
                                                value={level}
                                            >
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    )}
                </FormControl>
                <FormControl
                    label='Official?'
                    formName={formName}
                    name='isOfficial'
                    register={register}
                    errors={errors}
                >
                    {({ id }) => (
                        <Controller
                            control={control}
                            name='isOfficial'
                            defaultValue={false}
                            render={({ field }) => (
                                <Checkbox
                                    id={id}
                                    checked={field.value}
                                    onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                                >
                                    Mark as official script
                                </Checkbox>
                            )}
                        />
                    )}
                </FormControl>
            </div>
        );
    };
}

export function CreateScriptForm({ returnTo }: Props) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const initialScriptId = useMemo(() => globalThis.crypto?.randomUUID?.() ?? '', []);
    const refreshScripts = useCallback(() => queryClient.invalidateQueries({ queryKey: ['scripts'] }), [queryClient]);
    const targetPath = returnTo ?? '..';

    const onSubmit = useCallback(
        async (values: CreateScriptFormValues) => {
            const result = await createScript({ data: values });
            await refreshScripts();
            navigate({
                to: targetPath,
                search: { scriptId: result.script._id }
            });
        },
        [navigate, refreshScripts, targetPath]
    );

    return (
        <Modal
            title='Create script'
            description='Save a script that players can choose when starting a room.'
            invalidate={refreshScripts}
            zodSchema={createScriptSchema}
            onSubmit={onSubmit}
            defaultValues={defaultFormValues(initialScriptId)}
            defaultErrorMsg='Unable to create script'
            closeOnSubmit={false}
            returnTo={targetPath}
        >
            {RenderCreateScriptControls({ formName: 'create-script' })}
        </Modal>
    );
}
