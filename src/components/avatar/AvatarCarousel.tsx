'use client';

import * as React from 'react';
import { AgeGroup, ArchTypeCategory, Gender, GeographicOrigin } from '@/generateArchtypePrompt';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Baby, Glasses, Mars, Venus } from 'lucide-react';

const avatarImports = import.meta.glob('../../assets/**/*.{png,jpg,jpeg,webp}', {
    as: 'url',
    eager: true
}) as Record<string, string>;

type SocialStanding = 'lowborn' | 'commoner' | 'noble' | 'elite';
type ArchetypeState = 'civilian' | 'spellcaster' | 'brute';

type AvatarMetadata = {
    geographyId: number;
    geographyLabel: string;
    ageGroupId: number;
    ageLabel: string;
    genderId: number;
    genderLabel: string;
    group1Id: number;
    group2Id: number;
    socialStanding: SocialStanding;
    archetype: ArchetypeState;
    archTypeCategory: ArchTypeCategory;
};

type AvatarRecord = {
    path: string;
    src: string;
    filename: string;
    metadata: AvatarMetadata;
};

const GENDER_PREFERENCE_TOLERANCE = 1;
const GENDER_FALLBACK_TOLERANCE = 2;
const GENDER_SLIDER_TICKS = [1, 2, 3, 4, 5];
const AGE_SLIDER_TICKS = [1, 2, 3, 4, 5, 6, 7];
const SOCIAL_STANDING_OPTIONS: SocialStanding[] = ['lowborn', 'commoner', 'noble', 'elite'];

const ARCHETYPE_LABELS: Record<ArchTypeCategory, ArchetypeState> = {
    [ArchTypeCategory.civilian]: 'civilian',
    [ArchTypeCategory.spellcaster]: 'spellcaster',
    [ArchTypeCategory.brute]: 'brute'
};

const allAvatarRecords: AvatarRecord[] = Object.entries(avatarImports)
    .map(([path, src]) => {
        const filename = path.split('/').pop() ?? '';
        if (filename.toLowerCase().startsWith('reject-')) {
            return null;
        }
        const metadata = parseAvatarMetadata(filename);
        if (!metadata) {
            return null;
        }
        return {
            path,
            src,
            filename,
            metadata
        };
    })
    .filter((record): record is AvatarRecord => Boolean(record))
    .sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true }));

function parseAvatarMetadata(filename: string): AvatarMetadata | null {
    const tokens = filename.split('_');
    const numericTokens: string[] = [];

    for (const token of tokens) {
        if (/^\d+$/.test(token)) {
            numericTokens.push(token);
        } else {
            break;
        }
    }

    if (numericTokens.length < 5) {
        return null;
    }

    const [geographyToken, ageToken, genderToken, group1Token, group2Token, archCategoryToken] = numericTokens;

    const geographyId = Number(geographyToken);
    const ageGroupId = Number(ageToken);
    const genderId = Number(genderToken);
    const group1Id = Number(group1Token);
    const group2Id = Number(group2Token);
    const archTypeCategoryId = archCategoryToken ? Number(archCategoryToken) : ArchTypeCategory.civilian;

    if ([geographyId, ageGroupId, genderId, group1Id, group2Id].some((value) => Number.isNaN(value))) {
        return null;
    }

    const geographyLabel = GeographicOrigin[geographyId] ?? 'Unknown';
    const ageLabel = AgeGroup[ageGroupId] ?? 'Unknown';
    const genderLabel = Gender[genderId] ?? 'Unknown';
    const archetypeCategory = Number.isNaN(archTypeCategoryId) ? ArchTypeCategory.civilian : archTypeCategoryId;
    const socialStanding = deriveSocialStanding(group1Id, group2Id);
    const archetype = deriveArchetypeState(archetypeCategory);

    return {
        geographyId,
        geographyLabel,
        ageGroupId,
        ageLabel,
        genderId,
        genderLabel,
        group1Id,
        group2Id,
        socialStanding,
        archetype,
        archTypeCategory: archetypeCategory as ArchTypeCategory
    };
}

function deriveSocialStanding(group1: number, group2: number): SocialStanding {
    if (group1 === 2 && group2 === 3) {
        return 'elite';
    }
    if (group1 === 2) {
        return 'noble';
    }
    if (group1 === 1) {
        return 'commoner';
    }
    return 'lowborn';
}

function deriveArchetypeState(category: number): ArchetypeState {
    if (category === ArchTypeCategory.brute) {
        return 'brute';
    }
    if (category === ArchTypeCategory.spellcaster) {
        return 'spellcaster';
    }
    return 'civilian';
}

type AvatarCarouselProps = {
    imageDir?: string;
    onSelect: (avatarPath: string) => void;
};

