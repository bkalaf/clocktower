* I think it's easier to model VoteChoice as a (boolean | null) where Yes => true, No => false, and Abstain => null.
* I've changed a bunch of items in state contexts to string | undefined because I don't like storing empty strings as initial values. Is this wrong?
* We should probably change isTravelerById to just a list of UserIds so it probably should be a string[], it'll be easier to manage that list than having to add all the travelers at the start. Plus we can get the travelerCountUsed from getting the length of this array and don't need to store the value in context, anymore.
* In resetDailyNominationLimits you reset currentVoteGhostUsage. This should not be reset daily as users only get 1 ghost vote per GAME. This needs to be initialized on setup to all the players with a value to true, when the ghost vote is used we need to flip it to false. Also, we need to make sure the player isn't alive for it to be consumed.
* I removed voteHolders from RoomMachine since that's already defined in the MatchMachine.
* We need to migrate MatchMachine to GameMachine.
* Added displayName to AppShell.
