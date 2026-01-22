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

Property 'id' does not exist on type '{ _id: string; name: string; author: string; description: string; skillLevel: string; roles: string[]; isOfficial: boolean; isPlayable: boolean; } | { _id: string; name: string; author: string; description: string; skillLevel: string; roles: string[]; isPlayable: boolean; isOfficial?: undefined; }'.
Property 'level' does not exist on type '{ _id: string; name: string; author: string; description: string; skillLevel: string; roles: string[]; isOfficial: boolean; isPlayable: boolean; } | { _id: string; name: string; author: string; description: string; skillLevel: string; roles: string[]; isPlayable: boolean; isOfficial?: undefined; }'.
Property 'id' does not exist on type '{ _id: string; name: string; author: string; description: string; skillLevel: string; roles: string[]; isOfficial: boolean; isPlayable: boolean; } | { _id: string; name: string; author: string; description: string; skillLevel: string; roles: string[]; isPlayable: boolean; isOfficial?: undefined; }'.
Type '"xs"' is not assignable to type '"default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg" | null | undefined'.
Module '"lucide-react"' has no exported member 'Heartbeat'.
Module '"lucide-react"' has no exported member 'VoteYea'.
Property 'id' does not exist on type '{ _id: string; name: string; author: string; description: string; skillLevel: string; roles: string[]; isOfficial: boolean; isPlayable: boolean; } | { _id: string; name: string; author: string; description: string; skillLevel: string; roles: string[]; isPlayable: boolean; isOfficial?: undefined; }'.
  Property 'id' does not exist on type '{ _id: string; name: string; author: string; description: string; skillLevel: string; roles: string[]; isOfficial: boolean; isPlayable: boolean; }'.
'session' is declared but its value is never read.
'language' is declared but its value is never read.
Type '(kind: TownSquareModalKind) => void' is not assignable to type '(modal: string) => void'.
Module '"lucide-react"' has no exported member 'VoteYea'.
'player' is declared but its value is never read.
Argument of type '{ timestamp: number; nominator: string; nominee: string; type: string; majority: number; votes: string[]; }' is not assignable to parameter of type '{ timestamp: number; nominator: string; nominee: string; type: "execution" | "exile"; majority: number; votes: string[]; }'.
Property 'PanelGroup' does not exist on type 'typeof import("/home/bobby/clocktower/node_modules/react-resizable-panels/dist/react-resizable-panels")'.
Property 'PanelGroup' does not exist on type 'typeof import("/home/bobby/clocktower/node_modules/react-resizable-panels/dist/react-resizable-panels")'.
Property 'PanelResizeHandle' does not exist on type 'typeof import("/home/bobby/clocktower/node_modules/react-resizable-panels/dist/react-resizable-panels")'.
Property 'PanelResizeHandle' does not exist on type 'typeof import("/home/bobby/clocktower/node_modules/react-resizable-panels/dist/react-resizable-panels")'.
Property 'PanelResizeHandle' does not exist on type 'typeof import("/home/bobby/clocktower/node_modules/react-resizable-panels/dist/react-resizable-panels")'.
Cannot redeclare block-scoped variable 'connectMock'.
'enums' is declared but its value is never read.
'zodToJSONSchema' is declared but its value is never read.
'jsonSchemaToMongoose' is declared but its value is never read.
'zWhisperId' is declared but its value is never read.
'zPCPlayerCount' is declared but its value is never read.
'obj' is declared but its value is never read.
'name' is declared but its value is never read.
Object literal may only specify known properties, and 'roomId' does not exist in type '{ unique?: boolean | undefined; sparse?: boolean | undefined; expireAfterSeconds?: number | undefined; }'.
Type '<TContext extends MachineContext, TExpressionEvent extends AnyEventObject, TParams extends ParameterizedObject["params"] | undefined, TEvent extends EventObject, TActor extends ProvidedActor>(assignment: Assigner<LowInfer<TContext>, TExpressionEvent, TParams, TEvent, TActor> | PropertyAssigner<...>) => ActionFunctio...' has no signatures for which the type argument list is applicable.
Object literal may only specify known properties, and 'payload' does not exist in type 'EventObject'.
This expression is not callable.
  Type '{}' has no call signatures.
Parameter '_' implicitly has an 'any' type.
Parameter 'event' implicitly has an 'any' type.
This expression is not callable.
  Type '{}' has no call signatures.
Parameter 'context' implicitly has an 'any' type.
Parameter 'event' implicitly has an 'any' type.
This expression is not callable.
  Type '{}' has no call signatures.
This expression is not callable.
  Type '{}' has no call signatures.
Parameter 'context' implicitly has an 'any' type.
Generic type 'ActionArgs<TContext, TExpressionEvent, TEvent>' requires 3 type argument(s).
Generic type 'ActionArgs<TContext, TExpressionEvent, TEvent>' requires 3 type argument(s).
Generic type 'ActionArgs<TContext, TExpressionEvent, TEvent>' requires 3 type argument(s).
Generic type 'ActionArgs<TContext, TExpressionEvent, TEvent>' requires 3 type argument(s).
Generic type 'ActionArgs<TContext, TExpressionEvent, TEvent>' requires 3 type argument(s).
This expression is not callable.
  Type '{}' has no call signatures.
Parameter 'context' implicitly has an 'any' type.
Parameter 'event' implicitly has an 'any' type.
This expression is not callable.
  Type '{}' has no call signatures.
This expression is not callable.
  Type '{}' has no call signatures.
This expression is not callable.
  Type '{}' has no call signatures.
Parameter 'context' implicitly has an 'any' type.
Parameter 'event' implicitly has an 'any' type.
Parameter 'id' implicitly has an 'any' type.
Parameter 'id' implicitly has an 'any' type.
Generic type 'ActionArgs<TContext, TExpressionEvent, TEvent>' requires 3 type argument(s).
This expression is not callable.
  Type '{}' has no call signatures.
