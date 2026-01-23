# ROOMMACHINE

i need a state machine called RoomMachine that takes an initial argument of Room, see global.d.ts attached. Room should go into context as room, along wtih the following acceptingPlayers a boolean default true, currentMatchId a string (optional) (default: undefined), readyByUserId a Record<string, boolean> default: {}, and storytellerMode a StorytellerMode default 'ai'.
export type Room = {
\_id: string;
allowTravellers: boolean;
banner: string;
connectedUserIds: Record<string, GameRoles>;
endedAt?: Date;
hostUserId: string;
maxPlayers: PcPlayerCount;
minPlayers: PcPlayerCount;
maxTravellers: PcTravellerCount;
plannedStartTime?: Date;
scriptId: string;
skillLevel: SkillLevel;
speed: GameSpeed;
visibility: RoomVisibility;
};
default for room should be : {
\_id: randomUUID(),
allowTravellers: false,
banner: '',
connectedUserIds: {},
hostUserId: '',
maxPlayers: 15,
minPlayers: 5,
maxTravellers: 0,
skillLevel: 'beginner',
speed: 'moderate',
visibility: 'public'
}

events should be : type RoomEvents =
| { type: 'OPEN_ROOM' }
| { type: 'CLOSE_ROOM' }
| { type: 'MATCH_ENDED' }
| { type: 'START_MATCH'; numberOfPlayers: number }
| { type: 'ARCHIVE_ROOM' }
| { type: 'ROOM_UPDATED'; payload: RoomUpdatePayload }
| { type: 'READY_CHANGED'; userId: string; isReady: boolean }
| { type: 'MATCH_STARTED'; payload: { matchId: string } }
| { type: 'MATCH_PHASE_CHANGED'; payload: MatchPhaseSummary }
| { type: 'MATCH_RESET' };

RoomMachine should be parallel with the following states:
roomStatus
roomStatus.open
event CLOSE_ROOM -> roomStatus.closed
event START_MATCH -> roomStatus.in_game
only if readiness.all_ready
roomStatus.closed
event ARCHIVE_ROOM -> roomStatus.archived
event OPEN_ROOM -> roomStatus.open
event START_MATCH -> roomStatus.in_game
only if readiness.all_ready
roomStatus.archived
exit
roomStatus.in_game
invoke: GameMachine
id: game
input: (should take the value of context.maxPlayers)
onDone: move to roomStatus.closed
readiness
readiness.collecting (initial)
event READY_CHANGED(userId, isReady)
should call changeReady({ context }, params: { userId, isReady }) {
const next = context.readyByUserId = { ...context.readyByUserId, [userId]: isReady }
const isAllReady = Object.values(next).every(x => x === true);
if (isAllReady) // move to readiness.all_ready
return {
readyByUserId: next
}
}
readiness.all_ready
event READY_CHANGED(userId, isReady)
should call changeReady just like above but instead of if (isAllReady) it should be if (!isAllReady) // move to readiness.collecting

# SCRIPT INITIALIZATION

export type Script = {
\_id: string;
description?: string;
author?: string;
skillLevel: SkillLevel;
roles: CharacterRoles[];
name: string;
isOfficial: boolean;
isPlayable: boolean;
}
dbName = clocktower
create a mongoose schema and model for the above type for a collection called script
delete all values from the script collection in mongoose
read the json file /home/bobby/clocktower/src/assets/data/editions.json
foreach of these items in this json file add to the script collection in mongoose

# GAMEMACHINE

type TrustModels = 'all_trusting' | 'cautiously_trusting' | 'skeptical' | 'guarded' | 'doubting_thomas';
type TableImpactStyles = 'disruptive' | 'provocative' | 'stabilizing' | 'organized' | 'procedural';
type ReasoningModes = 'deductive' | 'systematic' | 'associative' | 'intuitive' | 'surface';
type InformationHandlingStyle = 'archivist' | 'curator' | 'impressionistic' | 'triage' | 'signal_driven';
type VoiceStyles = 'quiet' | 'reserved' | 'conversational' | 'assertive' | 'dominant';

