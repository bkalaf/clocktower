// src/schemas/enums/index.ts
import { zSessionRoles } from './zSessionRoles';
import { zGlobalRoles } from './zGlobalRoles';
import { zTopicTypes } from './zTopicTypes';
import { zRoomStatus } from './zRoomStatus';
import { zMatchStatus } from './zMatchStatus';
import { zMatchPhase } from './zMatchPhase';
import { zDaySubphase } from './zDaySubphase';
import { zNightSubphase } from './zNightSubphase';
import { zMatchSubphase } from './zMatchSubphase';
import { zRoomVisibility } from './zRoomVisibility';
import { zGameSpeed } from './zGameSpeed';
import { zSkillLevel } from './zSkillLevel';
import { zEditions } from './zEditions';
import z from 'zod/v4';

const enums = {
    characterRoles: z.enum([
        'gardener',
        'bootlegger',
        'spiritofivory',
        'sentinel',
        'fibbin',
        'imp',
        'spy',
        'scarletwoman',
        'baron',
        'poisoner',
        'drunk',
        'saint',
        'recluse',
        'butler',
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
        'slayer',
        'gunslinger',
        'beggar',
        'thief',
        'bureaucrat',
        'scapegoat'
    ]),
    topicTypes: zTopicTypes,
    roomStatus: zRoomStatus,
    matchStatus: zMatchStatus,
    matchPhase: zMatchPhase,
    daySubphase: zDaySubphase,
    nightSubphase: zNightSubphase,
    matchSubphase: zMatchSubphase,
    roomVisibility: zRoomVisibility,
    gameSpeed: zGameSpeed,
    skillLevel: zSkillLevel,
    editions: zEditions,
    globalRoles: zGlobalRoles,
    sessionRoles: zSessionRoles
};
export default enums;
