// src/components/grimoire/modals/SelectScriptDialog.tsx
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { modalBackgroundStyle } from '@/components/modals/modalStyles';

export type ScriptOption = {
    scriptId: string;
    name: string;
    isBuiltin?: boolean;
    characters: Array<{
        id: string;
        name: string;
        icon: string;
    }>;
};

export type SelectScriptDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentScriptId: string;
    scripts: ScriptOption[];
    onSelectScript: (scriptId: string) => void;
};

export function SelectScriptDialog({
    open,
    onOpenChange,
    currentScriptId,
    scripts,
    onSelectScript
}: SelectScriptDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent
                className='max-w-3xl rounded-3xl border border-white/10 bg-black/80 shadow-[0_30px_60px_rgba(0,0,0,0.65)]'
                style={modalBackgroundStyle}
            >
                <DialogHeader>
                    <DialogTitle className='text-2xl text-white font-semibold'>Select a Script</DialogTitle>
                    <DialogDescription className='text-sm text-slate-300'>
                        Every script wields a unique set of characters and story beats. Pick the one you want to study
                        in the Grimoire.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className='mb-4 max-h-96 rounded-xl border border-white/10 bg-black/50 p-4'>
                    <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                        {scripts.map((script) => {
                            const isActive = script.scriptId === currentScriptId;
                            return (
                                <button
                                    key={script.scriptId}
                                    type='button'
                                    onClick={() => onSelectScript(script.scriptId)}
                                    className={cn(
                                        'group flex w-full flex-col gap-3 rounded-2xl border px-4 py-4 transition hover:border-cyan-400/60',
                                        isActive ?
                                            'border-cyan-400/80 bg-cyan-500/10 shadow-[0_15px_35px_rgba(14,165,233,0.25)]'
                                        :   'border-white/5 bg-slate-900/40'
                                    )}
                                >
                                    <div className='flex items-center justify-between text-left text-white'>
                                        <div>
                                            <p className='text-lg font-semibold uppercase tracking-[0.3em]'>
                                                {script.name}
                                            </p>
                                            <p className='text-xs uppercase tracking-[0.35em] text-white/60'>
                                                {script.isBuiltin ? 'Builtin' : 'Custom'}
                                            </p>
                                        </div>
                                        {isActive && (
                                            <span className='rounded-full border border-cyan-400/80 px-3 py-1 text-xs font-semibold text-cyan-200'>
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <div className='flex flex-wrap gap-2'>
                                        {script.characters.map((character) => (
                                            <span
                                                key={character.id}
                                                className='flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-white/90'
                                            >
                                                <span className='text-base'>{character.icon}</span>
                                                <span className='font-medium'>{character.name}</span>
                                            </span>
                                        ))}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </ScrollArea>
                <DialogFooter className='gap-2'>
                    <Button
                        variant='outline'
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
