// src/components/personality/PersonalityMeter.tsx
'use client';

import type { ComponentType, SVGProps } from 'react';
import { Brain, Database, Mic, ShieldCheck, Star, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Personality } from '@/shared/personality';

const ratingColors: Record<number, string> = {
    1: 'text-red-400',
    2: 'text-fuchsia-400',
    3: 'text-amber-400',
    4: 'text-cyan-400',
    5: 'text-sky-400'
};

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type MetricDefinition = {
    key: keyof Personality;
    label: string;
    icon: IconComponent;
    accessor: (personality: Personality) => number;
};

const METRIC_DEFINITIONS: MetricDefinition[] = [
    {
        key: 'trustModel',
        label: 'Trust Model',
        icon: ShieldCheck,
        accessor: (personality) => personality.trustModel
    },
    {
        key: 'tableImpactStyle',
        label: 'Table Impact Style',
        icon: Users,
        accessor: (personality) => personality.tableImpactStyle
    },
    {
        key: 'reasoningMode',
        label: 'Reasoning Mode',
        icon: Brain,
        accessor: (personality) => personality.reasoningMode
    },
    {
        key: 'informationHandling',
        label: 'Information Handling',
        icon: Database,
        accessor: (personality) => personality.informationHandling
    },
    {
        key: 'voiceStyle',
        label: 'Voice Style',
        icon: Mic,
        accessor: (personality) => personality.voiceStyle
    }
];

const STAR_COUNT = 5;

type PersonalityMeterProps = {
    personality: Personality;
    compact?: boolean;
};

export function PersonalityMeter({ personality, compact }: PersonalityMeterProps) {
    const starSizeClass = compact ? 'h-3 w-3' : 'h-4 w-4';
    const labelSizeClass = compact ? 'text-[0.6rem]' : 'text-[0.75rem]';
    const rowSpacingClass = compact ? 'gap-2 py-1' : 'gap-3 py-2';
    const starSpacingClass = compact ? 'gap-0.5' : 'gap-1';

    return (
        <div className={cn('flex flex-col', compact ? 'space-y-1' : 'space-y-1.5')}>
            {METRIC_DEFINITIONS.map((metric) => {
                const value = metric.accessor(personality);
                const colorClass = ratingColors[value] ?? ratingColors[3];
                return (
                    <div
                        key={metric.key}
                        className={cn(
                            'flex items-center justify-between border-b border-white/10 last:border-b-0 last:pb-0',
                            rowSpacingClass
                        )}
                        aria-label={`${metric.label}: ${value} out of 5`}
                    >
                        <div className='flex items-center gap-2'>
                            <metric.icon
                                className={cn('text-white/80', compact ? 'h-3 w-3' : 'h-4 w-4')}
                                aria-hidden='true'
                            />
                            <span className={cn('font-semibold tracking-[0.3em] text-white', labelSizeClass)}>
                                {metric.label}
                            </span>
                            <span className='text-[0.55rem] font-semibold uppercase tracking-[0.35em] text-slate-400'>
                                {value}/5
                            </span>
                        </div>
                        <div className={cn('flex items-center', starSpacingClass)}>
                            {Array.from({ length: STAR_COUNT }, (_, idx) => {
                                const starNumber = idx + 1;
                                const filled = starNumber <= value;
                                return (
                                    <Star
                                        key={starNumber}
                                        className={cn(starSizeClass, filled ? colorClass : 'text-muted-foreground/40')}
                                        aria-label={`${metric.label} star ${starNumber} ${filled ? 'filled' : 'empty'}`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