type Personality = {
trustModel: TrustModels;
tableImpact: TableImpactStyles;
reasoningMode: ReasoningModes;
informationHandling: InformationHandlingStyle;
voiceStyle: VoiceStyles;
};
type GameRoles = 'storyteller' | 'player' | 'spectator';
type StorytellerMode = 'ai' | 'human';
type RolesDefinition = {
id: string;
name: string
edition: string
team: string
firstNight: number
firstNightReminder: string
otherNight: number
otherNightReminder: string
reminders: string[]
setup: boolean
ability: string
remindersGlobal?: string[]
}
type RolesDefined = Omit<RolesDefinition, 'team'> & { characterType: string };
type Hatred = {
id: string
hatred: {
id: string
reason: string
}[]
}[]
interface SetupPopulations {
townsfolk: number
outsider: number
minion: number
demon: number  
 }

targets an argument of {
maxPlayers: number;
connectedUserIds: Record<string, GameRoles>;
storytellerMode: StorytellerMode;
scriptId: string;
}
initial state: setup
onEntry: run function onSetupStart({
maxPlayers, connectedUserIds, storytellerMode
}: {
maxPlayers: number;
connectedUserIds: Record<string, GameRoles>;
storytellerMode: StorytellerMode;
scriptId: string;
}) {
if (storytellerMode === 'human') throw new Error('unsupported at this time');
const humanPlayers = Object.values(connectedUserIds).filter(x => x === 'player').length;
const aiPlayers = maxPlayers - humanPlayers;

    // create a value on context called pendingTasks which is a [string, any][] as an empty array
    // add an entry to pendingTasks called ['demon_bluffs']
    // create an array of Seat (minus id for now) of all players starting with human players, so get all entries from connectedUserIds that have a value of player and add to the array { userId: key of entry, type: 'human', username: we should get this value from the user collection in mongoose findById with the _id = the key value }. Next, for the value of aiPlayers number of times we should add to the array an entry { type: 'ai', username: a randomly generated username (make a list of 25 or so username that are like in a blood on the clocktower game and create a set, pick one and remove it so there are no duplicate names), personality: create a randomly generated personality object }
    // take the array we previously made and randomize the order and then map to a new objects that match the Seat type with id = index + 1
    // this is the value for seats in context

    // next we should get the script for the scriptId from mongoose with _id = scriptId
    // we should read the data in /home/bobby/clocktower/src/assets/data/roles.json which is a RolesDefinition[] as rolesDefinitions but map team to a new field called characterType
    // we should read the data in /home/bobby/clocktower/src/assets/data/roles.json which is a SetupPopulations[] as gameInitialPop

    // we should create a field in context called availableTravellers = script.roles.map(x => rolesDefinitions.find(y => y.id === x)).filter(x => ['traveller'].includes(x.characterType))
    // we should creata a field in context called initialPopulation which is equal to gameInitialPop[maxPlayers - 5]
    // we then need to randomly select an assortment of in play characters based on the initialPopulation we created so let's add to context a field called modifiedPopulation which for now is just a copy of initialPopulation plus a field called extra which has the value { demon: 0, minion: 0, outsider: 0, townsfolk: 0 }
    // create a temporary variable called $roles = script.roles.map(x => rolesDefinitions.find(y => y.id === x)).filter(x => ['demon', 'minion', 'outsider', 'townsfolk'].includes(x.characterType))
    // we should create a field in context for the available roles by character type so set in context availableRoles = { demon: $roles.filter(x => x.characterType === 'demon'), minion: $roles.filter(x => x.characterType === 'minion'), outsider: $roles.filter(x => x.characterType === 'outsider'), townsfolk: $roles.filter(x => x.characterType === 'townsfolk') } with each of the arrays randomized
    // we should create a field on context called bag as an array of our RolesDefinition (with the change made from team => characterType)
    // start with the demons... look at modifiedPopulation.demon take that # of tokens from the array at availableRoles.demon and add those to the bag... if any of the tokens you added have a value of setup === true then call modifySetup(token: RolesDefinition) for each of them in order (we'll define that in a moment). Make sure you update availableRoles.demon with those used tokens removed
    // next do the same thing you just did but with minion so look at modifiedPopulation.minion and pull the # of tokens from availableRoles.minion updating that array, and then checking the setup value and calling modifySetup
    // next do the same thing you just did but with outsider so look at modifiedPopulation.outsider and pull the # of tokens from availableRoles.outsider updating that array, and then checking the setup value and calling modifySetup
    // next do the same thing you just did but with townsfolk so look at modifiedPopulation.townsfolk and pull the # of tokens from availableRoles.townsfolk updating that array, and then checking the setup value and calling modifySetup
    // then let's repeat the process we just did for all of these but for modifiedPopulation.extra.demon, modifiedPopulation.extra.minion, modifiedPopulation.extra.outsider, modifiedPopulation.extra.townsfolk
    // now we have a built bag... verify the length of the bag matched maxPlayers and then randomize the bag and go ahead and create the context field tokens equal to Object.fromEntries(bag.map((x, ix) => [ix + 1, x] as [number, RolesDefined]))


    // let's define modifySetup... it takes an argument of token: RolesDefintiion (with the change from team => characterType).
    // if token.id === 'baron' then it should first calculate a variable called maxOutsider which is equal to availableRoles.outsider.length. Then it should calculate newOutsider which is modifiedPopulation.outsider + 2. If newOutsider <= maxOutsider then set a variable called delta to 2 otherwise set it to 2 - (newOutsider - maxOutsider) unless 2 - (newOutsider - maxOutsider) is <= 0 then it should just be 0.
    now set modifiedPopulation.outsider += delta and modifiedPopulation.townsfolk -= delta
    // if token.id === 'drunk' then change the value of modifiedPopulation.extra.townsfolk to modifiedPopulation.extra.townsfolk + 1 and then add an entry to pendingTasks equal to ['mask_drunk', token]
    // if token.id === 'fortuneteller' then add an entry to pendingTasks equal to ['fortuneteller_redherring', token]

    // set alivePlayers to Object.keys(seats) and set ghostVotes to the same

}

