# Data Model Map (Proposed)

## Core Naming Changes

- **Room** → **Game** (user-facing). Use `game` consistently in UI/routes.
- **Match** → **Round** or **Session** (internal), but UI should just say “game.”

## Entities

### User

- `_id: UUID`
- `username: string` (unique, searchable)
- `displayName: string`
- `email: string` (private)
- `avatarUrl?: string`
- `bio?: string`
- `userRoles: ['user' | 'moderator' | 'admin']`
- `createdAt`, `updatedAt`
- `passwordHash`
- `penaltyUntil?: timestamp`

**Notes**

- Rename existing `name` → `displayName`.
- Add `username` for lobby search.
- Email is never shown in public profile.

### Session

- `_id: UUID`
- `userId: UUID`
- `expiresAt: timestamp`

### Game (Room)

- `_id: UUID`
- `hostUserId: UUID`
- `scriptId: string`
- `status: 'open' | 'starting' | 'in_progress' | 'ended'`
- `visibility: 'public' | 'private'`
- `allowTravelers: boolean`
- `lobbySettings?: object`
- `createdAt`, `updatedAt`
- `endedAt?: timestamp`

### GameMember

- `_id: "${gameId}:${userId}"`
- `gameId: UUID`
- `userId: UUID`
- `role: 'player' | 'storyteller' | 'spectator'`
- `joinedAt: timestamp`
- `isSeated: boolean`

### Match (Round/Session)

- `_id: UUID`
- `gameId: UUID`
- `scriptId: string`
- `phase: string`
- `dayNumber: number`
- `playerSeatMap: Record<userId, seat>`
- `aliveById: Record<userId, boolean>`
- `isTravelerById: Record<userId, boolean>`
- `ghostVoteAvailableById: Record<userId, boolean>`
- `createdAt`, `updatedAt`
- `endedAt?: timestamp`

### ChatItem

- `_id: UUID`
- `gameId: UUID`
- `topicId: string`
- `from: { userId, displayName }`
- `text: string`
- `ts: timestamp`
- `streamId: string`

### Replay

- `_id: UUID`
- `gameId: UUID`
- `createdByUserId: UUID`
- `summary: string`
- `publicEvents: ReplayEvent[]`
- `createdAt`

### ReplayEvent

- `ts: timestamp`
- `type: string`
- `payload: object`
- `summary?: string` (for public discussion summaries)

### UserStats (Aggregate)

- `_id: userId`
- `gamesPlayed: number`
- `gamesWon: number`
- `gamesLost: number`
- `winsByAlignment: Record<'good' | 'evil', number>`
- `roleHistory: Record<roleId, number>`
- `votesCast: number`
- `influenceScore: number`
- `timePlayedMs: number`
- `daysAlive: number`
- `executions: number`
- `nightDeaths: number`

## Privacy Rules

- Public profile returns: `username`, `displayName`, `avatarUrl`, `bio`, and `UserStats`.
- Private profile (self) returns email + all edit fields.

## Recorder / Replay Notes

- Record major game state events, phase changes, nominations, and execution outcomes.
- Summarize public discussions into timeline entries; exclude private whispers.
- Replays should be reconstructable via `ReplayEvent[]` without sensitive chat.
