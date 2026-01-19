// src/components/top-bar/TopBarSidebarNav.tsx
export function TopBarSidebarNav() {
    return (
        <nav className='space-y-2'>
            <a
                className='block rounded-md px-3 py-2 hover:bg-accent'
                href='/home'
            >
                Home
            </a>
            <a
                className='block rounded-md px-3 py-2 hover:bg-accent'
                href='/players'
            >
                Players
            </a>
            <a
                className='block rounded-md px-3 py-2 hover:bg-accent'
                href='/settings'
            >
                Settings
            </a>
            <a
                className='block rounded-md px-3 py-2 hover:bg-accent'
                href='/setup'
            >
                Setup
            </a>
            <a
                className='block rounded-md px-3 py-2 hover:bg-accent'
                href='/scripts'
            >
                Scripts
            </a>
        </nav>
    );
}