Parameter 'context' implicitly has an 'any' type.
'seat' is of type 'unknown'.
'seat' is of type 'unknown'.
'seat' is of type 'unknown'.
This expression is not callable.
  Type '{}' has no call signatures.
Parameter 'context' implicitly has an 'any' type.
Parameter 'event' implicitly has an 'any' type.
Parameter 'userId' implicitly has an 'any' type.
This expression is not callable.
  Type '{}' has no call signatures.
Generic type 'ActionArgs<TContext, TExpressionEvent, TEvent>' requires 3 type argument(s).
Generic type 'ActionArgs<TContext, TExpressionEvent, TEvent>' requires 3 type argument(s).
This expression is not callable.
  Type '{}' has no call signatures.
Parameter 'context' implicitly has an 'any' type.
Parameter 'id' implicitly has an 'any' type.
This expression is not callable.
  Type '{}' has no call signatures.
Parameter 'context' implicitly has an 'any' type.
Parameter 'id' implicitly has an 'any' type.
This expression is not callable.
  Type '{}' has no call signatures.
This expression is not callable.
  Type '{}' has no call signatures.
Parameter 'context' implicitly has an 'any' type.
Parameter 'id' implicitly has an 'any' type.
Property 'setupArgs' does not exist on type '{ context: GameContext; event: { type: "SETUP_COMPLETE"; payload: Partial<GameContext>; } | { type: "END_GAME"; } | { type: "END_REVEAL"; } | { type: "EXECUTION"; } | ... 15 more ... | { ...; }; self: ActorRef<...>; }'.
Property 'nomination' does not exist on type 'ActionArgs<GameContext, { type: "SETUP_COMPLETE"; payload: Partial<GameContext>; } | { type: "END_GAME"; } | { type: "END_REVEAL"; } | { type: "EXECUTION"; } | ... 15 more ... | { ...; }, { ...; } | ... 18 more ... | { ...; }>'.
Property 'nomination' does not exist on type 'ActionArgs<GameContext, { type: "SETUP_COMPLETE"; payload: Partial<GameContext>; } | { type: "END_GAME"; } | { type: "END_REVEAL"; } | { type: "EXECUTION"; } | ... 15 more ... | { ...; }, { ...; } | ... 18 more ... | { ...; }>'.
Property 'nomination' does not exist on type 'ActionArgs<GameContext, { type: "SETUP_COMPLETE"; payload: Partial<GameContext>; } | { type: "END_GAME"; } | { type: "END_REVEAL"; } | { type: "EXECUTION"; } | ... 15 more ... | { ...; }, { ...; } | ... 18 more ... | { ...; }>'.
Property 'nomination' does not exist on type 'ActionArgs<GameContext, { type: "SETUP_COMPLETE"; payload: Partial<GameContext>; } | { type: "END_GAME"; } | { type: "END_REVEAL"; } | { type: "EXECUTION"; } | ... 15 more ... | { ...; }, { ...; } | ... 18 more ... | { ...; }>'.
Export declaration conflicts with exported declaration of 'GameMachineWsEvent'.
Property 'aliveById' does not exist on type 'MatchContext'.
'event' is possibly 'null' or 'undefined'.
Property 'type' does not exist on type '{}'.
'event' is possibly 'null' or 'undefined'.
Property 'payload' does not exist on type '{}'.
'event' is possibly 'null' or 'undefined'.
Property 'type' does not exist on type '{}'.
'event' is possibly 'null' or 'undefined'.
Property 'payload' does not exist on type '{}'.
Property 'dayNumber' does not exist on type 'AssignArgs<MatchContext, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { type: "REVEAL_COMPLETE"; } | { type: "OPEN_NOMINATIONS"; } | { type: "CLOSE_NOMINATIONS"; } | ... 11 more ... | { ...; }, { ...; } | ... 16 more ... | { ...; }, never>'.
Property 'nominationsOpen' does not exist on type 'AssignArgs<MatchContext, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { type: "REVEAL_COMPLETE"; } | { type: "OPEN_NOMINATIONS"; } | { type: "CLOSE_NOMINATIONS"; } | ... 11 more ... | { ...; }, { ...; } | ... 16 more ... | { ...; }, never>'.
Property 'breakoutWhispersEnabled' does not exist on type 'AssignArgs<MatchContext, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { type: "REVEAL_COMPLETE"; } | { type: "OPEN_NOMINATIONS"; } | { type: "CLOSE_NOMINATIONS"; } | ... 11 more ... | { ...; }, { ...; } | ... 16 more ... | { ...; }, never>'.
Property 'playerSeatMap' does not exist on type 'AssignArgs<MatchContext, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { type: "REVEAL_COMPLETE"; } | { type: "OPEN_NOMINATIONS"; } | { type: "CLOSE_NOMINATIONS"; } | ... 11 more ... | { ...; }, { ...; } | ... 16 more ... | { ...; }, never>'.
Property 'aliveById' does not exist on type 'AssignArgs<MatchContext, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { type: "REVEAL_COMPLETE"; } | { type: "OPEN_NOMINATIONS"; } | { type: "CLOSE_NOMINATIONS"; } | ... 11 more ... | { ...; }, { ...; } | ... 16 more ... | { ...; }, never>'.
Property 'isTravelerById' does not exist on type 'AssignArgs<MatchContext, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { type: "REVEAL_COMPLETE"; } | { type: "OPEN_NOMINATIONS"; } | { type: "CLOSE_NOMINATIONS"; } | ... 11 more ... | { ...; }, { ...; } | ... 16 more ... | { ...; }, never>'.
Property 'ghostVoteAvailableById' does not exist on type 'AssignArgs<MatchContext, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { type: "REVEAL_COMPLETE"; } | { type: "OPEN_NOMINATIONS"; } | { type: "CLOSE_NOMINATIONS"; } | ... 11 more ... | { ...; }, { ...; } | ... 16 more ... | { ...; }, never>'.
Property 'voteHistory' does not exist on type 'AssignArgs<MatchContext, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { type: "REVEAL_COMPLETE"; } | { type: "OPEN_NOMINATIONS"; } | { type: "CLOSE_NOMINATIONS"; } | ... 11 more ... | { ...; }, { ...; } | ... 16 more ... | { ...; }, never>'.
Property 'onTheBlock' does not exist on type 'AssignArgs<MatchContext, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { type: "REVEAL_COMPLETE"; } | { type: "OPEN_NOMINATIONS"; } | { type: "CLOSE_NOMINATIONS"; } | ... 11 more ... | { ...; }, { ...; } | ... 16 more ... | { ...; }, never>'.
Property 'roomId' does not exist on type 'AssignArgs<MatchContext, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { type: "REVEAL_COMPLETE"; } | { type: "OPEN_NOMINATIONS"; } | { type: "CLOSE_NOMINATIONS"; } | ... 11 more ... | { ...; }, { ...; } | ... 16 more ... | { ...; }, never>'.
Property 'scriptId' does not exist on type 'AssignArgs<MatchContext, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { type: "REVEAL_COMPLETE"; } | { type: "OPEN_NOMINATIONS"; } | { type: "CLOSE_NOMINATIONS"; } | ... 11 more ... | { ...; }, { ...; } | ... 16 more ... | { ...; }, never>'.
All destructured elements are unused.
'params' is declared but its value is never read.
All destructured elements are unused.
'params' is declared but its value is never read.
All destructured elements are unused.
'params' is declared but its value is never read.
All destructured elements are unused.
'params' is declared but its value is never read.
'context' is declared but its value is never read.
This comparison appears to be unintentional because the types 'VoteChoice' and '"abstain"' have no overlap.
'event' is declared but its value is never read.
'params' is declared but its value is never read.
All destructured elements are unused.
All destructured elements are unused.
All destructured elements are unused.
Type '{ actions: string; }' is not assignable to type 'TransitionConfigOrTarget<MatchContext, { type: "MATCH_DATA_LOADED"; payload: { _id: string; roomId: string; status: "setup" | "in_progress" | "reveal" | "complete"; phase: "night" | "day"; subphase: "day.dawn_announcements" | ... 7 more ... | "night.resolve_night_order"; ... 14 more ...; voteHistory?: { ...; }[] | ....'.
Type '{ actions: string; }' is not assignable to type 'TransitionConfigOrTarget<MatchContext, { type: "MATCH_PHASE_CHANGED"; payload: MatchPhasePayload; }, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { ...; } | ... 13 more ... | { ...; }, ... 5 more ..., MetaObject>'.
Type '{ actions: string; }' is not assignable to type 'TransitionConfigOrTarget<MatchContext, { type: "MATCH_RESET"; }, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { type: "REVEAL_COMPLETE"; } | { type: "OPEN_NOMINATIONS"; } | ... 12 more ... | { ...; }, ... 5 more ..., MetaObject>'.
Type 'string' is not assignable to type 'Actions<MatchContext, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { type: "REVEAL_COMPLETE"; } | { type: "OPEN_NOMINATIONS"; } | { type: "CLOSE_NOMINATIONS"; } | ... 11 more ... | { ...; }, ... 6 more ..., EventObject> | undefined'.
Type '{ target: string; guard: { type: "canNominateAndBeNominated"; }; actions: { type: string; }; }' is not assignable to type 'TransitionConfigOrTarget<MatchContext, { type: "NOMINATION_ATTEMPTED"; payload: { nominatorId: string; nomineeId: string; nominationType: NominationType; }; }, { type: "DAWN"; } | ... 16 more ... | { ...; }, ... 5 more ..., MetaObject>'.
Type '{ actions: { type: string; }; guard: { type: "canVote"; }; }' is not assignable to type 'TransitionConfigOrTarget<MatchContext, { type: "VOTE_CAST"; payload: { voterId: string; choice: VoteChoice; }; }, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { ...; } | ... 13 more ... | { ...; }, ... 5 more ..., MetaObject>'.
Type 'string' is not assignable to type 'ActionFunction<MatchContext, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { type: "REVEAL_COMPLETE"; } | { type: "OPEN_NOMINATIONS"; } | { type: "CLOSE_NOMINATIONS"; } | ... 11 more ... | { ...; }, ... 6 more ..., EventObject>'.
Type 'string' is not assignable to type 'ActionFunction<MatchContext, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { type: "REVEAL_COMPLETE"; } | { type: "OPEN_NOMINATIONS"; } | { type: "CLOSE_NOMINATIONS"; } | ... 11 more ... | { ...; }, ... 6 more ..., EventObject>'.
Object literal may only specify known properties, and 'type' does not exist in type 'Actions<MatchContext, { type: "TRAVELER_REQUESTED"; requestId: string; userId: string; }, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { type: "REVEAL_COMPLETE"; } | ... 13 more ... | { ...; }, ... 5 more ..., EventObject>'.
Object literal may only specify known properties, and 'type' does not exist in type 'Actions<MatchContext, { type: "TRAVELER_REQUESTED"; requestId: string; userId: string; }, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { type: "REVEAL_COMPLETE"; } | ... 13 more ... | { ...; }, ... 5 more ..., EventObject>'.
Object literal may only specify known properties, and 'type' does not exist in type 'Actions<MatchContext, { type: "DECIDE_TRAVELER"; requestId: string; decision: string; characterRole: string; }, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | ... 14 more ... | { ...; }, ... 5 more ..., EventObject>'.
Type '{ target: string; actions: { type: string; params: { requestId: string; }; }; }' is not assignable to type 'TransitionConfigOrTarget<MatchContext, { type: "TRAVELER_REQUESTED"; requestId: string; userId: string; }, { type: "DAWN"; } | { type: "DUSK"; } | { type: "CLOCKTOWER_GONG"; } | { type: "REVEAL_COMPLETE"; } | ... 13 more ... | { ...; }, ... 5 more ..., MetaObject>'.
'createMachine' is declared but its value is never read.
'MatchStatus' is declared but never used.
'RoomStatus' is declared but never used.
Argument of type '({ context, event }: AssignArgs<RoomContext, RoomEvents>) => { hostUserId: any; } | undefined' is not assignable to parameter of type 'Assigner<RoomContext, { type: "OPEN_ROOM"; } | { type: "CLOSE_ROOM"; } | { type: "MATCH_ENDED"; } | { type: "START_MATCH"; } | { type: "ARCHIVE_ROOM"; } | { type: "CONDITION_MET"; } | ... 13 more ... | { ...; }, unknown, { ...; } | ... 18 more ... | { ...; }, never> | PropertyAssigner<...>'.
'context' is declared but its value is never read.
Generic type 'AssignArgs<TContext, TExpressionEvent, TEvent, TActor>' requires 4 type argument(s).
'context' is declared but its value is never read.
Property 'status' does not exist on type '{ _id: string; allowTravellers: boolean; banner: string; connectedUserIds: string[]; hostUserId: string; maxPlayers: 13 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 14 | 15; maxTravellers: 0 | 2 | 1 | 5 | 3 | 4; ... 7 more ...; scriptId?: string | undefined; }'.
'context' is declared but its value is never read.
'event' is of type 'unknown'.
'event' is of type 'unknown'.
'event' is of type 'unknown'.
Property 'readyByUserId' does not exist on type 'AssignArgs<RoomContext, { type: "OPEN_ROOM"; } | { type: "CLOSE_ROOM"; } | { type: "MATCH_ENDED"; } | { type: "START_MATCH"; } | { type: "ARCHIVE_ROOM"; } | { type: "CONDITION_MET"; } | { ...; } | ... 12 more ... | { ...; }, { ...; } | ... 18 more ... | { ...; }, never>'.
'event' is of type 'unknown'.
'event' is of type 'unknown'.
'event' is of type 'unknown'.
'event' is of type 'unknown'.
Argument of type '(_: AssignArgs<RoomContext, { type: "OPEN_ROOM"; } | { type: "CLOSE_ROOM"; } | { type: "MATCH_ENDED"; } | { type: "START_MATCH"; } | { type: "ARCHIVE_ROOM"; } | { type: "CONDITION_MET"; } | ... 13 more ... | { ...; }, { ...; } | ... 18 more ... | { ...; }, never>, event: unknown) => { ...; } | { ...; }' is not assignable to parameter of type 'Assigner<RoomContext, { type: "OPEN_ROOM"; } | { type: "CLOSE_ROOM"; } | { type: "MATCH_ENDED"; } | { type: "START_MATCH"; } | { type: "ARCHIVE_ROOM"; } | { type: "CONDITION_MET"; } | ... 13 more ... | { ...; }, unknown, { ...; } | ... 18 more ... | { ...; }, never> | PropertyAssigner<...>'.
'event' is of type 'unknown'.
'event' is of type 'unknown'.
Argument of type '() => { hostGrace: null; }' is not assignable to parameter of type 'Assigner<RoomContext, { type: "OPEN_ROOM"; } | { type: "CLOSE_ROOM"; } | { type: "MATCH_ENDED"; } | { type: "START_MATCH"; } | { type: "ARCHIVE_ROOM"; } | { type: "CONDITION_MET"; } | ... 13 more ... | { ...; }, unknown, { ...; } | ... 18 more ... | { ...; }, never> | PropertyAssigner<...>'.
'context' is declared but its value is never read.
'event' is of type 'unknown'.
'event' is of type 'unknown'.
'event' is of type 'unknown'.
'event' is of type 'unknown'.
'event' is of type 'unknown'.
'event' is of type 'unknown'.
'event' is of type 'unknown'.
Property 'dayNumber' does not exist on type 'AssignArgs<RoomContext, { type: "OPEN_ROOM"; } | { type: "CLOSE_ROOM"; } | { type: "MATCH_ENDED"; } | { type: "START_MATCH"; } | { type: "ARCHIVE_ROOM"; } | { type: "CONDITION_MET"; } | { ...; } | ... 12 more ... | { ...; }, { ...; } | ... 18 more ... | { ...; }, never>'.
'event' is of type 'unknown'.
Property 'nominationsOpen' does not exist on type 'AssignArgs<RoomContext, { type: "OPEN_ROOM"; } | { type: "CLOSE_ROOM"; } | { type: "MATCH_ENDED"; } | { type: "START_MATCH"; } | { type: "ARCHIVE_ROOM"; } | { type: "CONDITION_MET"; } | { ...; } | ... 12 more ... | { ...; }, { ...; } | ... 18 more ... | { ...; }, never>'.
Object literal may only specify known properties, and 'type' does not exist in type 'TransitionConfig<RoomContext, { type: "ROOM_UPDATED"; payload: RoomUpdatePayload; }, { type: "OPEN_ROOM"; } | { type: "CLOSE_ROOM"; } | { type: "MATCH_ENDED"; } | { type: "START_MATCH"; } | ... 15 more ... | { ...; }, ... 5 more ..., MetaObject>'.
'context' is declared but its value is never read.
Binding element 'context' implicitly has an 'any' type.
Cannot redeclare block-scoped variable 'connectMock'.
'useMemo' is declared but its value is never read.
'redirect' is declared but its value is never read.
'useSession' is declared but its value is never read.
'data' is declared but its value is never read.
Cannot find name 'zAuthUser'.
Property 'makeReadyInput' does not exist on type '{ gameMember: { schema: Schema<{ role: "player" | "storyteller" | "spectator"; isSeated: boolean; _id: string; gameId: string; userId: string; joinedAt: Date; }, Model<{ role: "player" | "storyteller" | "spectator"; ... 4 more ...; joinedAt: Date; }, ... 5 more ..., { ...; }>, ... 8 more ..., { ...; }>; model: Model...'.
'isReady' is declared but its value is never read.
'$params' is declared but its value is never read.
Cannot find name 'gameId'. Did you mean 'zGameId'?
Cannot find name 'gameId'. Did you mean 'zGameId'?
Property 'data' does not exist on type 'ParseErr | ParseOk<{ gameId: string; isReady: boolean; }>'.
Cannot find name 'gameId'. Did you mean 'zGameId'?
Property 'data' does not exist on type 'ParseErr | ParseOk<{ gameId: string; isReady: boolean; }>'.
Cannot find name 'gameId'. Did you mean 'zGameId'?
'request' is declared but its value is never read.
Cannot find name 'getUserFromCookie'.
Cannot find name 'requireRole'.
Cannot find name 'created'.
Type '() => Promise<Result<{ ok: boolean; }>>' is not assignable to type 'RouteMethodHandlerFn<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, AnyContext, ... 6 more ..., undefined>, ... 4 more ..., any>'.
Type '({ params }: RouteMethodHandlerCtx<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, ... 7 more ..., undefined>, "/api/invites/$inviteId/accept", ResolveParams<...>, unknown, any>) => Promise<...>' is not assignable to type 'RouteMethodHandlerFn<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, AnyContext, ... 6 more ..., undefined>, ... 4 more ..., any>'.
Type '({ params }: RouteMethodHandlerCtx<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, ... 7 more ..., undefined>, "/api/invites/$inviteId/cancel", ResolveParams<...>, unknown, any>) => Promise<...>' is not assignable to type 'RouteMethodHandlerFn<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, AnyContext, ... 6 more ..., undefined>, ... 4 more ..., any>'.
Type '({ params }: RouteMethodHandlerCtx<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, ... 7 more ..., undefined>, "/api/invites/$inviteId/reject", ResolveParams<...>, unknown, any>) => Promise<...>' is not assignable to type 'RouteMethodHandlerFn<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, AnyContext, ... 6 more ..., undefined>, ... 4 more ..., any>'.
Type '({ params }: RouteMethodHandlerCtx<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, ... 7 more ..., undefined>, "/api/matches/$matchId", ResolveParams<...>, unknown, any>) => Promise<...>' is not assignable to type 'RouteMethodHandlerFn<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, AnyContext, ... 6 more ..., undefined>, ... 4 more ..., any>'.
Type '({ params, request }: RouteMethodHandlerCtx<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, ... 7 more ..., undefined>, "/api/matches/$matchId/phase", ResolveParams<...>, unknown, any>) => Promise<...>' is not assignable to type 'RouteMethodHandlerFn<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, AnyContext, ... 6 more ..., undefined>, ... 4 more ..., any>'.
Conversion of type '{ day: number; nominationType: "execution" | "exile"; nominatorId: string; nomineeId: string; votesFor: number; threshold: number; passed: boolean; votes: { voterId: string; choice: "yes" | "no" | "abstain"; usedGhost?: boolean | undefined; }[]; ts: Date; }[]' to type 'VoteHistoryRecord[]' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
Type '({ params, request }: RouteMethodHandlerCtx<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, ... 7 more ..., undefined>, "/api/matches/$matchId/travel-approve", ResolveParams<...>, unknown, any>) => Promise<...>' is not assignable to type 'RouteMethodHandlerFn<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, AnyContext, ... 6 more ..., undefined>, ... 4 more ..., any>'.
Type '({ params, request }: RouteMethodHandlerCtx<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, ... 7 more ..., undefined>, "/api/matches/$matchId/travel-deny", ResolveParams<...>, unknown, any>) => Promise<...>' is not assignable to type 'RouteMethodHandlerFn<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, AnyContext, ... 6 more ..., undefined>, ... 4 more ..., any>'.
Type '({ params, request }: RouteMethodHandlerCtx<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, ... 7 more ..., undefined>, "/api/matches/$matchId/travel-request", ResolveParams<...>, unknown, any>) => Promise<...>' is not assignable to type 'RouteMethodHandlerFn<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, AnyContext, ... 6 more ..., undefined>, ... 4 more ..., any>'.
Type '({ params }: RouteMethodHandlerCtx<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, ... 7 more ..., undefined>, "/api/rooms/$roomId", ResolveParams<...>, unknown, any>) => Promise<...>' is not assignable to type 'RouteMethodHandlerFn<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, AnyContext, ... 6 more ..., undefined>, ... 4 more ..., any>'.
Type '({ params, request }: RouteMethodHandlerCtx<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, ... 7 more ..., undefined>, "/api/rooms/$roomId/invites", ResolveParams<...>, unknown, any>) => Promise<...>' is not assignable to type 'RouteMethodHandlerFn<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, AnyContext, ... 6 more ..., undefined>, ... 4 more ..., any>'.
Type '({ params }: RouteMethodHandlerCtx<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, ... 7 more ..., undefined>, "/api/rooms/$roomId/match", ResolveParams<...>, unknown, any>) => Promise<...>' is not assignable to type 'RouteMethodHandlerFn<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, AnyContext, ... 6 more ..., undefined>, ... 4 more ..., any>'.
Type '({ params, request }: RouteMethodHandlerCtx<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, ... 7 more ..., undefined>, "/api/rooms/$roomId/script", ResolveParams<...>, unknown, any>) => Promise<...>' is not assignable to type 'RouteMethodHandlerFn<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, AnyContext, ... 6 more ..., undefined>, ... 4 more ..., any>'.
Property 'scriptId' does not exist on type '{ _id: string; skillLevel: "beginner" | "intermediate" | "advanced" | "expert" | "veteran"; roles: ("gardener" | "bootlegger" | "spiritofivory" | "sentinel" | "fibbin" | "imp" | ... 25 more ... | "scapegoat")[]; name: string; isOfficial: boolean; edition?: "tb" | ... 3 more ... | undefined; } & Required<...> & { ......'.
Property 'scriptId' does not exist on type '{ _id: string; skillLevel: "beginner" | "intermediate" | "advanced" | "expert" | "veteran"; roles: ("gardener" | "bootlegger" | "spiritofivory" | "sentinel" | "fibbin" | "imp" | ... 25 more ... | "scapegoat")[]; name: string; isOfficial: boolean; edition?: "tb" | ... 3 more ... | undefined; } & Required<...> & { ......'.
Module '"../../../../types/game"' has no exported member 'StorytellerMode'.
Type '({ params }: RouteMethodHandlerCtx<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, ... 7 more ..., undefined>, "/api/rooms/$roomId/start-match", ResolveParams<...>, unknown, any>) => Promise<...>' is not assignable to type 'RouteMethodHandlerFn<Register, RootRoute<Register, (search: Record<string, unknown>) => RootSearch, MyRouterContext, AnyContext, AnyContext, ... 6 more ..., undefined>, ... 4 more ..., any>'.
Property 'maxPlayers' does not exist on type '{ _id: string; version: number; snapshot: any; hostUserId: string; status: "open" | "closed" | "in_match" | "archived"; scriptId: string; allowTravelers: boolean; visibility: "public" | "private"; endedAt: Date; lobbySettings?: { ...; } | ... 1 more ... | undefined; } & Required<...> & { ...; }'.
Argument of type 'string | null | undefined' is not assignable to parameter of type 'string'.
No overload matches this call.
No overload matches this call.
Property 'lobbySettings' does not exist on type '{ visibility: "public" | "private"; status: "open" | "closed" | "in_match" | "archived"; minPlayers: 13 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 14 | 15; maxPlayers: 13 | 5 | 6 | 7 | 8 | 9 | ... 4 more ... | 15; ... 6 more ...; hostUserId?: string | ... 1 more ... | undefined; }'.
Property 'room' does not exist on type 'RoomContext'.
Property 'roomId' does not exist on type 'RoomContext'.
Property 'status' does not exist on type 'RoomContext'.
Property 'allowTravelers' does not exist on type 'RoomContext'. Did you mean 'allowTravellers'?
Property 'travelerUserIds' does not exist on type 'MatchContext'.
'zGameId' is declared but its value is never read.
'zUserId' is declared but its value is never read.
'zSessionId' is declared but its value is never read.
'zTopicId' is declared but its value is never read.
'zWhisperId' is declared but its value is never read.
'zChatItemId' is declared but its value is never read.
'zGameMemberId' is declared but its value is never read.
'zScriptId' is declared but its value is never read.
'zMatchId' is declared but its value is never read.
'zInviteId' is declared but its value is never read.
'zTravelerRequestId' is declared but its value is never read.
Type 'ZodObject<{ edition: ZodOptional<ZodNullable<ZodEnum<{ tb: "tb"; bmr: "bmr"; snv: "snv"; }>>>; skillLevel: ZodOptional<ZodNullable<ZodEnum<{ beginner: "beginner"; intermediate: "intermediate"; advanced: "advanced"; expert: "expert"; veteran: "veteran"; }>>>; roles: ZodOptional<...>; name: ZodOptional<...>; isOfficia...' does not satisfy the constraint 'ZodObject<{ _id: ZodString; }, $strip>'.
'zNightSubphase' is declared but its value is never read.
Argument of type '({ data }: ServerFnCtx<Register, undefined, (data: unknown) => { _id: string; gameId: string; topicId: string; ts: number | Date; streamId: string; from: string; name: string; text?: string | null | undefined; }>) => Promise<...>' is not assignable to parameter of type 'ServerFn<Register, "POST", undefined, (data: unknown) => { _id: string; gameId: string; topicId: string; ts: number | Date; streamId: string; from: string; name: string; text?: string | null | undefined; }, Promise<...>>'.
'data' is declared but its value is never read.
Cannot find name 'input'. Did you mean 'oninput'?
Cannot find name 'input'. Did you mean 'oninput'?
Property 'input' does not exist on type 'ServerFnCtx<Register, undefined, any>'.
Property 'patch' does not exist on type 'output<TIn>'.
Property 'input' does not exist on type 'ServerFnCtx<Register, undefined, any>'.
Cannot find name 'RoomModel'.
Cannot find name 'RoomDocument'. Did you mean 'Document'?
'Room' is declared but never used.
Type 'number' is not assignable to type 'Date'.
Argument of type '({ data }: ServerFnCtx<Register, undefined, (data: unknown) => { gameId: string; userId: string; }>) => Promise<Result<Document<unknown, {}, { _id?: unknown; gameId?: unknown; userId?: unknown; role?: unknown; joinedAt?: ({ toString?: ({} & Required<...>) | ... 1 more ... | undefined; ... 42 more ...; toISOString?: ...' is not assignable to parameter of type 'ServerFn<Register, "POST", undefined, (data: unknown) => { gameId: string; userId: string; }, Promise<Result<Document<unknown, {}, { _id?: unknown; gameId?: unknown; userId?: unknown; role?: unknown; joinedAt?: ({ toString?: ({} & Required<{ _id: unknown; }>) | null | undefined; ... 42 more ...; toISOString?: ({} & ...'.
Conversion of type '({ role: "player" | "storyteller" | "spectator"; isSeated: boolean; _id: string; gameId: string; userId: string; joinedAt: Date; } & Required<{ _id: string; }> & { __v: number; }) | null' to type 'Document<unknown, {}, { _id?: unknown; gameId?: unknown; userId?: unknown; role?: unknown; joinedAt?: ({ toString?: ({} & Required<{ _id: unknown; }>) | null | undefined; toLocaleString?: ({} & Required<{ _id: unknown; }>) | null | undefined; ... 41 more ...; toISOString?: ({} & Required<...>) | ... 1 more ... | und...' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
Module '"@/types/game"' has no exported member 'StorytellerMode'.
Object literal may only specify known properties, and 'type' does not exist in type 'EventMsg<"st/phaseChanged", void> | EventMsg<"st/setReminderToken", { key: string; sourceId: number; targetId: number; isChanneled: boolean; }> | EventMsg<"st/assignSeat", { ...; }> | ... 12 more ... | EventMsg<...>'.
Object literal may only specify known properties, and 'type' does not exist in type 'EventMsg<"st/phaseChanged", void> | EventMsg<"st/setReminderToken", { key: string; sourceId: number; targetId: number; isChanneled: boolean; }> | EventMsg<"st/assignSeat", { ...; }> | ... 12 more ... | EventMsg<...>'.
Object literal may only specify known properties, and 'type' does not exist in type 'EventMsg<"st/phaseChanged", void> | EventMsg<"st/setReminderToken", { key: string; sourceId: number; targetId: number; isChanneled: boolean; }> | EventMsg<"st/assignSeat", { ...; }> | ... 12 more ... | EventMsg<...>'.
Object literal may only specify known properties, and 'type' does not exist in type 'EventMsg<"st/phaseChanged", void> | EventMsg<"st/setReminderToken", { key: string; sourceId: number; targetId: number; isChanneled: boolean; }> | EventMsg<"st/assignSeat", { ...; }> | ... 12 more ... | EventMsg<...>'.
Object literal may only specify known properties, and 'type' does not exist in type 'EventMsg<"st/phaseChanged", void> | EventMsg<"st/setReminderToken", { key: string; sourceId: number; targetId: number; isChanneled: boolean; }> | EventMsg<"st/assignSeat", { ...; }> | ... 12 more ... | EventMsg<...>'.
Object literal may only specify known properties, and 'type' does not exist in type 'EventMsg<"st/phaseChanged", void> | EventMsg<"st/setReminderToken", { key: string; sourceId: number; targetId: number; isChanneled: boolean; }> | EventMsg<"st/assignSeat", { ...; }> | ... 12 more ... | EventMsg<...>'.
Object literal may only specify known properties, and 'type' does not exist in type 'EventMsg<"st/phaseChanged", void> | EventMsg<"st/setReminderToken", { key: string; sourceId: number; targetId: number; isChanneled: boolean; }> | EventMsg<"st/assignSeat", { ...; }> | ... 12 more ... | EventMsg<...>'.
Object literal may only specify known properties, and 'type' does not exist in type 'EventMsg<"st/phaseChanged", void> | EventMsg<"st/setReminderToken", { key: string; sourceId: number; targetId: number; isChanneled: boolean; }> | EventMsg<"st/assignSeat", { ...; }> | ... 12 more ... | EventMsg<...>'.
Property 'event' does not exist on type 'MachineSnapshot<GameContext, { type: "SETUP_COMPLETE"; payload: Partial<GameContext>; } | { type: "END_GAME"; } | { type: "END_REVEAL"; } | { type: "EXECUTION"; } | ... 15 more ... | { ...; }, ... 5 more ..., ToStateSchema<...>>'.
Argument of type '"gameStatus.complete"' is not assignable to parameter of type '"gameStatus" | "taskQueue" | { gameStatus?: "setup" | "in_progress" | "reveal" | "complete" | { in_progress?: "night" | "day" | { night?: NonNullable<"first_night" | "other_night"> | undefined; day?: "day" | ... 4 more ... | undefined; } | undefined; } | undefined; taskQueue?: NonNullable<...> | undefined; }'.
Type '{ _id: string; hostUserId: string; status: "open" | "closed" | "in_match" | "archived"; scriptId: string; allowTravelers: boolean; visibility: "public" | "private"; endedAt: string | null; ... 5 more ...; plannedStartTime: string | null; }' is missing the following properties from type '{ _id: string; allowTravellers: boolean; banner: string; maxPlayers: 13 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 14 | 15; maxTravellers: 0 | 2 | 1 | 5 | 3 | 4; minPlayers: 13 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 14 | 15; ... 8 more ...; speed?: "slow" | ... 2 more ... | undefined; }': allowTravellers, banner, maxTravellers, storytellerUserIds, connectedUserIds
Property 'status' does not exist on type 'Document<unknown, {}, { _id: string; allowTravellers: boolean; banner: string; connectedUserIds: string[]; hostUserId: string; maxPlayers: 13 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 14 | 15; maxTravellers: 0 | ... 4 more ... | 4; ... 7 more ...; scriptId?: string | undefined; }, {}, DefaultSchemaOptions> & { ...; } & R...'.
Property 'allowTravelers' does not exist on type 'Document<unknown, {}, { _id: string; allowTravellers: boolean; banner: string; connectedUserIds: string[]; hostUserId: string; maxPlayers: 13 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 14 | 15; maxTravellers: 0 | ... 4 more ... | 4; ... 7 more ...; scriptId?: string | undefined; }, {}, DefaultSchemaOptions> & { ...; } & R...'. Did you mean 'allowTravellers'?
Property 'maxTravelers' does not exist on type 'Document<unknown, {}, { _id: string; allowTravellers: boolean; banner: string; connectedUserIds: string[]; hostUserId: string; maxPlayers: 13 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 14 | 15; maxTravellers: 0 | ... 4 more ... | 4; ... 7 more ...; scriptId?: string | undefined; }, {}, DefaultSchemaOptions> & { ...; } & R...'. Did you mean 'maxTravellers'?
Property 'edition' does not exist on type 'Document<unknown, {}, { _id: string; allowTravellers: boolean; banner: string; connectedUserIds: string[]; hostUserId: string; maxPlayers: 13 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 14 | 15; maxTravellers: 0 | ... 4 more ... | 4; ... 7 more ...; scriptId?: string | undefined; }, {}, DefaultSchemaOptions> & { ...; } & R...'.
The `{}` ("empty object") type allows any non-nullish value, including literals like `0` and `""`.
- If that's what you want, disable this lint rule with an inline comment or configure the 'allowObjectTypes' rule option.
- If you want a type meaning "any object", you probably want `object` instead.
- If you want a type meaning "any value", you probably want `unknown` instead.
Property 'name' does not exist on type 'AuthedUser'.
Type '{ kind: string; id: `${string}-${string}-${string}-${string}-${string}`; ts: number; from: { userId: string; name: string; }; text: string; }' is not assignable to type 'ChatMsg | (ChatMsg & { streamId: string; })'.
  Type '{ kind: string; id: `${string}-${string}-${string}-${string}-${string}`; ts: number; from: { userId: string; name: string; }; text: string; }' is not assignable to type 'ChatMsg & { streamId: string; }'.
    Type '{ kind: string; id: `${string}-${string}-${string}-${string}-${string}`; ts: number; from: { userId: string; name: string; }; text: string; }' is not assignable to type 'ChatMsg'.
      Types of property 'kind' are incompatible.
        Type 'string' is not assignable to type '"chat"'.
