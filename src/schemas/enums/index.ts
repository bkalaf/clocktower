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

const enums = {
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
