// src/components/header/ScriptViewer.tsx
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';

type Character = {
    id: string;
    name: string;
    team: string;
    icon?: string;
};

type Script = {
    scriptId: string;
    name: string;
    isBuiltin: boolean;
    characters: Character[];
};

export function ScriptViewer({
    open,
    onOpenChange,
    script
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    script?: Script;
}) {
    if (!script) return null;
    return (
        <Dialog.Root
            open={open}
            onOpenChange={onOpenChange}
        >
            <Dialog.Portal>
                <Dialog.Overlay className='fixed inset-0 bg-black/40 backdrop-blur-sm' />
                <Dialog.Content className='fixed inset-0 m-auto max-w-md rounded-xl bg-slate-950/90 p-6 shadow-xl shadow-indigo-500/30'>
                    <Dialog.Title className='text-lg font-semibold text-white'>{script.name}</Dialog.Title>
                    <Dialog.Description className='text-sm text-slate-300'>
                        Built-in: {script.isBuiltin ? 'Yes' : 'No'}
                    </Dialog.Description>
                    <div className='mt-4 flex flex-col gap-3'>
                        {script.characters.map((character) => (
                            <div
                                key={character.id}
                                className='flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-white'
                            >
                                <div>
                                    <div className='text-base font-medium'>{character.name}</div>
                                    <div className='text-xs text-slate-400'>{character.team}</div>
                                </div>
                                {character.icon ?
                                    <span>{character.icon}</span>
                                :   null}
                            </div>
                        ))}
                    </div>
                    <div className='mt-6 flex justify-end'>
                        <Dialog.Close asChild>
                            <Button
                                variant='ghost'
                                size='sm'
                            >
                                Close
                            </Button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
