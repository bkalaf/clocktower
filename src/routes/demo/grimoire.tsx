// src/routes/demo/grimoire.tsx
import { createFileRoute } from '@tanstack/react-router';
import { GrimoireBoard } from '@/components/grimoire/GrimoireBoard';

export const Route = createFileRoute('/demo/grimoire')({
    component: GrimoireRoute
});

function GrimoireRoute() {
    return (
        <div className='min-h-screen bg-black text-white'>
            <GrimoireBoard />
        </div>
    );
}