type VoteSuccess = 'fail' | 'success' | 'tied';
type VoteOutcome = {
nominator: number;
nominee: number;
votes: number[];
voteCount: number;
success: VoteSuccess;
}
type VoteComplete = Omit<VoteOutcome, 'success' | 'voteCount'>
type Nomination = {
nominator: number;
nominee: number;
}
type HumanOrAi = 'human' | 'ai';
type Phase = 'night' | 'day';
type Seat = {
id: number;
userId?: string;
username: string;
type: HumanOrAi;
personality?: Personality;
}
context:
seats: Record<number, Seat>; (initial = {})
tokens: Record<number, RolesDefined>; (initial = {})
alivePlayers: number[]; (initial = [])
tasks: [string, any][]; (initial = [])
currentTask?: [string, any];
pendingDeaths: number[]; (initial = [])
canNominate: number[]; (initial = [])
canBeNominated: number[]; (initial = [])
nomination?: Nomination;
markedForExecution?: VoteOutcome;
toBeExecuted?: number[];
votingHistory: Record<number, VoteOutcome[]>; (initial = {})
dailyVotingHistory: VoteOutcome[]; (initial = [])
ghostVotes: number[]; (initial = [])
waitingFor: string[]; (initial = [])
day: number; (initial = 1)
phase: Phase; (initial = 'night')
nominationsOpen: boolean; (initial = false)
states:
gameStatus:
setup (initial)
on SETUP_COMPELETE -> in_progress
in_progress (parallel state)
on END_GAME -> reveal
states:
night: (initial)
states:
night.first_night: (initial)
night.other_night:
day:
on entry run dayReset() which should
set dailyVotingHistory to []
set canBeNominated to alivePlayers.filter(x => !pendingDeaths.includes(x))
set canNominate to alivePlayers.filter(x => !pendingDeaths.includes(x))
on EXECUTION -> day.execution
states:
day.dawn: (initial)
on entry run announceDawn() which sending a signal to clients via  
 ws which shows the DawnBreakDialog in the UI which should require confirmation from all clients that they're ready
