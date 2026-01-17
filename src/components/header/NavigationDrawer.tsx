import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronDown, ChevronRight, Home, Network, StickyNote, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTitle } from '@/components/ui/sheet';

type NavigationDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

const navLinkBase = 'flex items-center gap-3 p-3 rounded-lg transition-colors font-medium text-white mb-2';

export function NavigationDrawer({ isOpen, onClose }: NavigationDrawerProps) {
    const [groupedExpanded, setGroupedExpanded] = useState<Record<string, boolean>>({});

    return (
        <Sheet
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            <SheetContent
                side='left'
                className='bg-gray-900 text-white border-r border-white/10 w-80 p-0'
            >
                <div className='flex items-center justify-between border-b border-white/10 px-4 py-3'>
                    <SheetTitle className='text-lg font-semibold text-white p-0'>Navigation</SheetTitle>
                    <SheetClose asChild>
                        <Button
                            variant='ghost'
                            size='icon'
                            aria-label='Close menu'
                        >
                            <X size={20} />
                        </Button>
                    </SheetClose>
                </div>

                <nav className='flex flex-1 flex-col overflow-y-auto px-4 py-6'>
                    <Link
                        to='/'
                        onClick={onClose}
                        className={`${navLinkBase} hover:bg-gray-800`}
                        activeProps={{
                            className: `${navLinkBase} bg-cyan-600 hover:bg-cyan-700`
                        }}
                    >
                        <Home size={20} />
                        <span>Home</span>
                    </Link>

                    <Link
                        to='/demo/start/api-request'
                        onClick={onClose}
                        className={`${navLinkBase} hover:bg-gray-800`}
                        activeProps={{
                            className: `${navLinkBase} bg-cyan-600 hover:bg-cyan-700`
                        }}
                    >
                        <Network size={20} />
                        <span>Start - API Request</span>
                    </Link>

                    <div className='flex flex-row items-start justify-between'>
                        <Link
                            to='/demo/start/ssr'
                            onClick={onClose}
                            className={`${navLinkBase} flex-1 hover:bg-gray-800`}
                            activeProps={{
                                className: `${navLinkBase} flex-1 bg-cyan-600 hover:bg-cyan-700`
                            }}
                        >
                            <StickyNote size={20} />
                            <span>Start - SSR Demos</span>
                        </Link>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() =>
                                setGroupedExpanded((prev) => ({
                                    ...prev,
                                    StartSSRDemo: !prev.StartSSRDemo
                                }))
                            }
                            aria-label='Toggle Start SSR list'
                        >
                            {groupedExpanded.StartSSRDemo ?
                                <ChevronDown size={20} />
                            :   <ChevronRight size={20} />}
                        </Button>
                    </div>

                    {groupedExpanded.StartSSRDemo && (
                        <div className='flex flex-col ml-4'>
                            <Link
                                to='/demo/start/ssr/spa-mode'
                                onClick={onClose}
                                className={`${navLinkBase} ml-0 hover:bg-gray-800`}
                                activeProps={{
                                    className: `${navLinkBase} bg-cyan-600 hover:bg-cyan-700`
                                }}
                            >
                                <StickyNote size={20} />
                                <span>SPA Mode</span>
                            </Link>

                            <Link
                                to='/demo/start/ssr/full-ssr'
                                onClick={onClose}
                                className={`${navLinkBase} ml-0 hover:bg-gray-800`}
                                activeProps={{
                                    className: `${navLinkBase} bg-cyan-600 hover:bg-cyan-700`
                                }}
                            >
                                <StickyNote size={20} />
                                <span>Full SSR</span>
                            </Link>

                            <Link
                                to='/demo/start/ssr/data-only'
                                onClick={onClose}
                                className={`${navLinkBase} ml-0 hover:bg-gray-800`}
                                activeProps={{
                                    className: `${navLinkBase} bg-cyan-600 hover:bg-cyan-700`
                                }}
                            >
                                <StickyNote size={20} />
                                <span>Data Only</span>
                            </Link>
                        </div>
                    )}

                    <Link
                        to='/demo/tanstack-query'
                        onClick={onClose}
                        className={`${navLinkBase} hover:bg-gray-800`}
                        activeProps={{
                            className: `${navLinkBase} bg-cyan-600 hover:bg-cyan-700`
                        }}
                    >
                        <Network size={20} />
                        <span>TanStack Query</span>
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
