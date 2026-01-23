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

function runTest(obj: any, name: string) {
    // console.log(`***** ${name} ****`)
    // console.log(`zGame`, obj);
    // console.log(`zGame.toJSONSchema()`, JSON.stringify(zodToJSONSchema(obj), null, '\t'));
    // console.log(jsonSchemaToMongoose(zodToJSONSchema(obj)));
    void obj;
    void name;
}

runTest(zGameMember, 'GameMember');
runTest(zGame, 'Game');
runTest(zSession, 'Session');
runTest(zWhisper, 'Whisper');
runTest(zChatItem, 'ChatItem');
runTest(zGameMember, 'GameMember');