set waitingFor equal to Object.values(seats).filter(x => x.type === 'human').map(x => x.userId)
-> day.dawn.waiting
states:
day.dawn.waiting:
on CONFIRM_READY with a payload of string
then run confirmReady(payload) which should remove from waitingFor the payload
if (waitingFor.length === 0) -> day.dawn.running
on OVERRIDE_WAIT move to day.dawn.running
day.dawn.running: (initial)
on entry run announceDawn() which sending a signal to clients via ws which shows the DawnBreakDialog in the UI
-> day.discussion
day.day: (parallel)
on entry run announceDeaths(pendingDeaths) which should
announce deaths to the game (more on this later)
for each number in pendingDeaths it should remove those from the alivePlayers array
set pendingDeaths to []
set waitingFor to []
states:
day.day.timer:
on TIMER_STARTED with a payload of a number
emit TIMER_EXPIRED after payload number of minutes
states:
day.day.timer.running: (initial)
on TIMER_EXPIRED -> day.day.timer.expired
day.day.timer.expired:
emit GONG
day.day.discussion:  
 states:
day.day.discussion.pre_nominations: (initial)
states:
day.discussion.pre_nominations.private: (initial)
on entry
emit TIMER_STARTED with payload 7
on TIMER_EXPIRED
-> day.discussion.pre_nomination.public
day.discussion.pre_nominations.public:
on entry
emit TIMER_STARTED with payload 2
on TIMER_EXPIRED
-> day.day.discussion.nomination
day.day.discussion.nominations:
states:
open: (initial)
on NOMINATION with payload of Nomination
if isValidNomination(payload) which should check canBeNominated.includes(payload.nominatee) && canNominate.includes(payload.nominator) set nomination = payload
then remove payload.nominator from canNominate and remove payload.nominee from canBeNominated
-> day.discussion.nomination.accusation
else run rejectNomination(nomination)
accusation: (parallel)
messages:
states:
idle: (initial)  
 on REQUEST_STATEMENT with payload of number
send a message to the player at seat matching payload asking for a statement
-> waiting
waiting:
on STATEMENT_RECEIVED with payload of string
send a the payload to all players with a payload of { message: event payload of string;
type: the value of parties;
nomination: the value of nomination }
-> emit NEXT_STATEMENT  
 parties:
states:
accuser: (initial)
on entry send REQUEST_STATEMENT with a payload equal to nomination.nominator
on NEXT_STATEMENT -> accused
accused:
on entry send REQUEST_STATEMENT with a payload equal to nomination.nominee
on NEXT_STATEMENT -> vote_in_progress
vote_in_progress:
on entry runVote with a payload of nomination
-> VOTE_COMPLETE with payload of VoteComplete
resolve:
on entry with payload of VoteComplete
run resolveVote(payload) which should
calculate minimumVoteRequired Math.ceil(alivePlayers / 2)
calculate voteCount = payload.votes.length
calculate toBeat = markedForExecution.voteCount ?? 0
calculate success = voteCount < minimumVoteRequired ? 'fail' : voteCount < toBeat ? 'fail' : voteCount === toBeat ? 'tied' : 'success'
calculate result = { ...payload, voteCount, success }
add result to dailyVotingHistory
if (success) set markedForExecution to result
-> open
day.execution:
on entry
if toBeExecuted is not empty
remove any values in toBeExecuted from alivePlayers
else if markedForExecution is not empty
remove markedForExecution.nominee from alivePlayers
reveal
on END_REVEAL -> complete
complete (terminal)
exit
taskQueue:
empty
on ADD_TASK
it should run addTask(payload: [string, any]) which should push an item to tasks and then move itself to running
on PAUSE_TASKS
it should move to paused
on TASK_COMPLETE it should
set currentTask to undefined
running
onEntry it should
run then action runNextTask if currentTask is undefined
on ADD_TASK it should
run addTask(payload: [string, any]) which should push an item to tasks
on TASK_COMPLETE it should
set currentTask to undefined
if (tasks.length === 0) move to empty
it should run the action runNextTask
on PAUSE_TASKS it should
move to paused
waiting
on ADD_TASK it should
run addTask(payload: [string, any]) which should push an item to tasks
on TASK_COMPLETE it should
set currentTask to undefined
if (tasks.length === 0) move to empty
it should move to running  
 on PAUSE_TASKS it should
