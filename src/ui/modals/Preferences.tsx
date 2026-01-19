// src/ui/modals/Preferences.tsx
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePreferences } from '@/hooks/usePreferences';
import { USER_PREFERENCE_DEFINITIONS } from '@/types/preferences';

export function Preferences({ onClose }: { onClose: () => void }) {
    const { values, setPreference } = usePreferences();

    return (
        <div className='space-y-5'>
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
                Control UI density, tone, and accent without leaving the page.
            </DialogDescription>
            <div className='space-y-4'>
                {USER_PREFERENCE_DEFINITIONS.map((preference) => {
                    return (
                        <section
                            key={preference.id}
                            className='rounded-2xl border border-white/5 bg-white/5 p-4'
                        >
                            <div className='flex items-center justify-between gap-4'>
                                <div>
                                    <p className='text-sm font-semibold text-white'>{preference.label}</p>
                                    <p className='text-xs text-slate-400'>{preference.description}</p>
                                </div>
                                <span className='text-xs uppercase tracking-[0.2em] text-slate-500'>
                                    {values[preference.id]}
                                </span>
                            </div>
                            <div className='mt-3 flex flex-wrap gap-2'>
                                {preference.options.map((option) => {
                                    const selected = values[preference.id] === option.value;
                                    return (
                                        <Button
                                            key={option.value}
                                            size='sm'
                                            variant={selected ? 'default' : 'outline'}
                                            className='text-xs font-semibold uppercase tracking-[0.3em]'
                                            onClick={() => setPreference(preference.id, option.value)}
                                        >
                                            {option.label}
                                        </Button>
                                    );
                                })}
                            </div>
                            {(() => {
                                const selectedOption = preference.options.find(
                                    (option) => option.value === values[preference.id]
                                );
                                if (!selectedOption?.helper) return null;
                                return <div className='mt-2 text-[11px] text-slate-500'>{selectedOption.helper}</div>;
                            })()}
                        </section>
                    );
                })}
            </div>
            <p className='text-right text-[11px] uppercase tracking-[0.4em] text-slate-500'>
                Automatically stored locally
            </p>
        </div>
    );
}
