// src/components/personality/PersonalityTooltip.tsx
'use client';

import * as React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { PersonalityMeter } from './PersonalityMeter';
import type { Personality } from '@/shared/personality';

export type PersonalityTooltipProps = {
    personality: Personality;
    compact?: boolean;
    children: React.ReactElement;
};

export function PersonalityTooltip({ personality, compact = true, children }: PcTooltipProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent className='max-w-[260px] rounded-2xl border border-slate-200/70 bg-white p-3 shadow-lg text-sm text-slate-900'>
                <PersonalityMeter
                    personality={personality}
                    compact={compact}
                />
            </TooltipContent>
        </Tooltip>
    );
}