move to paused  
 paused (initial)
on ADD_TASK it should
run addTask(payload: [string, any]) which should push an item to tasks
on TASK_COMPLETE it should
set currentTask to undefined
on RESUME_TASKS it should
if (tasks.length === 0) move to empty
move to running
on START_TASKS it should
if (tasks.length === 0) move to empty
move to running

[{
	"resource": "/home/bobby/clocktower/src/components/ui/resizable.tsx",
	"owner": "typescript",
	"code": "2339",
	"severity": 8,
	"message": "Property 'PanelGroup' does not exist on type 'typeof import(\"/home/bobby/clocktower/node_modules/react-resizable-panels/dist/react-resizable-panels\")'.",
	"source": "ts",
	"startLineNumber": 6,
	"startColumn": 102,
	"endLineNumber": 6,
	"endColumn": 102
},{
	"resource": "/home/bobby/clocktower/src/components/ui/resizable.tsx",
	"owner": "typescript",
	"code": "2339",
	"severity": 8,
	"message": "Property 'PanelGroup' does not exist on type 'typeof import(\"/home/bobby/clocktower/node_modules/react-resizable-panels/dist/react-resizable-panels\")'.",
	"source": "ts",
	"startLineNumber": 8,
	"startColumn": 29,
	"endLineNumber": 8,
	"endColumn": 29
},{
	"resource": "/home/bobby/clocktower/src/components/ui/resizable.tsx",
	"owner": "typescript",
	"code": "2339",
	"severity": 8,
	"message": "Property 'PanelResizeHandle' does not exist on type 'typeof import(\"/home/bobby/clocktower/node_modules/react-resizable-panels/dist/react-resizable-panels\")'.",
	"source": "ts",
	"startLineNumber": 29,
	"startColumn": 51,
	"endLineNumber": 29,
	"endColumn": 51
},{
	"resource": "/home/bobby/clocktower/src/components/ui/resizable.tsx",
	"owner": "typescript",
	"code": "2339",
	"severity": 8,
	"message": "Property 'PanelResizeHandle' does not exist on type 'typeof import(\"/home/bobby/clocktower/node_modules/react-resizable-panels/dist/react-resizable-panels\")'.",
	"source": "ts",
	"startLineNumber": 33,
	"startColumn": 29,
	"endLineNumber": 33,
	"endColumn": 29
},{
	"resource": "/home/bobby/clocktower/src/components/ui/resizable.tsx",
	"owner": "typescript",
	"code": "2339",
	"severity": 8,
	"message": "Property 'PanelResizeHandle' does not exist on type 'typeof import(\"/home/bobby/clocktower/node_modules/react-resizable-panels/dist/react-resizable-panels\")'.",
	"source": "ts",
	"startLineNumber": 46,
	"startColumn": 30,
	"endLineNumber": 46,
	"endColumn": 30
},{
	"resource": "/home/bobby/clocktower/src/db/connectMongoose.test.ts",
	"owner": "typescript",
	"code": "2451",
	"severity": 8,
	"message": "Cannot redeclare block-scoped variable 'connectMock'.",
	"source": "ts",
	"startLineNumber": 1,
	"startColumn": 7,
	"endLineNumber": 1,
	"endColumn": 7
},{
	"resource": "/home/bobby/clocktower/src/db/models/ChatItem.ts",
	"owner": "typescript",
	"code": "6133",
	"severity": 8,
	"message": "'enums' is declared but its value is never read.",
	"source": "ts",
	"startLineNumber": 6,
	"startColumn": 24,
	"endLineNumber": 6,
	"endColumn": 24
},{
	"resource": "/home/bobby/clocktower/src/db/models/test.ts",
	"owner": "typescript",
	"code": "6133",
	"severity": 8,
	"message": "'zodToJSONSchema' is declared but its value is never read.",
	"source": "ts",
	"startLineNumber": 4,
	"startColumn": 1,
	"endLineNumber": 4,
	"endColumn": 1
},{
	"resource": "/home/bobby/clocktower/src/db/models/test.ts",
	"owner": "typescript",
	"code": "6133",
	"severity": 8,
	"message": "'jsonSchemaToMongoose' is declared but its value is never read.",
	"source": "ts",
	"startLineNumber": 5,
	"startColumn": 1,
	"endLineNumber": 5,
	"endColumn": 1
},{
	"resource": "/home/bobby/clocktower/src/db/models/test.ts",
	"owner": "typescript",
	"code": "6133",
	"severity": 8,
	"message": "'zWhisperId' is declared but its value is never read.",
	"source": "ts",
	"startLineNumber": 8,
	"startColumn": 1,
	"endLineNumber": 8,
	"endColumn": 1
},
{
	"resource": "/home/bobby/clocktower/src/state/TownSquareContext.tsx",
	"owner": "typescript",
	"code": "7006",
	"severity": 8,
	"message": "Parameter 'entry' implicitly has an 'any' type.",
	"source": "ts",
	"startLineNumber": 336,
	"startColumn": 26,
	"endLineNumber": 336,
	"endColumn": 26
}
]


