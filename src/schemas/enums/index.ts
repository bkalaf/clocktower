// src/schemas/enums/index.ts
import { zSessionRoles } from './zSessionRoles';
import { zGlobalRoles } from './zGlobalRoles';
import { zTopicTypes } from './zTopicTypes';
import { zGameStatus } from './zGameStatus';
import { zGameSpeed } from './zGameSpeed';
import { zSkillLevel } from './zSkillLevel';
import { zEditions } from './zEditions';

const enums = {
    topicTypes: zTopicTypes,
    gameStatus: zGameStatus,
    gameSpeed: zGameSpeed,
    skillLevel: zSkillLevel,
    editions: zEditions,
    globalRoles: zGlobalRoles,
    sessionRoles: zSessionRoles
};
export default enums;
