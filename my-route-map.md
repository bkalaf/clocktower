/,Splash (CTA to login/register),<Root><Splash>,
/login,Login,<Splash><Login>


__root = <Root>
index = navigate to 
_pathlessLayout.tsx = <Splash>


help me work out how this would work - When I go to 
- `/` (exact) I want to display a <Root><Splash> component layout
- `/login` — Login dialog/page (includes forgot password flow) - <Root><Splash><Login>
- `/logout` - Logout dialog - <Root><Splash><Logout>
- `/register` — Registration dialog/page - <Root><Splash><Register>
- `/forgot-password` — Password reset request (email + send token) - <Root><Splash><ForgotPassword>
- `/reset-password/:token` — Password reset confirmation (token + new password) - <Root><Splash><ForgotPasswordToken>
- `/user` - User search - <Root><Users>
- `/profile` - should redirect to /profile/me
- `/profile/me` - should redirect to /profile/:userId/me
- `/profile/:userId` - Read-only profile (public stats, no email) - unless my userId is the :userId and then it should redirect to /user/:userId/me - <Root><Profile> 
- `/profile/:userId/me` - Editable self-profile - <Root><Profile><Self> 
- `/lobby` - Lobby - <Root><Rooms>
    - `q` — search users/rooms
        - `status` — filter: `starting | in_progress | ended`
        - `startTime` - filter: number 
        - `speed` - filter: `fast | moderate | slow`
        - `edition` - filter: `tb | bmr | snv`
        - `script` - text search script name: string
        - `isPublic` - boolean: true/false
        - `hasSeat` - boolean: true/false
        - `allowTravellers` - boolean: true/false
        - `banner` - text search: string
- `/room` - I want to be navigated to /room/:roomId if I have a roomId defined and should be <Root><Room><CreateRoom> if not
- `/room/:roomId` -  <Root><Room><RoomDetails>
- `/game` - (is an alias to /room/:roomId/game)
- `/game/:gameId` - (which should be an alias of /room/:roomId/game/:gameId) 
- `/room/:roomId/game` - should route me to /room/:roomId/game/:gameId if I have a gameId defined and be <Root><Room><Game><CreateGame> if not
- `/room/:roomId/game/:gameId` - <Root><Room><Game><GameDetails>
- `/room/:roomId/game/:gameId/grimoire` - <Root><Room><Game><Grimoire> 
- `/room/:roomId/game/:gameId/grimoire` - (spectators)
- `/room/:roomId/game/:gameId/grimoire/st` - (storytellers) <Root><Room><Game><Grimoire><StoryTeller>
- `/room/:roomId/game/:gameId/grimoire/players` - (players) <Root><Room><Game><Grimoire><Player>
- `/user/:userId/stats` - <Root><Profile><PlayerStats>
- `/user/:userId/me/stats` - <Root><Profile><Self><PlayerStats>
- `/replays` — Replay index - <Root><Replays>
- `/replays/:replayId` — Replay viewer - <Root><Replays><ReplayViewer>

## SearchParams 
    - modal:
        * preferences: <Preferences />
        * invites: <Invites />
        * reveal: <Reveal />
        * nightCards: <NightCards />
            - also should have a type property to define which Night Card to show
                - you_are_evil
                - you_are_good
                - make_a_choice
                - use_your_ability
                - these_characters_are_out_of_play
                - these_are_your_minions
                - this_is_the_demon
                - you_are

## API Routes (Server)
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/register`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/change-password`

- `GET /api/rooms` — Lobby list
- `POST /api/rooms` — Create room
- `PUT /api/rooms` - Update room
- `DELETE /api/rooms` - Delete room
- `GET /api/host/rooms` - Get the room the userId is the host for (redirect to `GET /api/users/:userId/rooms`)
- `GET /api/users/:userId/rooms` - Get the room that the userId is the host for
- `GET /api/rooms/:roomId` — Room details
- `GET /api/rooms/:roomId/invites` - Get invites
- `POST /api/rooms/:roomId/invites` - Create an invite
- `POST /api/rooms/:roomId/invites/:inviteId/accept` - Accpet an invite
- `POST /api/rooms/:roomId/invites/:inviteId/decline` - Decline an invite
- `DELETE /api/rooms/:roomId/invites/:inviteId` - Delete an invite
- `POST /api/rooms/:roomId/start-game` - Start a game action
- `POST /api/rooms/:roomId/script` - Set the script
- `POST /api/rooms/:roomId/empty-seat` - Empty a seat
- `POST /api/rooms/:roomId/add-seat` - Add a seat
- `POST /api/rooms/:roomId/remove-seat` - Remove a seat
- `POST /api/rooms/:roomId/remove-player` - Remove a player

