import { createFileRoute } from '@tanstack/react-router';
// src/routes/_splash.tsx
export function Component() {
    return <div className='text-6xl text-wrap font-extrabold font-rubik'>WELCOME TO CLOCKTOWER</div>;
}

export const Route = createFileRoute('/_splash')({
    component: Component
});