Type 'void' is not assignable to type 'ChatMsg | (ChatMsg & { streamId: string; })'.
Type '{ id: string; message: { [x: string]: string; }; millisElapsedFromDelivery?: number | undefined; deliveriesCounter?: number | undefined; }[]' is not assignable to type '[string, Record<string, string>][]'.
  Type '{ id: string; message: { [x: string]: string; }; millisElapsedFromDelivery?: number | undefined; deliveriesCounter?: number | undefined; }' is not assignable to type '[string, Record<string, string>]'.
Type '{ id: string; message: { [x: string]: string; }; millisElapsedFromDelivery?: number | undefined; deliveriesCounter?: number | undefined; }[]' is not assignable to type '[string, Record<string, string>][]'.
  Type '{ id: string; message: { [x: string]: string; }; millisElapsedFromDelivery?: number | undefined; deliveriesCounter?: number | undefined; }' is not assignable to type '[string, Record<string, string>]'.
Type 'Record<string, string | string[]>' is not assignable to type 'HeadersInit | undefined'.
Argument of type '(topic: string, msg: AppEvents) => Promise<AppEvents & { streamId: string; roomId: string; matchId: string | null; }>' is not assignable to parameter of type '(topic: string, msg: any) => Promise<void>'.
Argument of type '{ snapshot: Snapshot<unknown>; } | undefined' is not assignable to parameter of type 'ActorOptions<any> & { [x: string]: unknown; }'.
  Type 'undefined' is not assignable to type 'ActorOptions<any> & { [x: string]: unknown; }'.
    Type 'undefined' is not assignable to type 'ActorOptions<any>'.
