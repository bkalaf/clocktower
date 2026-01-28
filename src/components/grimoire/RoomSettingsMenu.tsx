// src/components/grimoire/RoomSettingsMenu.tsx
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LayoutMode } from './computeLayout';

type RoomSettingsMenuProps = {
    open: boolean;
    tokenSize: number;
    layout: LayoutMode;
    maxTokenSize: number;
    onTokenSizeChange: (value: number) => void;
    onLayoutChange: (layout: LayoutMode) => void;
    onClose: () => void;
};

export function RoomSettingsMenu({
    open,
    tokenSize,
    layout,
    onTokenSizeChange,
    onLayoutChange,
    onClose
}: RoomSettingsMenuProps) {
    return (
        <div
            className={cn(
                'pointer-events-none absolute right-6 top-20 z-20 min-w-[260px] max-w-sm rounded-3xl border border-white/20 bg-slate-950/80 p-5 text-white shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition duration-200',
                open ? 'pointer-events-auto opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95'
            )}
        >
            <div className='flex items-center justify-between'>
                <p className='text-xs uppercase tracking-[0.4em] text-white/60'>Room Settings</p>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={onClose}
                    className='text-white/60 hover:text-white'
                >
                    <X className='h-4 w-4' />
                </Button>
            </div>
            <div className='mt-3'>
                <div className='flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-white/50'>
                    <span>Token Size</span>
                    <strong className='text-sm'>{Math.round(tokenSize)} px</strong>
                </div>
                <Slider
                    value={[tokenSize]}
                    min={75}
                    max={Math.max(75, Math.round(maxTokenSize))}
                    step={1}
                    onValueChange={(values) => onTokenSizeChange(values[0])}
                    className='mt-3'
                />
            </div>
            <div className='mt-4'>
                <p className='text-[0.65rem] uppercase tracking-[0.35em] text-white/40'>Layout</p>
                <div className='mt-2 flex items-center gap-2'>
                    <Button
                        variant={layout === 'circle' ? 'secondary' : 'ghost'}
                        size='sm'
                        className='flex-1 uppercase tracking-[0.3em]'
                        onClick={() => onLayoutChange('circle')}
                    >
                        Circle
                    </Button>
                    <Button
                        variant={layout === 'square' ? 'secondary' : 'ghost'}
                        size='sm'
                        className='flex-1 uppercase tracking-[0.3em]'
                        onClick={() => onLayoutChange('square')}
                    >
                        Square
                    </Button>
                </div>
            </div>
        </div>
    );
}
