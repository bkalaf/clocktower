// src/db/models/test.ts
//src/db/models/test.ts
import z from 'zod/v4';
import { zodToJSONSchema } from '../../utils/zodToMongoose';
import { jsonSchemaToMongoose } from '../../utils/jsonSchemaToMongoose';

const zPCPlayerCount = z.union([z.literal(5), z.literal(6), z.literal(7), z.literal(8)]);

const zGame = z.object({
    _id: z.uuid('Must be a UUID'),
    version: z.int().min(0, 'Must be greater than or equal to 0.'),
    snapshot: z.any(),
    hostUserId: z.uuid('Must be a UUID').meta({ $ref: 'user', description: 'The host userId' }),
    status: z.enum(['idle', 'building', 'playing', 'reveal', 'setup', 'ended']).default('idle'),
    endedAt: z.date().optional().nullable(),
    lobbySettings: z.object({
        minPlayers: z
            .int()
            .min(5, 'Play count must be between 5 and 15')
            .max(15, 'Play count must be between 5 and 15')
            .default(5),
        maxPlayers: zPCPlayerCount.default(5),
        allowTravelers: z.boolean().default(false),
        maxTravelers: z
            .int()
            .min(0, 'Traveler count must be 0 to 5')
            .max(5, 'Traveler count must be 5 or under')
            .nullable()
            .optional(),
        edition: z.enum(['tb', 'snv', 'bmr', 'custom', 'homebrew']).default('tb'),
        skillLevel: z.enum(['novice', 'intermediate', 'advanced', 'expert']).default('novice'),
        plannedStart: z.date(),
        gameSpeed: z.enum(['slow', 'moderate', 'fast']).default('moderate'),
        isPrivate: z.boolean().default(false),
        banner: z.string().default('')
    })
});

console.log(`zGame`, zGame);

console.log(`zGame.toJSONSchema()`, JSON.stringify(zodToJSONSchema(zGame), null, '\t'));

console.log(jsonSchemaToMongoose(zodToJSONSchema(zGame)));
