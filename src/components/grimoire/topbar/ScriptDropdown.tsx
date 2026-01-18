// src/components/grimoire/topbar/ScriptDropdown.tsx
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { List, FileText, ChevronDown } from 'lucide-react';
import * as React from 'react';

export type ScriptDropdownProps = {
    scriptName: string;
    onViewScript: () => void;
    onChangeScript: () => void;
};

export function ScriptDropdown({ scriptName, onViewScript, onChangeScript }: ScriptDropdownProps) {
    return (
        <div className='pointer-events-auto'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type='button'
                        className='flex items-center gap-2 rounded-full border border-white/30 bg-black/60 px-4 py-2 text-xs uppercase tracking-[0.5em] text-white shadow-lg transition hover:border-cyan-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400'
                    >
                        <span className='font-cinzel text-sm'>{scriptName}</span>
                        <ChevronDown className='size-4 text-white/70' />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className={cn(
                        'w-56 rounded-2xl border border-white/10 bg-black/70 p-2 backdrop-blur',
                        'shadow-[0_20px_65px_rgba(0,0,0,0.55)]'
                    )}
                >
                    <DropdownMenuItem onSelect={onViewScript} className='gap-2'>
                        <FileText className='size-4 text-cyan-400' />
                        View Script
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={onChangeScript} className='gap-2'>
                        <List className='size-4 text-amber-400' />
                        Change Script
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
