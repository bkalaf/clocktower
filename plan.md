* I think it's easier to model VoteChoice as a (boolean | null) where Yes => true, No => false, and Abstain => null.
* I've changed a bunch of items in state contexts to string | undefined because I don't like storing empty strings as initial values. Is this wrong?
* We should probably change isTravelerById to just a list of UserIds so it probably should be a string[], it'll be easier to manage that list than having to add all the travelers at the start. Plus we can get the travelerCountUsed from getting the length of this array and don't need to store the value in context, anymore.
* In resetDailyNominationLimits you reset currentVoteGhostUsage. This should not be reset daily as users only get 1 ghost vote per GAME. This needs to be initialized on setup to all the players with a value to true, when the ghost vote is used we need to flip it to false. Also, we need to make sure the player isn't alive for it to be consumed.
* I removed voteHolders from RoomMachine since that's already defined in the MatchMachine.
* We need to migrate MatchMachine to GameMachine.
* Added displayName to AppShell.
* Next logical implementation : wire /login + /logout to set/clear authUserId, and on successful join/start, set lastRoomId/lastGameId.
* Add a property called pronouns to User (string) that is optional.
* SessionState should also have displayName (for the Avatar UI piece), pronouns, and username at a minimum so it can be easily accessed since it will be accessed in the main view page.
* Point your loaders/mutations at the new bindings so the router always uses the Zod input/output shapes and invalidates caches via rooms.invalidateRoom. 2. Run yarn api:print whenever you update the registry to catch path or key drift early.
* Point route loaders/mutations to the new roomsCrud/rooms helpers so they rely on the Zod-validated payloads and invalidateRoom helper instead of ad-hoc queries.
* Run yarn api:print whenever the registry changes to keep the query-key map in sync with the new schema-driven definitions.