- `GET /api/rooms/:roomId/games` = Retrieve the open game for the roomId
- `GET /api/games/:gameId` — Game state (redirect to `GET /api/rooms/:roomId/games/:gameId`)
- `GET /api/rooms/:roomId/games/:gameId` — Game state

- `POST /api/games/:gameId/ready`
- `POST /api/games/:gameId/users/:userId/ready` - Mark user ready
- `POST /api/games/:gameId/users/:userId/afk` - Mark user not ready
- `POST /api/games/:gameId/storytellers` - Display storyteller options/actions 
- `POST /api/games/:gameId/storytellers/start-setup` - Start setup action
- `GET /api/games/:gameId/host` - Display Host options 
- `POST /api/games/:gameId/host` - Edit Host options 

- `GET /api/replays` — List replays for user
- `GET /api/replays/:replayId` — Replay payload

- `GET /api/users/` - Get all users (use search params for search by username/email)
- `GET /api/users/search` — Search by username/email
- `GET /api/users/:userId` — Public profile
- `PUT /api/users/:userId` — Update profile (self)
- `GET /api/users/:userId/stats` — Profile stats
- `GET /api/game/:gameId/stats` - Get specific game stats
- `POST /api/users/:userId/game/:gameId/stats` - Add new player stats

Yes, NOW: Implement the modal/search-param overlay system (Invites first).
Yes, NOW: Add a minimal SessionProvider that exposes authUserId, lastRoomId, lastGameId (with localStorage). And then we can use that SessionProvider to implement "Router context (fed by a provider)"
Next: Once server endpoints exist, add query caching for rooms/game snapshots.

How about for modals I'm thinking about night order actions - and if the storyteller sends a "Make a choice" card to a player can we respond to that event by redirecting via the search paramter pattern to search.modal.includes('make-choice') and then show that modal that way and keep all the modals usable like this and then we can just display modals in the order they're received in search params since we add to search params by appending?

i'd like for those aliased paths to mask the part that is duplicated by it's aliased portion i.e.

/room/:roomId/game should display /game but be /room/:roomId/game

I'm not even sure if this is possible but basically I'd like the <Invites> component to to show (as a modal) over whatever page is underneath so I'd like all these to be possible but I don't want to define it a million times either:
/lobby/invites  = <Root><Rooms><Invites>
/user/:userId/invites = <Root><Profile><Self><Invites>
/room/invites = <Root><Room><CreateRoom><Invites>
/room/:roomId/game/:gameId/grim/invites = <Root><Room><Game><Grimoire><Invites>

this is just my basic outline... how would I define this in @tanstack/start






src/routes/
  __root.tsx

  _splash.tsx
  _splash/
    index.tsx          # /
    login.tsx          # /login
    logout.tsx         # /logout

  user.tsx             # /user
  user.$userId.tsx     # /user/$userId  (Profile layout + redirect if self)
  user.$userId/
    index.tsx          # /user/$userId  (public profile view)
    s.tsx              # /user/$userId/s  (Self)

  lobby.tsx            # /lobby  (Rooms)

  room.tsx             # /room (redirect to /room/$roomId if you have one; else CreateRoom)
  room.$roomId.tsx     # /room/$roomId (Room layout)
  room.$roomId/
    index.tsx          # RoomDetails
    game.tsx           # /room/$roomId/game (Game layout)
    game/
      index.tsx        # /room/$roomId/game (redirect to $gameId if you have one; else CreateGame)
      $gameId.tsx      # /room/$roomId/game/$gameId (GameDetails layout)
      $gameId/
        index.tsx      # GameDetails
        grim.tsx       # /room/$roomId/game/$gameId/grim (Grimoire)

  game.tsx             # /game (alias entrypoint)
  game.$gameId.tsx     # /game/$gameId (alias entrypoint)