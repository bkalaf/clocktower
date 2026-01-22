# Route Map

## Public (Unauthenticated)

- `/` — Splash / marketing landing (CTA to log in / register)
- `/login` — Login dialog/page (includes forgot password flow)
- `/register` — Registration dialog/page (optional if not inline on login)
- `/forgot-password` — Password reset request (email + send token)
- `/reset-password/:token` — Password reset confirmation (token + new password)

## Core App (Authenticated SPA)

- `/lobby` — Lobby list of rooms/games
    - Query params:
        - `q` — search users/rooms
        - `status` — filter: `starting | in_progress | ended`
- `/games/:gameId` — Game room (Grimoire + match controls + chat)
    - Sub-routes (optional, can be tabs)
        - `/games/:gameId/grimoire`
        - `/games/:gameId/chat`
        - `/games/:gameId/storyteller`
        - `/games/:gameId/players`
- `/replays` — Replay index
- `/replays/:replayId` — Replay viewer
- `/profile/me` — Editable self-profile
- `/profile/:userId` — Read-only profile (public stats, no email)

## API Routes (Server)

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/register`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/change-password`

- `GET /api/rooms` — Lobby list
- `POST /api/rooms` — Create room
- `GET /api/rooms/:roomId` — Room details
- `POST /api/rooms/:roomId/invites`
- `POST /api/rooms/:roomId/start-game`
- `POST /api/rooms/:roomId/script`
- `POST /api/rooms/:roomId/empty-seat`
- `POST /api/rooms/:roomId/remove-player`

- `GET /api/games/:gameId` — Game state
- `POST /api/games/:gameId/ready`
- `POST /api/games/:gameId/start-setup`
- `POST /api/games/:gameId/storytellers`
- `POST /api/games/:gameId/host`

- `GET /api/replays` — List replays for user
- `GET /api/replays/:replayId` — Replay payload

- `GET /api/users/search` — Search by username/email
- `GET /api/users/:userId` — Public profile
- `PATCH /api/users/:userId` — Update profile (self)
- `GET /api/users/:userId/stats` — Profile stats

## Notes

- Top bar dropdown menus should surface the primary page routes:
    - Lobby, Game (if in one), Replays, Profile.
- Demo routes should be hidden behind a dev flag or moved under `/dev`.

## FOLDERS

src/routes/

    __root.tsx                      #/

    _splash.tsx
    _splash/
        index.tsx                # /
        login.tsx
        logout.tsx
        register.tsx
        forgot-password.tsx
        reset-password.$token.tsx

        index.tsx

    user.tsx
    user.$userId/
        stats.tsx
        me.tsx
        me/
            stats.tsx

    profile.tsx
    profile/
        me.tsx
        $userId.tsx
        $userId/
            me.tsx

    lobby.tsx

    room.tsx
    room.$roomId.tsx
    room.$roomId/
        index.tsx
        game.tsx
        game/
            index.tsx
            $gameId.tsx
            $gameId/
                grimoire.tsx
                grimoire/
                    index.tsx
                    st.tsx
                    players.tsx

    game.tsx
    game.$gameId.tsx

    replays.tsx
    replays.$replayId.tsx

## API CALLS

GET /api/auth/session
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/register
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/change-password
GET /api/users (search via query params)
GET /api/users/me
PATCH /api/users/me
GET /api/users/:userId
GET /api/users/:userId/stats
GET /api/rooms (filters for lobby)
POST /api/rooms
GET /api/rooms/:roomId
PATCH /api/rooms/:roomId
DELETE /api/rooms/:roomId
GET /api/rooms/:roomId/invites
POST /api/rooms/:roomId/invites
PATCH /api/rooms/:roomId/invites/:inviteId (or accept/decline endpoints)
DELETE /api/rooms/:roomId/invites/:inviteId
POST /api/rooms/:roomId/actions/start-game
GET /api/rooms/:roomId/games/current
GET /api/games/:gameId
GET /api/games/:gameId/stats
POST /api/games/:gameId/actions/:actionName
GET /api/games/:gameId/ui (optional but powerful)
GET /api/replays
GET /api/replays/:replayId

## EOF

What each file corresponds to (mapped to your spec)
Root + Splash

\_\_root.tsx → <Root><Outlet /> + global modal host (Invites/Reveal/NightCards)

index.tsx → / renders <Splash> (or you can keep / under \_splash; see note below)

\_splash.tsx → pathless <Splash><Outlet /></Splash>

