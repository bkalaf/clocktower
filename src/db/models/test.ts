// src/db/models/test.ts
//src/db/models/test.ts
import z from 'zod/v4';
import { zodToJSONSchema } from '../../utils/zodToMongoose';
import { jsonSchemaToMongoose } from '../../utils/jsonSchemaToMongoose';
import { zGameMember } from './GameMember';
import { zSession } from './Session';
import { zWhisperId } from '../../schemas/aliases/zWhisperId';
import { zWhisper } from './Whisper';
import { zGame } from './Game';
import { zChatItem } from './ChatItem';

const zPCPlayerCount = z.union([z.literal(5), z.literal(6), z.literal(7), z.literal(8)]);

// const zGame = z.object({
//     _id: z.uuid('Must be a UUID'),
//     version: z.int().min(0, 'Must be greater than or equal to 0.'),
//     snapshot: z.any(),
//     hostUserId: z.uuid('Must be a UUID').meta({ $ref: 'user', description: 'The host userId' }),
//     status: z.enum(['idle', 'building', 'playing', 'reveal', 'setup', 'ended']).default('idle'),
//     endedAt: z.date().optional().nullable(),
//     lobbySettings: z.object({
//         minPlayers: z
//             .int()
//             .min(5, 'Play count must be between 5 and 15')
//             .max(15, 'Play count must be between 5 and 15')
//             .default(5),
//         maxPlayers: zPCPlayerCount.default(5),
//         allowTravelers: z.boolean().default(false),
//         maxTravelers: z
//             .int()
//             .min(0, 'Traveler count must be 0 to 5')
//             .max(5, 'Traveler count must be 5 or under')
//             .nullable()
//             .optional(),
//         edition: z.enum(['tb', 'snv', 'bmr', 'custom', 'homebrew']).default('tb'),
//         skillLevel: z.enum(['novice', 'intermediate', 'advanced', 'expert']).default('novice'),
//         plannedStart: z.date(),
//         gameSpeed: z.enum(['slow', 'moderate', 'fast']).default('moderate'),
//         isPrivate: z.boolean().default(false),
//         banner: z.string().default('')
//     })
// });

function runTest(obj: any, name: string) {
    console.log(`***** ${name} ****`)
    console.log(`zGame`, obj);

    console.log(`zGame.toJSONSchema()`, JSON.stringify(zodToJSONSchema(obj), null, '\t'));

    console.log(jsonSchemaToMongoose(zodToJSONSchema(obj)));
}

runTest(zGameMember, 'GameMember');
runTest(zGame, 'Game');
runTest(zSession, 'Session');
runTest(zWhisper, 'Whisper');
runTest(zChatItem, 'ChatItem');
runTest(zGameMember, 'GameMember');
