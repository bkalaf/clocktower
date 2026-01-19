// src/components/top-bar/TopBarBreadcrumbs.tsx
export function TopBarBreadcrumbs() {
    return (
        <div className='flex items-center gap-2 text-sm font-semibold'>
            <span>Game</span>
            <span className='text-muted-foreground'>/</span>
            <span>Setup</span>
        </div>
    );
}
