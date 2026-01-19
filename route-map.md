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