export function AvatarCarousel({ imageDir = 'avatars', onSelect }: AvatarCarouselProps) {
    const normalizedDir = React.useMemo(() => imageDir.replace(/^\/+|\/+$/g, ''), [imageDir]);

    const filteredByDir = React.useMemo(() => {
        if (!normalizedDir) {
            return allAvatarRecords;
        }
        const matcher = `/${normalizedDir}/`;
        return allAvatarRecords.filter((record) => record.path.includes(matcher));
    }, [normalizedDir]);

    const originOptions = React.useMemo(() => {
        const seen = new Set<number>();
        filteredByDir.forEach((record) => seen.add(record.metadata.geographyId));
        return Array.from(seen)
            .map((id) => ({ id, label: GeographicOrigin[id] ?? 'Unknown' }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [filteredByDir]);

    const [selectedOrigin, setSelectedOrigin] = React.useState('all');
    const [genderPreference, setGenderPreference] = React.useState(3);
    const [agePreference, setAgePreference] = React.useState(4);
    const [selectedSocialStanding, setSelectedSocialStanding] = React.useState<SocialStanding | 'all'>('all');
    const [selectedArchetype, setSelectedArchetype] = React.useState<ArchetypeState>('civilian');
    const [carouselApi, setCarouselApi] = React.useState<CarouselApi | null>(null);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const filteredImages = React.useMemo(() => {
        const originFilter = selectedOrigin === 'all' ? null : Number(selectedOrigin);
        const ageFilter = agePreference - 1;
        const genderTarget = genderPreference - 1;
        const standingFilter = selectedSocialStanding === 'all' ? null : selectedSocialStanding;

        const baseMatches = filteredByDir.filter((record) => {
            const { metadata } = record;
            const matchesOrigin = originFilter === null || metadata.geographyId === originFilter;
            const matchesAge = metadata.ageGroupId === ageFilter;
            const matchesStanding = standingFilter === null || metadata.socialStanding === standingFilter;
            const matchesArchetype = metadata.archetype === selectedArchetype;
            return matchesOrigin && matchesAge && matchesStanding && matchesArchetype;
        });

        const filteredByGender = baseMatches.filter(
            (record) => Math.abs(record.metadata.genderId - genderTarget) <= GENDER_PREFERENCE_TOLERANCE
        );

        if (filteredByGender.length > 0) {
            return filteredByGender;
        }

        const fallback = baseMatches.filter(
            (record) => Math.abs(record.metadata.genderId - genderTarget) <= GENDER_FALLBACK_TOLERANCE
        );

        return fallback.length > 0 ? fallback : baseMatches;
    }, [filteredByDir, selectedOrigin, agePreference, genderPreference, selectedSocialStanding, selectedArchetype]);

    React.useEffect(() => {
        if (!carouselApi) {
            return;
        }
        if (filteredImages.length === 0) {
            setCurrentIndex(0);
            carouselApi.scrollTo(0);
            return;
        }

        setCurrentIndex((prev) => {
            const nextIndex = Math.min(prev, filteredImages.length - 1);
            carouselApi.scrollTo(nextIndex);
            return nextIndex;
        });
    }, [carouselApi, filteredImages.length]);

    React.useEffect(() => {
        if (!carouselApi) {
            return;
        }

        const handleSelect = () => {
            const next = carouselApi.selectedScrollSnap();
            setCurrentIndex(next);
        };

        handleSelect();
        carouselApi.on('select', handleSelect);
        return () => carouselApi.off('select', handleSelect);
    }, [carouselApi]);

    const currentAvatar = filteredImages[currentIndex];
    const hasImages = filteredImages.length > 0;

    const genderLabel = Gender[Math.max(0, genderPreference - 1)] ?? 'Neutral';
    const ageLabel = AgeGroup[Math.max(0, Math.min(AGE_SLIDER_TICKS.length - 1, agePreference - 1))] ?? 'Any age';

    return (
        <div className='flex w-full flex-col items-center justify-center gap-6 text-foreground'>
            <div className='relative flex h-[50vh] w-[80vw] max-w-[1200px] items-center justify-center overflow-hidden rounded-2xl border border-border bg-background/40 shadow-xl'>
                <Carousel setApi={setCarouselApi} className='h-full w-full'>
                    <CarouselContent>
                        {hasImages ? (
                            filteredImages.map((record) => (
                                <CarouselItem key={record.src}>
                                    <div className='flex h-full w-full items-center justify-center p-6'>
                                        <img
                                            src={record.src}
                                            alt={`Avatar preview (${record.metadata.geographyLabel}, ${record.metadata.ageLabel})`}
                                            className='h-full w-full max-h-full max-w-full object-contain'
                                            loading='lazy'
                                        />
                                    </div>
                                </CarouselItem>
                            ))
                        ) : (
                            <CarouselItem>
                                <div className='flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center text-sm text-muted-foreground'>
                                    <p>No avatars match the current filters.</p>
                                    <p>Try relaxing one of the sliders or selects to reveal more artwork.</p>
                                </div>
                            </CarouselItem>
                        )}
                    </CarouselContent>
                </Carousel>
                <CarouselPrevious aria-label='Previous avatar' />
                <CarouselNext aria-label='Next avatar' />
            </div>

            <div className='flex w-[80vw] max-w-[1200px] flex-wrap items-start gap-4'>
                <div className='flex w-full flex-col gap-2 sm:w-[220px]'>
                    <span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Geographic Origin</span>
                    <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Any origin' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='all'>Any origin</SelectItem>
                            {originOptions.map((option) => (
                                <SelectItem key={option.id} value={`${option.id}`}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className='flex w-full flex-col gap-2 sm:w-[260px]'>
                    <span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Gender Expression</span>
                    <div className='flex items-center gap-3'>
                        <Mars className='size-5 text-muted-foreground' aria-hidden />
                        <div className='flex-1'>
                            <Slider
                                value={[genderPreference]}
                                onValueChange={(value) => setGenderPreference(value[0])}
                                min={1}
                                max={5}
                                step={1}
                                aria-label='Gender preference'
                                className='h-6'
                            />
                            <div className='mt-1 flex items-center justify-between text-[10px] text-muted-foreground'>
                                {GENDER_SLIDER_TICKS.map((tick) => (
                                    <span key={`gender-${tick}`} className='h-1 w-[2px] rounded-full bg-border' />
                                ))}
                            </div>
                        </div>
                        <Venus className='size-5 text-muted-foreground' aria-hidden />
                    </div>
                    <p className='text-xs text-muted-foreground'>Preference: {genderLabel}</p>
                </div>

                <div className='flex w-full flex-col gap-2 sm:w-[260px]'>
                    <span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Age Band</span>
                    <div className='flex items-center gap-3'>
                        <Baby className='size-5 text-muted-foreground' aria-hidden />
                        <div className='flex-1'>
                            <Slider
                                value={[agePreference]}
                                onValueChange={(value) => setAgePreference(value[0])}
                                min={1}
                                max={7}
                                step={1}
                                aria-label='Age band'
                                className='h-6'
                            />
                            <div className='mt-1 flex items-center justify-between text-[10px] text-muted-foreground'>
                                {AGE_SLIDER_TICKS.map((tick) => (
                                    <span key={`age-${tick}`} className='h-1 w-[2px] rounded-full bg-border' />
                                ))}
                            </div>
                        </div>
                        <Glasses className='size-5 text-muted-foreground' aria-hidden />
                    </div>
                    <p className='text-xs text-muted-foreground'>Current band: {ageLabel}</p>
                </div>

                <div className='flex w-full flex-col gap-2 sm:w-[220px]'>
                    <span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Social Standing</span>
                    <Select value={selectedSocialStanding} onValueChange={(value) => setSelectedSocialStanding(value as SocialStanding | 'all')}>
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Any standing' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='all'>Any standing</SelectItem>
                            {SOCIAL_STANDING_OPTIONS.map((standing) => (
                                <SelectItem key={standing} value={standing}>
                                    {standing}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className='flex w-full flex-col gap-2 sm:w-[220px]'>
                    <span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Archetype</span>
                    <ToggleGroup
                        type='single'
                        value={selectedArchetype}
                        onValueChange={(value) => value && setSelectedArchetype(value as ArchetypeState)}
                        aria-label='Archetype filter'
                        className='w-full justify-between'
                    >
                        {Object.values(ArchTypeCategory)
                            .filter((value) => typeof value === 'number')
                            .map((category) => {
                                const label = ARCHETYPE_LABELS[category as ArchTypeCategory];
                                return (
                                    <ToggleGroupItem key={label} value={label} className='flex-1 text-center'>
                                        {label}
                                    </ToggleGroupItem>
                                );
                            })}
                    </ToggleGroup>
                </div>
            </div>

            <div className='flex w-[80vw] max-w-[1200px] flex-wrap items-center justify-between gap-4'>
                <div className='flex flex-col text-sm text-muted-foreground'>
                    <span>Matches: {filteredImages.length}</span>
                    {currentAvatar && (
                        <span>Viewing: {currentAvatar.filename}</span>
                    )}
                </div>
                <Button
                    variant='secondary'
                    disabled={!currentAvatar}
                    onClick={() => currentAvatar && onSelect(currentAvatar.src)}
                >
                    Confirm selection
                </Button>
            </div>
        </div>
    );
}
