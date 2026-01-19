// src/global.d.ts
import { NavigateOptions } from '@tanstack/react-router';

declare global {
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
    export type PcTravelerCount = 0 | 1 | 2 | 3 | 4 | 5;
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