\_splash/login.tsx → /login → <Root><Splash><Login>

\_splash/logout.tsx → /logout → <Root><Splash><Logout>

\_splash/register.tsx → /register → <Root><Splash><Register>

\_splash/forgot-password.tsx → /forgot-password → <Root><Splash><ForgotPassword>

\_splash/reset-password.$token.tsx → /reset-password/:token → <Root><Splash><ForgotPasswordToken>

Note: If you want / to also be under <Splash>, you can put / at \_splash/index.tsx instead of routes/index.tsx. If you do, your tree becomes slightly cleaner. Right now I showed index.tsx separately because you explicitly listed / as <Root><Splash>—either way works.

Users / Public profile / Self profile

user.tsx → /user → <Root><Users>

user.$userId/stats.tsx → /user/:userId/stats → <Root><Profile><PlayerStats> (more on why below)

user.$userId/me.tsx → /user/:userId/me (handy alias redirect target if you still want it)

user.$userId/me/stats.tsx → /user/:userId/me/stats → <Root><Profile><Self><PlayerStats>

Profile routing as you specified:

profile.tsx → /profile redirect → /profile/me

profile/me.tsx → /profile/me redirect → /profile/:userId/me (using session authUserId)

profile/$userId.tsx → /profile/:userId → <Root><Profile> (read-only)

and beforeLoad redirect to /profile/:userId/me if it’s you

profile/$userId/me.tsx → /profile/:userId/me → <Root><Profile><Self> (editable)

Why I split user and profile: you have both /user as “search” and /profile/... as “profile screens.” Keeping them separate avoids mental knots.

Lobby

lobby.tsx → /lobby → <Root><Rooms> with your search params (q, status, etc.)

You’ll implement those filters with validateSearch on this route.

Room / Game / Grimoire

room.tsx → /room redirect → /room/:roomId if session.lastRoomId, else render <Root><Room><CreateRoom>

room.$roomId.tsx → /room/:roomId layout: <Root><Room><Outlet /></Room>

room.$roomId/index.tsx → /room/:roomId page: <RoomDetails>

Game nested under room:

room.$roomId/game.tsx → /room/:roomId/game layout: <Game><Outlet /></Game>

room.$roomId/game/index.tsx → /room/:roomId/game page:

redirect → /room/:roomId/game/:gameId if session.lastGameId

else <CreateGame>

room.$roomId/game/$gameId.tsx → /room/:roomId/game/:gameId page: <GameDetails>

(You can make this a layout too if you want more nesting under a specific game.)

Grimoire:

room.$roomId/game/$gameId/grimoire.tsx → /room/:roomId/game/:gameId/grimoire layout: <Grimoire><Outlet /></Grimoire>

room.$roomId/game/$gameId/grimoire/index.tsx → spectators view (base grimoire)

room.$roomId/game/$gameId/grimoire/st.tsx → /.../grimoire/st → <StoryTeller>

room.$roomId/game/$gameId/grimoire/players.tsx → /.../grimoire/players → <Player>

(You had a duplicate grimoire line in your spec; I treated the base /grimoire as spectators.)

Aliases:

game.tsx → /game alias redirect → /room/:roomId/game (requires session.lastRoomId)

game.$gameId.tsx → /game/:gameId alias redirect → /room/:roomId/game/:gameId (requires resolving roomId by gameId)

Route masking (URL shows /game/... while actually at /room/.../game/...) will be configured in src/router.tsx, not in routes/.

Replays

replays.tsx → /replays → <Root><Replays>

replays.$replayId.tsx → /replays/:replayId → <Root><Replays><ReplayViewer>

If you want <Replays> as a layout wrapper with an outlet:

Make replays.tsx a layout and put replays/index.tsx as the list page. But the “flat” version above is fine to start.

Auth
Keep (good)

POST /api/auth/login

POST /api/auth/logout

POST /api/auth/register

POST /api/auth/forgot-password

POST /api/auth/reset-password

POST /api/auth/change-password

Add (you’ll want this immediately)

GET /api/auth/session — returns { userId, username, ... } or 401

That powers your SessionProvider and makes routing redirects sane.

Users & Profiles
Replace these two:

GET /api/users/

GET /api/users/search

With one:

GET /api/users?q=&username=&email= (whatever filters you want)

Then:

GET /api/users/:userId — public profile

PATCH /api/users/:userId — update (self only)

And add:

GET /api/users/me — current user profile (avoids passing your own id)

PATCH /api/users/me

Stats:

GET /api/users/:userId/stats — good

