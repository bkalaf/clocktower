// src/components/grimoire/NotesDrawer.tsx
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

type NotesDrawerProps = {
    open: boolean;
    roomId: string;
    markdown: string;
    onChange: (value: string) => void;
    onOpenChange: (open: boolean) => void;
};

export function NotesDrawer({ open, roomId, markdown, onChange, onOpenChange }: NotesDrawerProps) {
    const [mode, setMode] = React.useState<'edit' | 'preview'>('edit');

    return (
        <Drawer
            open={open}
            onOpenChange={onOpenChange}
            direction='right'
        >
                <DrawerContent
                    className='bg-slate-900 text-white'
                    side='right'
                    style={{ top: '72px', bottom: '72px' }}
                >
                <DrawerHeader className='px-6 pt-6'>
                    <div className='flex items-center justify-between gap-2'>
                        <DrawerTitle className='text-lg uppercase tracking-[0.5em]'>Room Notes</DrawerTitle>
                        <DrawerClose className='text-white/60'>
                            <X className='h-4 w-4' />
                            <span className='sr-only'>Close notes</span>
                        </DrawerClose>
                    </div>
                    <p className='text-[0.65rem] uppercase tracking-[0.4em] text-white/60'>{roomId}</p>
                    <div className='mt-3 flex gap-2'>
                        <Button
                            variant={mode === 'edit' ? 'secondary' : 'ghost'}
                            size='sm'
                            onClick={() => setMode('edit')}
                        >
                            Edit
                        </Button>
                        <Button
                            variant={mode === 'preview' ? 'secondary' : 'ghost'}
                            size='sm'
                            onClick={() => setMode('preview')}
                        >
                            Preview
                        </Button>
                    </div>
                    <p className='mt-2 text-[0.6rem] uppercase tracking-[0.35em] text-white/40'>
                        Markdown friendly · stored locally
                    </p>
                </DrawerHeader>

                <div className='flex-1 overflow-auto px-6 pb-6'>
                    {mode === 'edit' ?
                        <Textarea
                            value={markdown}
                            onChange={(event) => onChange(event.target.value)}
                            placeholder='# Notes for this room…'
                            className='min-h-[70vh]'
                        />
                    :   <div className='prose prose-invert max-w-none text-sm leading-relaxed'>
                            {markdown ?
                                <ReactMarkdown>{markdown}</ReactMarkdown>
                            :   <p>No notes yet. Switch to edit mode to add your thoughts.</p>}
                        </div>
                    }
                </div>

                <DrawerFooter className='px-6 pb-6 pt-2'>
                    <p className='text-[0.65rem] text-white/50'>
                        Notes persist in local storage and will sync with future persistence hooks.
                    </p>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
