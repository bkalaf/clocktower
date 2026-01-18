// src/components/grimoire/topbar/ToolsMenu.tsx
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Briefcase, ShieldAlert, CircleDashed, Settings, Sparkles } from 'lucide-react';
import * as React from 'react';

export type ToolsMenuProps = {
    onOpenReminders: () => void;
    onOpenFabled: () => void;
    onOpenAssignTokens: () => void;
};

export function ToolsMenu({ onOpenReminders, onOpenFabled, onOpenAssignTokens }: ToolsMenuProps) {
    return (
        <div className='pointer-events-auto'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type='button'
                        className='flex items-center gap-2 rounded-2xl border border-white/30 bg-black/60 px-3 py-2 text-xs uppercase tracking-[0.45em] text-white shadow-[0_20px_40px_rgba(0,0,0,0.45)] transition hover:border-amber-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400'
                    >
                        <Settings className='size-4 text-white/80' />
                        Tools
                        <Sparkles className='size-4 text-cyan-300' />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className={cn(
                        'w-52 rounded-2xl border border-white/10 bg-black/70 p-1 backdrop-blur shadow-[0_20px_65px_rgba(0,0,0,0.65)]'
                    )}
                >
                    <DropdownMenuItem onSelect={onOpenReminders} className='gap-2'>
                        <CircleDashed className='size-4 text-cyan-300' />
                        Reminder Tokens
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={onOpenFabled} className='gap-2'>
                        <ShieldAlert className='size-4 text-amber-400' />
                        Fabled List
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={onOpenAssignTokens} className='gap-2'>
                        <Briefcase className='size-4 text-violet-400' />
                        Assign Tokens
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
