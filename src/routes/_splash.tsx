import { createFileRoute, Outlet } from '@tanstack/react-router';
// src/routes/_splash.tsx
export function Component() {
    return (
        <div className='w-full h-full flex justify-center items-center px-6'>
            <Outlet />
        </div>
    );
}

export const Route = createFileRoute('/_splash')({
    component: Component
});
