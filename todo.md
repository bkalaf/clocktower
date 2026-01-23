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
   The AppShell, RoomMachine, and GameMachine state machines are fully defined but not referenced by any client or server integration code. They are currently inert and won’t drive UI or game logic without wiring.
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
   Wire RoomMachine/GameMachine into UI state and realtime updates (websocket + API events).
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
   GameMachine.ts
   rg "GameMachine|RoomMachine|AppShell" -n src
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

## 1/19/2026

- Swap the existing server functions over to the shared specs/bindings so every handler returns DTO-mapped data and exposes queryOptions/mutationOptions.
- Update the TanStack Router routes to call makeBeforeLoadEnsure/makeLoaderFromEnsure (and actions where needed) so the query cache is consistently warmed.
- Build out DTO mappers for each model and start invalidating/updating caches via the new bindings whenever commands execute.
- Wire the actual routes/loaders/actions to use rooms/roomsCrud (ensuring loader data matches the DTO and invalidating via invalidateRoom after commands).
- Reuse makeMongooseCrud in other domains and add scope filters or validators so only authenticated owners can hit update/delete.
- Consider extending the factory with optional list/create bindings (or scoped sanitizers) once more domains rely on it.

Refactor one vertical slice (e.g. rooms.get, rooms.updateOne, rooms.deleteOne) onto:

endpoint registry w/ Zod schemas

bindQueryZod / bindCommandZod

serverFns using .validator(schema.parse)

route beforeLoad/loader using ensure

Once one slice compiles and runs, the rest is a mechanical conversion.

1. Correct ServerFn pattern (current TanStack Start)

Old (wrong now):

createServerFn({ method: "POST" })
.validator((input) => schema.parse(input))

New (correct):

createServerFn({ method: "POST" })
.inputValidator(schema)

inputValidator:

accepts a Zod schema directly

parses + narrows the input

throws a proper server error on failure

types input correctly inside handler

This is exactly what we want.

2. Updated CRUD factory using inputValidator

Here is the corrected, future-proof version of makeMongooseCrud, using your Zod schemas properly.

// src/server/fns/crudFactory.ts
import { createServerFn } from "@tanstack/start";
import type { Model } from "mongoose";
import type { z } from "zod";
import { bindQueryZod, bindCommandZod } from "../../shared/api/bindingsZod";
import type { EndpointSpec } from "../../shared/api/endpoint";

type AnyObj = Record<string, any>;

export function makeMongooseCrud<
TDoc extends AnyObj,
TDto,
TIdKey extends string,
TGet extends EndpointSpec<"query", any, any>,
TUpdate extends EndpointSpec<"command", any, any>,
TDelete extends EndpointSpec<"command", any, any>

> (opts: {
> getEndpoint: TGet;
> updateEndpoint: TUpdate;
> deleteEndpoint: TDelete;

idKey: TIdKey;
Model: Model<TDoc>;
mapDto: (doc: TDoc) => TDto;

scopeFilter?: (input: z.infer<TGet["input"]>, ctx: AnyObj) => AnyObj | Promise<AnyObj>;
}) {
const { getEndpoint, updateEndpoint, deleteEndpoint, idKey, Model, mapDto, scopeFilter } = opts;

const getOneFn = createServerFn({ method: "GET" })
.inputValidator(getEndpoint.input)
.handler(async ({ input, context }) => {
const id = input[idKey];
const extra = scopeFilter ? await scopeFilter(input, context) : {};
const doc = await Model.findOne({ \_id: id, ...extra }).lean();
if (!doc) throw new Error("Not found");
return getEndpoint.output.parse({ item: mapDto(doc as TDoc) });
});

const updateOneFn = createServerFn({ method: "POST" })
.inputValidator(updateEndpoint.input)
.handler(async ({ input, context }) => {
const id = input[idKey];
const extra = scopeFilter ? await scopeFilter(input, context) : {};

      const updated = await Model.findOneAndUpdate(
        { _id: id, ...extra },
        { $set: input.patch },
        { new: true, lean: true }
      );

      if (!updated) throw new Error("Not found or not permitted");
      return updateEndpoint.output.parse({ item: mapDto(updated as TDoc) });
    });

const deleteOneFn = createServerFn({ method: "POST" })
.inputValidator(deleteEndpoint.input)
.handler(async ({ input, context }) => {
const id = input[idKey];
const extra = scopeFilter ? await scopeFilter(input, context) : {};

      const res = await Model.deleteOne({ _id: id, ...extra });
      if (!res.deletedCount) throw new Error("Not found or not permitted");
      return deleteEndpoint.output.parse({ ok: true });
    });

return {
getOne: bindQueryZod({
endpoint: getEndpoint,
fn: getOneFn,
getParams: (i) => ({ [idKey]: i[idKey] }),
}),
updateOne: bindCommandZod({
endpoint: updateEndpoint,
fn: updateOneFn,
}),
deleteOne: bindCommandZod({
endpoint: deleteEndpoint,
fn: deleteOneFn,
}),
};
}

This version is:

✅ using inputValidator

✅ Zod-driven input and output validation

✅ fully typed end-to-end

✅ compatible with your existing endpoint registry

✅ future-proof against Start updates

3. Why this actually improves your architecture (not just correctness)
   You now have four layers of defense, all aligned:

Endpoint registry

Declares input/output schemas

Defines canonical path + kind

ServerFn inputValidator

Enforces schema at runtime

Mapper → DTO → output.parse

Guarantees no DB weirdness escapes

Client bindings re-parse output (optional, but enabled)

Makes refactors loud, not subtle

This is how you keep a long-lived game server sane.

4. Small but important recommendation

For commands that mutate state and return the updated snapshot (especially games.action):

Do not invalidate queries

Do queryClient.setQueryData with the validated output

Because:

you already trust the server snapshot

you avoid race conditions

BOTC is state-machine-heavy and benefits from atomic updates

Your bindings already support this cleanly.

5. Final alignment checklist (we’re locked in now)

✔ ServerFns use inputValidator(zodSchema)

✔ Endpoint registry is the single source of truth

✔ Query keys derived from endpoint.path

✔ CRUD functions include updateOne + deleteOne everywhere

✔ Codegen-ish registry printer catches drift

✔ Zod eliminates patch whitelists and input footguns

At this point, your API layer is boringly correct, which is exactly what you want before adding clever AI storytellers on top of it.


