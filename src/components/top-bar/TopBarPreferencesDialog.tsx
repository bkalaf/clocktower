// src/components/top-bar/TopBarPreferencesDialog.tsx
import * as React from 'react';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Settings } from 'lucide-react';

export function TopBarPreferencesDialog() {
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

    return (
        <Dialog
            open={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
        >
            <Button
                variant='ghost'
                className='h-9 px-3 gap-2'
                type='button'
                onClick={() => setIsSettingsOpen(true)}
            >
                <Settings className='h-4 w-4' />
                Settings (Preferences)
            </Button>
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader>
                    <DialogTitle>Preferences</DialogTitle>
                    <DialogDescription>Adjust game UI visibility settings.</DialogDescription>
                </DialogHeader>
                <div className='space-y-4'>
                    {/* <div className='border-b border-border/60 pb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                        Preferences
                    </div>
                    <div className='flex flex-wrap items-center justify-between gap-4'>
                        <div>
                            <div className='text-sm font-semibold'>Grimoire shape</div>
                            <div className='text-xs text-muted-foreground'>
                                Choose the layout shape for the grimoire board.
                            </div>
                        </div>
                        <ToggleGroup
                            type='single'
                            value={grimoireShape}
                            variant='outline'
                            size='sm'
                            spacing={0}
                            onValueChange={(value) => {
                               
                            }}
                        >
                            <ToggleGroupItem value='circle'>Circle</ToggleGroupItem>
                            <ToggleGroupItem value='square'>Square</ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    <div className='border-b border-border/60 pb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                        Night order badges
                    </div>
                    <div className='flex items-center justify-between gap-4'>
                        <div>
                            <div className='text-sm font-semibold'>Show night order badges</div>
                            <div className='text-xs text-muted-foreground'>Toggle all night order indicators.</div>
                        </div>
                        <Switch
                            checked={showNightOrder}
                            onCheckedChange={(value) => dispatch(setShowNightOrder(value))}
                        />
                    </div>
                    <div className='flex items-center justify-between gap-4'>
                        <div>
                            <div className='text-sm font-semibold'>Show first-night order</div>
                            <div className='text-xs text-muted-foreground'>Show the blue first-night badges.</div>
                        </div>
                        <Switch
                            checked={showFirstNightOrder}
                            onCheckedChange={(value) => dispatch(setShowFirstNightOrder(value))}
                        />
                    </div>
                    <div className='flex items-center justify-between gap-4'>
                        <div>
                            <div className='text-sm font-semibold'>Show other-night order</div>
                            <div className='text-xs text-muted-foreground'>Show the red other-night badges.</div>
                        </div>
                        <Switch
                            checked={showOtherNightOrder}
                            onCheckedChange={(value) => dispatch(setShowOtherNightOrder(value))}
                        />
                    </div> */}
                </div>
            </DialogContent>
        </Dialog>
    );
}