src/components/forms/CreateRoomForm.tsx
'CreateRoomFormInput' refers to a value, but is being used as a type here. Did you mean 'typeof CreateRoomFormInput'?
'CreateRoomFormInput' is declared but its value is never read.
'CreateRoomForm' is declared but its value is never read.
'form' is declared but its value is never read.

## Update GameMachine

* in gameSetupActor after we load scriptRoles
    * let's determine the night order and set these in the context (they should be immutable after this point if possible)
    * create two lists, one ordered by firstNight ascending called firstNightOrderFromScript and the second by otherNight called otherNightOrderFromScript. Then map firstNightOrderFromScript to x => ({ id: x.id, order: x.firstNight, reminder: x.firstNightReminder }) and otherNightOrderFromScript to x => ({ id: x.id, order: x.otherNight, reminder: x.otherNightReminder }) and then set firstNightOrderFromScript and otherNightOrderFromScript in context. the type should be { id: CharacterRoles; order: number; reminder: string }[]
    
    * create a function to get the nightOrder number that's current and set this to be called on entry to first_night and other_night. let's first get alivePlayers and tokens and let's run these steps:
        * create a variable called aliveRoles and take alivePlayers.map(x => tokens[x].id)
        * take firstNightOrderFromScript.filter(x => aliveRoles.includes(x.id)).map((x, ix) => ({ ...x, index: ix + 1 })) and set this as firstNightOrder in context
        * take otherNightOrderFromScript.filter(x => aliveRoles.includes(x.id)).map((x, ix) => ({ ...x, index: ix + 1 })) and set this as otherNightOrder in context
        * set this to on entry for first_night and other_night

    * create an event called END_NIGHT_PHASE -> day that should be set for first_night and other_night

## Update RoomMachine


* let's add to the night state


