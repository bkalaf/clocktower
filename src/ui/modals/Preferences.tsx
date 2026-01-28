import { useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { composeCn } from '@/lib/composeCn';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/client/state/hooks';
import { themeActions, themeSelectors, type ThemeDensity, type ThemeBackgroundColor } from '@/client/state/themeSlice';
import { updateThemeSettings } from '@/lib/api';

const densityOptions: Array<{ value: ThemeDensity; label: string; helper: string }> = [
    {
        value: 'compact',
        label: 'Compact',
        helper: 'Small spacing keeps the chrome tight for dashboard-style views.'
    },
    {
        value: 'comfy',
        label: 'Comfy',
        helper: 'Default spacing that balances density with legibility.'
    },
    {
        value: 'spacious',
        label: 'Spacious',
        helper: 'Extra breathing room between cards and widgets.'
    }
];

const colorOptions: Array<{ value: ThemeBackgroundColor; label: string; className: string }> = [
    { value: 'orange', label: 'Orange', className: 'bg-orange-800' },
    { value: 'amber', label: 'Amber', className: 'bg-amber-800' },
    { value: 'green', label: 'Green', className: 'bg-green-800' },
    { value: 'lime', label: 'Lime', className: 'bg-lime-800' },
    { value: 'blue', label: 'Blue', className: 'bg-blue-800' },
    { value: 'sky', label: 'Sky', className: 'bg-sky-800' },
    { value: 'cyan', label: 'Cyan', className: 'bg-cyan-800' },
    { value: 'fuchsia', label: 'Fuchsia', className: 'bg-fuchsia-800' },
    { value: 'pink', label: 'Pink', className: 'bg-pink-800' },
    { value: 'purple', label: 'Purple', className: 'bg-purple-800' },
    { value: 'slate', label: 'Slate', className: 'bg-slate-800' },
    { value: 'gray', label: 'Gray', className: 'bg-gray-800' },
    { value: 'black', label: 'Black', className: 'bg-black' }
];

type PreferencesProps = {
    onClose: () => void;
};

export function Preferences({ onClose }: PreferencesProps) {
    const dispatch = useAppDispatch();
    const density = useAppSelector(themeSelectors.selectDensity);
    const backgroundColor = useAppSelector(themeSelectors.selectBackgroundColor);

    const selectedDensity = useMemo(() => densityOptions.find((option) => option.value === density), [density]);

    const handleDensityChange = useCallback(
        async (value: ThemeDensity) => {
            if (value === density) return;
            const previousDensity = density;
            dispatch(themeActions.setDensity(value));
            try {
                const result = await updateThemeSettings({ density: value, backgroundColor });
                if (result.settings) {
                    dispatch(themeActions.setSettings(result.settings));
                }
            } catch (error) {
                console.error(error);
                dispatch(themeActions.setDensity(previousDensity));
            }
        },
        [density, backgroundColor, dispatch]
    );

    const handleBackgroundColorChange = useCallback(
        async (value: ThemeBackgroundColor) => {
            if (value === backgroundColor) return;
            const previousColor = backgroundColor;
            dispatch(themeActions.setBackgroundColor(value));
            try {
                const result = await updateThemeSettings({ density, backgroundColor: value });
                if (result.settings) {
                    dispatch(themeActions.setSettings(result.settings));
                }
            } catch (error) {
                console.error(error);
                dispatch(themeActions.setBackgroundColor(previousColor));
            }
        },
        [backgroundColor, density, dispatch]
    );

    return (
        <div className={composeCn('space-y-6')}>
            <DialogHeader className='flex items-center justify-between gap-4'>
                <DialogTitle className='text-white'>Preferences</DialogTitle>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={onClose}
                >
                    Close
                </Button>
            </DialogHeader>
            <DialogDescription className='text-xs text-slate-400'>
                Control UI density and the readable surface tone for cards and tooltips.
            </DialogDescription>
            <section className='rounded-2xl border border-white/10 bg-slate-950/90 p-4'>
                <div className='flex items-start justify-between gap-4'>
                    <div>
                        <p className='text-sm font-semibold text-white'>Density</p>
                        <p className='text-xs text-slate-400'>How tightly space is arranged between elements.</p>
                    </div>
                    <span className='text-[10px] uppercase tracking-[0.4em] text-slate-500'>{density}</span>
                </div>
                <div className='mt-3 flex flex-wrap gap-2'>
                    {densityOptions.map((option) => {
                        const selected = option.value === density;
                        return (
                            <Button
                                key={option.value}
                                size='sm'
                                variant={selected ? 'default' : 'outline'}
                                className='text-xs font-semibold uppercase tracking-[0.3em]'
                                onClick={() => handleDensityChange(option.value)}
                            >
                                {option.label}
                            </Button>
                        );
                    })}
                </div>
                {selectedDensity?.helper && <p className='mt-2 text-[11px] text-slate-400'>{selectedDensity.helper}</p>}
            </section>
            <section className='rounded-2xl border border-white/10 bg-slate-950/90 p-4'>
                <div className='flex items-start justify-between gap-4'>
                    <div>
                        <p className='text-sm font-semibold text-white'>Readable Surface Color</p>
                        <p className='text-xs text-slate-400'>
                            Choose the dark tone that hosts tooltips, cards, and readable overlays.
                        </p>
                    </div>
                    <span className='text-[10px] uppercase tracking-[0.4em] text-slate-500'>{backgroundColor}</span>
                </div>
                <div className='mt-3'>
                    <div className='grid grid-cols-4 gap-3'>
                        {colorOptions.map((color) => {
                            const isSelected = color.value === backgroundColor;
                            return (
                                <Tooltip key={color.value}>
                                    <TooltipTrigger asChild>
                                        <button
                                            type='button'
                                            aria-label={`Select ${color.label}`}
                                            aria-pressed={isSelected}
                                            onClick={() => handleBackgroundColorChange(color.value)}
                                            className={cn(
                                                'flex h-3.5 w-3.5 items-center justify-center rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                                                color.className,
                                                isSelected ?
                                                    'ring-2 ring-offset-2 ring-white'
                                                :   'border-white/20 hover:border-white/50'
                                            )}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent sideOffset={4}>{color.label}</TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
