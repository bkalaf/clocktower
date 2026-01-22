// src/schemas/enums/_enums.ts
export const roomVisibility = ['public', 'private'];
export const roomStatus = ['open', 'closed', 'in_match', 'archived'];
export const matchStatus = ['setup', 'in_progress', 'reveal', 'complete'];
export const matchPhase = ['night', 'day'];
export const daySubphase = ['dawn_announcements', 'execution_resolution', 'discussions'];
export const nightSubphase = ['resolve_first_night_order', 'resolve_night_order'];
export const matchSubphase = ['nominations_open', 'vote_in_progress', 'nomination_resolve', 'execution_resolution'];
export const gameSpeed = ['slow', 'moderate', 'fast'];
export const editions = ['tb', 'bmr', 'snv', 'custom'];
export const tbDemons = ['imp'];
export const tbMinions = ['spy', 'scarletwoman', 'baron', 'poisoner'];
export const tbOutsiders = ['drunk', 'saint', 'recluse', 'butler'];
export const tbTownsfolk = [
    'chef',
    'librarian',
    'washerwoman',
    'investigator',
    'fortuneteller',
    'empath',
    'monk',
    'undertaker',
    'ravenkeeper',
    'soldier',
    'virgin',
    'mayor',
    'slayer'
];
export const tbPlayerCharacters = [...tbDemons, ...tbMinions, ...tbOutsiders, ...tbTownsfolk];
export const tbTravellers = ['gunslinger', 'beggar', 'thief', 'bureaucrat', 'scapegoat'];
export const demons = [...tbDemons];
export const minions = [...tbMinions];
export const outsiders = [...tbOutsiders];
export const townsfolk = [...tbTownsfolk];
export const customScriptFabled = ['spiritofivory', 'sentinel', 'fibbin'];
export const loric = ['gardener', 'bootlegger'];
export const fabled = [...customScriptFabled];
export const travellers = [...tbTravellers];
export const storytellerCharacterRoles = [...loric, ...fabled];
export const playerCharacterRoles = [...demons, ...minions, ...outsiders, ...townsfolk];
export const characterRoles = [...storytellerCharacterRoles, ...playerCharacterRoles, ...travellers];
export const characterTypes = ['demon', 'minion', 'outsider', 'townsfolk', 'loric', 'fabled', 'traveller'];
export const alignments = ['good', 'evil'];
export const skillLevel = ['beginner', 'intermediate', 'advanced', 'expert', 'veteran'];
export const userRoles = ['moderator', 'admin', 'user'];
export const sessionRoles = ['player', 'storyteller', 'spectator'];
export const pcPlayerCount = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
export const pcTravelerCount = [0, 1, 2, 3, 4, 5];
export const storytellerMode = ['ai', 'human'];
export const nominationType = ['execution', 'exile'];
export const voteChoice = ['yes', 'no', 'abstain'];

// console.log(characterRoles)
