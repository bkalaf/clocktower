// src/components/townsquare/TownSquareExperience.tsx
import * as React from 'react';
import { TownSquareProvider } from '@/state/TownSquareContext';
import { TownSquareLayout } from './TownSquareLayout';

export function TownSquareExperience() {
    return (
        <TownSquareProvider>
            <TownSquareLayout />
        </TownSquareProvider>
    );
}
