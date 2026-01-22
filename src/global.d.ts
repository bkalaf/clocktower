// src/global.d.ts
import z from 'zod/v4';
import { NavigateOptions } from '@tanstack/react-router';

declare global {
    export type ZodObjects<
        TPlural extends string,
        TDto extends z.ZodTypeAny,
        TType extends z.ZodTypeAny,
        TListInput extends z.ZodTypeAny,
        TPatch extends z.ZodObject<{
            _id: z.ZodString;
        }>,
        TCreateInput extends z.ZodTypeAny
    > = {
        type: TType;
        dto: TDto;
        listInput: TListInput;
        listOutput: z.ZodObject<{
            [P in TPlural]: z.ZodArray<TDto>;
        }>;
        patch: TPatch;
        createInput: TCreateInput;
        createOutput: z.ZodObject<{
            _id: z.ZodString;
        }>;
        itemOutput: z.ZodObject<{
            item: TDto;
        }>;
        deleteOutput: z.ZodObject<{
            ok: z.ZodLiteral<true>;
        }>;
    };
    export type FK<T, TKey extends keyof T, TForeign> = Omit<T, TKey> & { [P in TKey]: TForeign };

    export type SessionState = {
        authUserId?: string;
        lastRoomId?: string;
        lastGameId?: string;
        userName?: string;
    };

    export type SessionContextValue = SessionState & {
        setAuthUserId: (id?: string) => void;
        setLastRoomId: (id?: string) => void;
        setLastGameId: (id?: string) => void;
        setUsername: (name?: string) => void;
        clear: () => void;
    };
    export type NightCardType =
        | 'you_are_evil'
        | 'you_are_good'
        | 'make_a_choice'
        | 'use_your_ability'
        | 'these_characters_are_out_of_play'
        | 'these_are_your_minions'
        | 'this_is_the_demon'
        | 'you_are';

    export type ModalKind = 'invites' | 'reveal' | 'nightCards' | 'preferences';
    export type Room = {
        _id: string;
        allowTravellers: boolean;
        banner: string;
        connectedUserIds: Record<string, GameRoles>;
        endedAt?: Date;
        hostUserId: string;
        maxPlayers: PcPlayerCount;
        minPlayers: PcPlayerCount;
        maxTravellers: PcTravellerCount;
        plannedStartTime?: Date;
        scriptId?: string;
        skillLevel: SkillLevel;
        speed: GameSpeed;
        visibility: RoomVisibility;
    };
    export type RootSearch = {
        modal?: ModalKind;
        type?: NightCardType;
    };

    export type LooseNavigateOptions = NavigateOptions & {
        search?: Record<string, unknown>; // or Record<string, any>
    };
    export type Alignments = 'good' | 'evil';
    export type CharacterRoles =
        | 'gardener'
        | 'bootlegger'
        | 'spiritofivory'
        | 'sentinel'
        | 'fibbin'
        | 'imp'
        | 'spy'
        | 'scarletwoman'
        | 'baron'
        | 'poisoner'
        | 'drunk'
        | 'saint'
        | 'recluse'
        | 'butler'
        | 'chef'
        | 'librarian'
        | 'washerwoman'
        | 'investigator'
        | 'fortuneteller'
        | 'empath'
        | 'monk'
        | 'undertaker'
        | 'ravenkeeper'
        | 'soldier'
        | 'virgin'
        | 'mayor'
        | 'slayer'
        | 'gunslinger'
        | 'beggar'
        | 'thief'
        | 'bureaucrat'
        | 'scapegoat';
    export type CharacterTypes = 'demon' | 'minion' | 'outsider' | 'townsfolk' | 'loric' | 'fabled' | 'traveller';
    export type CustomScriptFabled = 'spiritofivory' | 'sentinel' | 'fibbin';
    export type DaySubphase = 'dawn_announcements' | 'execution_resolution' | 'discussions';
    export type Demons = 'imp';
    export type Editions = 'tb' | 'bmr' | 'snv' | 'custom';
    export type Fabled = 'spiritofivory' | 'sentinel' | 'fibbin';
    export type GameSpeed = 'slow' | 'moderate' | 'fast';
    export type Loric = 'gardener' | 'bootlegger';
    export type MatchPhase = 'night' | 'day';
    export type MatchStatus = 'setup' | 'in_progress' | 'reveal' | 'complete';
    export type MatchSubphase = 'nominations_open' | 'vote_in_progress' | 'nomination_resolve' | 'execution_resolution';
    export type Minions = 'spy' | 'scarletwoman' | 'baron' | 'poisoner';
    export type NightSubphase = 'resolve_first_night_order' | 'resolve_night_order';
    export type Outsiders = 'drunk' | 'saint' | 'recluse' | 'butler';
    export type PcPlayerCount = 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
    export type PcTravellerCount = 0 | 1 | 2 | 3 | 4 | 5;
    export type PlayerCharacterRoles =
        | 'imp'
        | 'spy'
        | 'scarletwoman'
        | 'baron'
        | 'poisoner'
        | 'drunk'
        | 'saint'
        | 'recluse'
        | 'butler'
        | 'chef'
        | 'librarian'
        | 'washerwoman'
        | 'investigator'
        | 'fortuneteller'
        | 'empath'
        | 'monk'
        | 'undertaker'
        | 'ravenkeeper'
        | 'soldier'
        | 'virgin'
        | 'mayor'
        | 'slayer';
    export type RoomStatus = 'open' | 'closed' | 'in_match' | 'archived';
    export type RoomVisibility = 'public' | 'private';
    export type SessionRoles = 'player' | 'storyteller' | 'spectator';
    export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'veteran';
    export type StorytellerCharacterRoles = 'gardener' | 'bootlegger' | 'spiritofivory' | 'sentinel' | 'fibbin';
    export type StorytellerMode = 'ai' | 'human';
    export type TbDemons = 'imp';
    export type TbMinions = 'spy' | 'scarletwoman' | 'baron' | 'poisoner';
    export type TbOutsiders = 'drunk' | 'saint' | 'recluse' | 'butler';
    export type NominationType = 'execution' | 'exile';
    export type VoteChoice = 'yes' | 'no' | null;
    export type TbPlayerCharacters =
        | 'imp'
        | 'spy'
        | 'scarletwoman'
        | 'baron'
        | 'poisoner'
        | 'drunk'
        | 'saint'
        | 'recluse'
        | 'butler'
        | 'chef'
        | 'librarian'
        | 'washerwoman'
        | 'investigator'
        | 'fortuneteller'
        | 'empath'
        | 'monk'
        | 'undertaker'
        | 'ravenkeeper'
        | 'soldier'
        | 'virgin'
        | 'mayor'
        | 'slayer';
    export type TbTownsfolk =
        | 'chef'
        | 'librarian'
        | 'washerwoman'
        | 'investigator'
        | 'fortuneteller'
        | 'empath'
        | 'monk'
        | 'undertaker'
        | 'ravenkeeper'
        | 'soldier'
        | 'virgin'
        | 'mayor'
        | 'slayer';
    export type TbTravellers = 'gunslinger' | 'beggar' | 'thief' | 'bureaucrat' | 'scapegoat';
    export type Townsfolk =
        | 'chef'
        | 'librarian'
        | 'washerwoman'
        | 'investigator'
        | 'fortuneteller'
        | 'empath'
        | 'monk'
        | 'undertaker'
        | 'ravenkeeper'
        | 'soldier'
        | 'virgin'
        | 'mayor'
        | 'slayer';
    export type Travellers = 'gunslinger' | 'beggar' | 'thief' | 'bureaucrat' | 'scapegoat';
    export type UserRoles = 'moderator' | 'admin' | 'user';
}

export {};