Property 'getInitialState' does not exist on type 'StateMachine<RoomContext, { type: "OPEN_ROOM"; } | { type: "CLOSE_ROOM"; } | { type: "MATCH_ENDED"; } | { type: "START_MATCH"; } | { type: "ARCHIVE_ROOM"; } | { type: "CONDITION_MET"; } | { ...; } | ... 12 more ... | { ...; }, ... 11 more ..., ToStateSchema<...>>'.
Property 'withContext' does not exist on type 'StateMachine<RoomContext, { type: "OPEN_ROOM"; } | { type: "CLOSE_ROOM"; } | { type: "MATCH_ENDED"; } | { type: "START_MATCH"; } | { type: "ARCHIVE_ROOM"; } | { type: "CONDITION_MET"; } | { ...; } | ... 12 more ... | { ...; }, ... 11 more ..., ToStateSchema<...>>'.
Argument of type 'RoomSnapshotUpsertArgs' is not assignable to parameter of type 'RoomSnapshotDoc'.
  Types of property 'skillLevel' are incompatible.
    Type 'SkillLevel | undefined' is not assignable to type 'SkillLevel'.
      Type 'undefined' is not assignable to type 'SkillLevel'.
Argument of type '({ data }: ServerFnCtx<Register, undefined, (data: unknown) => { gameId: string; whisperId: string; isActive: boolean; }>) => Promise<Result<Document<unknown, {}, { members: unknown[]; meta?: unknown; _id?: unknown; gameId?: unknown; topicId?: unknown; isActive?: unknown; creatorId?: unknown; } & Required<...>, {}, ...' is not assignable to parameter of type 'ServerFn<Register, "POST", undefined, (data: unknown) => { gameId: string; whisperId: string; isActive: boolean; }, Promise<Result<Document<unknown, {}, { members: unknown[]; meta?: unknown; _id?: unknown; gameId?: unknown; topicId?: unknown; isActive?: unknown; creatorId?: unknown; } & Required<...>, {}, DefaultSch...'.
'createServerFn' is declared but its value is never read.
'GameRoles' is declared but its value is never read.
'$keys' is declared but its value is never read.
'listWhisperTopicsForUser' is declared but its value is never read.
'getUserFromCookie' is declared but its value is never read.
'inputs' is declared but its value is never read.
Parameter 'entry' implicitly has an 'any' type.


src/components/forms/CreateRoomForm.tsx
'CreateRoomFormInput' refers to a value, but is being used as a type here. Did you mean 'typeof CreateRoomFormInput'?
'CreateRoomFormInput' is declared but its value is never read.
'CreateRoomForm' is declared but its value is never read.
'form' is declared but its value is never read.