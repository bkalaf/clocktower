Below is a detailed review of the current codebase with the requested issues and a prioritized TODO plan to reach the target product vision.

Key Findings (Issues & Gaps)

1. Routing/pages are not aligned with the product vision
   The only top-level UI routes are the splash page (/) and an empty /login route; the rest are demo routes, not the real app pages you described (lobby, room/game, replay, profile).
   Navigation currently points to demo routes (e.g., /demo/start/...), which should not be part of the production app routing experience.
2. Auth flow forces redirects and blocks the unauthenticated splash experience
   useAuthUser() invokes whoAmIServerFn, which redirects to /login when no session exists. That means unauthenticated users get forced off the splash page instead of staying on it (contrary to the desired behavior).
   The /login route renders no component and LoginDialog is forced open by MatchRoute with open={true}, so it can’t actually close except by navigation; the handler passed to onClose does not navigate away, making the dialog effectively non-dismissable on /login.
3. Core UI components are built but not wired to real routes/pages
   The Grimoire UI exists but is only mounted under a demo route (/demo/grimoire), not a real game/room page.
   The Script dropdown expects roomId to be supplied via query params, but there’s no routing structure enforcing a room/game context (e.g., /rooms/:id), and it uses a custom hook that is detached from TanStack Router’s state.
4. State machines exist but are not connected to UI or server flow
   The AppShell, RoomMachine, and MatchMachine state machines are fully defined but not referenced by any client or server integration code. They are currently inert and won’t drive UI or game logic without wiring.
5. Naming mismatch: “room”, “game”, and “match” are used inconsistently
   API routes and data models interchange “rooms,” “games,” and “matches” (e.g., /api/rooms uses GameModel, but match-specific endpoints live under /api/matches). This will make it harder to align with the desired “game” nomenclature and user-facing UI labels.
6. User model does not support profile + stats requirements
   The current user schema only includes name, email, and roles; there is no username, displayName, or any stats model to support the profile page and stats requested (win/loss, alignment, role history, etc.).
7. Replay/recording workflow is not implemented
   There is some realtime replay support for chat streams in the websocket layer, but no game event recorder or replay routes/pages are wired for actual match reconstruction and playback yet.
   Prioritized TODO Plan (Ordered by Impact)

1) Fix auth flow and unblock unauthenticated splash
   Replace whoAmIServerFn redirect with a 401/null-return response when unauthenticated, and update useAuthUser to handle that gracefully (so the splash page can remain visible when logged out).
   Make /login a proper route (or convert to a route-backed dialog) and ensure it can be dismissed via navigation; do not hard-code open={true} with no escape route.
   Add “Forgot password” and “Change password” flows to the login dialog and route/state machine layer.
2) Define the SPA routing layout and top bar navigation
   Establish a top-bar dropdown menu-based navigation system that routes to:
   Splash (/) for unauthenticated
   Lobby (/lobby)
   Game/Room (/games/:gameId or /rooms/:roomId) — rename “match” to “game” in UI
   Replay (/replays/:id)
   Profile (/profile/:userId)
   Remove or hide demo routes from production navigation.
3) Implement the Lobby page + player search
   Add a GET route for /api/rooms to list rooms with status (starting/in progress/recently ended). The current /api/rooms route only supports POST for creation.
   Build lobby UI with search (by username/email) and room list cards.
   Add user search endpoints and extend user schema to include username and displayName (rename name → displayName).
4) Hook the Room/Game page to core UI + state machines
   Wire RoomMachine/MatchMachine into UI state and realtime updates (websocket + API events).
   Use router params instead of useRoomParams so room state is derived from route structure, not query strings.
   Move GrimoireBoard from the demo route into the real room/game page view.
5) Profile + stats model
   Extend user schema for username, displayName, avatar URL, and privacy settings.
   Add game stats storage (wins/losses, alignment, role history, votes, influence, time played, survival days, cause of death).
   Build profile routes:
   /profile/me (editable)
   /profile/:userId (read-only)
   Ensure email is private for other users.
6) Replay + recording pipeline
   Add an event recorder that captures major game events (summary of public discussions, no private message replay).
   Store a serialized event log suitable for reconstruction.
   Add replay API routes + UI page (/replay/:id) to play back a game state timeline.
7) Unify naming and clean up legacy/demo elements
   Rename “match” to “game” in UI/route naming to reflect the intended wording.
   Consolidate route naming to avoid room/game/match confusion and migrate data models accordingly.
   Commands Run
   ls
   find .. -name AGENTS.md -print
   ls src
   router.tsx
   ls src/routes
   \_\_root.tsx
   index.tsx
   login.tsx
   ls src/routes/demo
   Header.tsx
   TopBar.tsx
   NavigationDrawer.tsx
   ls src/machines
   AppShell.ts
   RoomMachine.ts
   MatchMachine.ts
   rg "MatchMachine|RoomMachine|AppShell" -n src
   rg "serverFns|\\$game|\\$user|\\$session|\\$whisper|\\$gameMember|\\$chatItem" -n src
   useAuthUser.ts
   whoAmI.ts
   login.ts
   register.ts
   ls src/routes/api
   index.ts
   rg "replay|record|snapshot|event" -n src/server src/db src/client src/routes
   LoginDialog.tsx
   RegisterDialog.tsx
   ScriptMenu.tsx
   useRoomParams.ts
   GrimoireBoard.tsx
   grimoire.tsx
   game.ts
   AuthedUser.ts
   User.ts
   wsConnection.ts
   If you want, I can follow up with a proposed route map + data model changes that align the “game” naming and UI structure.