✅ fix inconsistency: GET /api/games/:gameId/stats (not /api/game/...)

For “add new player stats”: avoid putting it under users unless it truly belongs there.

Better:

POST /api/games/:gameId/stats — submit/compute stats for that game (server can infer user from auth)

If you truly need per-user posting (probably not), do:

POST /api/users/:userId/stats with { gameId, ... }

Rooms
List / Create / Update / Delete

GET /api/rooms — lobby list (supports search params)

POST /api/rooms — create room

GET /api/rooms/:roomId

PATCH /api/rooms/:roomId — update room (prefer PATCH over PUT)

DELETE /api/rooms/:roomId

“Room I host”

Your current:

GET /api/host/rooms

GET /api/users/:userId/rooms (but name implies plural)

I’d do one of these:

Option A (cleanest):

GET /api/rooms?host=me — returns rooms where I’m host

GET /api/rooms?host=:userId — admin/mod use

Option B:

GET /api/users/:userId/rooms — list rooms user is associated with

GET /api/users/me/rooms

But don’t keep /api/host/rooms unless “host” is a first-class resource.

Invites

Current set is basically fine; just tighten naming:

GET /api/rooms/:roomId/invites

POST /api/rooms/:roomId/invites

DELETE /api/rooms/:roomId/invites/:inviteId

For accept/decline, your style is OK. Slightly more REST-ish:

POST /api/rooms/:roomId/invites/:inviteId/accept

POST /api/rooms/:roomId/invites/:inviteId/decline

Alternative (more “resource state”):

PATCH /api/rooms/:roomId/invites/:inviteId with { status: "accepted" | "declined" }

Either works. The patch version scales better when you add more states later.

Seats, script, kicking, starting game

This is where “verb endpoint sprawl” happens. You currently have:

POST /api/rooms/:roomId/start-game

POST /api/rooms/:roomId/script

POST /api/rooms/:roomId/empty-seat

POST /api/rooms/:roomId/add-seat

POST /api/rooms/:roomId/remove-seat

POST /api/rooms/:roomId/remove-player

Better: make these either PATCH updates or actions.

Script

PATCH /api/rooms/:roomId with { scriptId } (or { scriptName })

Seats

Model seats as a subresource:

POST /api/rooms/:roomId/seats — add seat

DELETE /api/rooms/:roomId/seats/:seatId — remove seat

PATCH /api/rooms/:roomId/seats/:seatId — e.g. empty seat / assign player

Or if you want “players in seats”:

POST /api/rooms/:roomId/players — join / take seat

DELETE /api/rooms/:roomId/players/:userId — remove player/kick

Start game

Use an action endpoint:

POST /api/rooms/:roomId/actions/start-game

That leaves you room for:

/actions/end-game

/actions/lock

/actions/unlock
without making your “rooms controller” a bag of verbs.

Games

You have:

GET /api/rooms/:roomId/games = retrieve open game

GET /api/games/:gameId redirect to room version

GET /api/rooms/:roomId/games/:gameId

Pick one canonical. I’d go canonical = /api/games/:gameId. It’s what clients want.

Then add:

GET /api/rooms/:roomId/games?status=open (or current=true) for “open game for room”

So:

GET /api/games/:gameId — game state

GET /api/rooms/:roomId/games — list games for room (optional)

GET /api/rooms/:roomId/games/current — current/open game (simple + explicit)

Ready / AFK

Instead of:

POST /api/games/:gameId/ready

POST /api/games/:gameId/users/:userId/ready

POST /api/games/:gameId/users/:userId/afk

Do:

PATCH /api/games/:gameId/players/me with { ready: true }

PATCH /api/games/:gameId/players/:userId with { ready: false } (host/st only)

Or if you like actions:

POST /api/games/:gameId/actions/ready

POST /api/games/:gameId/actions/afk

Storyteller & host “options/actions”

Right now:

POST /api/games/:gameId/storytellers

POST /api/games/:gameId/storytellers/start-setup

GET /api/games/:gameId/host

POST /api/games/:gameId/host

I’d unify:

GET /api/games/:gameId/ui — returns “what buttons/choices should this user see” (role-aware)

POST /api/games/:gameId/actions/<actionName> — execute an action

This is especially good when AI storytellers/players exist, because “available actions” becomes a first-class thing.

Replays

Your replay routes are good:

GET /api/replays

GET /api/replays/:replayId

Optional later:

GET /api/replays?userId=me

POST /api/replays if you allow creation/export
