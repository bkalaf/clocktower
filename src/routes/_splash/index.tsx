// src/routes/_splash/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { TownSquareExperience } from '@/components/townsquare/TownSquareExperience';

export const Route = createFileRoute('/_splash/')({
    component: DashboardRoute
});

function DashboardRoute() {
    return <TownSquareExperience />;
}
