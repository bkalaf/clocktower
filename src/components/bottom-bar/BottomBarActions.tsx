import { CogIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useViewControls } from '@/components/ViewControlsContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectShowHistoryExpanded, setHistoryExpanded } from '@/store/settings/settings-slice';
import { HistoryPanel } from '@/components/HistoryPanel';

export function BottomBarActions() {
    const { isViewControlsOpen, toggleViewControls } = useViewControls();
    const dispatch = useAppDispatch();
    const isHistoryExpanded = useAppSelector(selectShowHistoryExpanded);

    return (
        <div className='mx-auto flex min-h-14 max-w-screen-sm items-center justify-between gap-4 px-4 py-3 text-sm font-semibold'>
            <div className='flex flex-1 items-center justify-start'>Chat</div>
            <div className='flex flex-1 items-center justify-center'>
                <Button
                    size='sm'
                    variant={isViewControlsOpen ? 'default' : 'outline'}
                    type='button'
                    onClick={toggleViewControls}
                    className={cn(
                        'gap-2 text-[11px] font-semibold uppercase tracking-wide',
                        isViewControlsOpen ?
                            'bg-blue-700 text-white hover:bg-blue-600'
                        :   'focus-visible:outline focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-blue-400 focus-visible:outline-offset-2'
                    )}
                >
                    <CogIcon className='h-4 w-4' />
                    View Controls
                </Button>
            </div>
            <div className='relative flex flex-1 items-center justify-end'>
                <Button
                    size='sm'
                    variant={isHistoryExpanded ? 'secondary' : 'outline'}
                    type='button'
                    onClick={() => dispatch(setHistoryExpanded(!isHistoryExpanded))}
                    className={[
                        'gap-2 text-[11px] font-semibold uppercase tracking-wide',
                        isHistoryExpanded && 'bg-blue-700 text-white hover:bg-blue-600'
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    History
                </Button>
                <HistoryPanel />
            </div>
        </div>
    );
}
