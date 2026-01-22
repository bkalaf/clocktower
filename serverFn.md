## ServerFn Map

### Queries

api.auth.getSession → server.auth.getSessionFn (GET) → root.beforeLoad (ensure) + root.loader (return) → (no action)
api.rooms.list → server.rooms.listFn (GET) → /lobby.beforeLoad + /lobby.loader → (no action)
api.rooms.get → server.rooms.getFn (GET) → /room/$roomId.beforeLoad + loader → (no action)
api.games.get → server.games.getFn (GET) → /game/$gameId.beforeLoad + loader → (no action)
api.games.ui → server.games.uiFn (GET) → optionally ensure alongside games.get
api.invites.list → server.invites.listFn (GET) → /room/$roomId/invites loader or embedded ensure

### Commands

api.auth.login → server.auth.loginFn (POST) → route action only if <Form>; otherwise call useMutation
api.rooms.create → server.rooms.createFn (POST) → optional route action for create form; otherwise mutation
api.rooms.update → server.rooms.updateFn (POST) → mutation; then queryClient.invalidateQueries(rooms.get.queryKey({roomId}))
api.rooms.startGame → server.rooms.startGameFn (POST) → mutation; then navigate to game route
api.games.action → server.games.actionFn (POST) → mutation; typically invalidates games.get and games.ui
api.invites.accept → server.invites.acceptFn (POST) → mutation; invalidates invites.list + rooms.get

Yep — we can standardize this and kill a lot of glue code.
Below is a concrete helper set you can drop in that does four things:
DTO mapping (Mongoose doc → API shape)
ServerFn factory with a clean Query/Command split
Query keys generated from api.path (split by /)
Route helper that wires beforeLoad → ensureQueryData and loader → useLoaderData, plus action → mutation when you need it
I’m going to assume:
TanStack Router + TanStack Query
TanStack Start / Server Functions
Mongoose on server
Redux exists but we’re using Query for server state
shadcn/tailwind irrelevant here

1. Core idea: define an API “endpoint spec” once
   Make a tiny spec object per endpoint:
   path: canonical string used for queryKeys
   kind: "query" or "command"
   input / output types
   handler: server-side implementation (where you touch Mongoose)
   Everything else (ServerFn + query options + route loader/action helpers) is generated.
2. Helpers: query key generation from api.path
   // src/shared/api/queryKeys.ts
   export type QueryKey = readonly (string | number | boolean | null | undefined | object)[];
   export function pathToKeyParts(path: string): string[] {
   // "/rooms/:roomId" => ["rooms", ":roomId"] (we’ll replace params later)
   return path
   .split("/")
   .map((s) => s.trim())
   .filter(Boolean);
   }
   export function makeQueryKey(path: string, params?: Record<string, unknown>, input?: unknown): QueryKey {
   const base = pathToKeyParts(path).map((part) => {
   if (part.startsWith(":")) {
   const name = part.slice(1);
   const v = params?.[name];
   return v == null ? part : (v as any); // keep placeholder if missing
   }
   return part;
   });
   // Only include input if it’s meaningful for caching. If you hate that, remove it.
   return input === undefined ? (base as QueryKey) : ([...base, { input }] as QueryKey);
   }

This gives you stable keys like:
"/rooms" → ["rooms"]
"/rooms/:roomId" with {roomId:"abc"} → ["rooms","abc"]
"/rooms/:roomId/invites" → ["rooms","abc","invites"] 3) Helpers: safe DTO mapping for Mongoose
You want consistent output shapes (no \_id, no \_\_v, no weird getters).
// src/server/db/dto.ts
import type { Types } from "mongoose";
export type IdString = string;
// Convert ObjectId-ish to string
export function idToString(id: unknown): IdString {
if (!id) return "" as IdString;
// mongoose Types.ObjectId has toString()
return String(id);
}
export function omitUndefined<T extends object>(obj: T): T {
return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
}
/\*\*

- “Lean-first” rule:
-   - Prefer `doc.toObject({ getters:false, virtuals:false })` OR `.lean()` on queries.
-   - Then map fields explicitly into DTOs.
      \*/
      export function toIsoDate(d: unknown): string | null {
      if (!d) return null;
      const dt = d instanceof Date ? d : new Date(String(d));
      return Number.isNaN(dt.valueOf()) ? null : dt.toISOString();
      }

Example mapper pattern (explicit is best):
// src/server/mappers/roomMapper.ts
import { idToString, toIsoDate, omitUndefined } from "../db/dto";
import type { RoomDoc } from "../db/models/Room";
export type RoomDTO = {
id: string;
name: string;
isOpen: boolean;
scriptId: string | null;
createdAt: string | null;
updatedAt: string | null;
};
export function mapRoom(doc: RoomDoc): RoomDTO {
// doc can be lean object or hydrated; handle both
const anyDoc: any = doc as any;
return omitUndefined({
id: idToString(anyDoc.\_id ?? anyDoc.id),
name: String(anyDoc.name ?? ""),
isOpen: Boolean(anyDoc.isOpen),
scriptId: anyDoc.scriptId ? String(anyDoc.scriptId) : null,
createdAt: toIsoDate(anyDoc.createdAt),
updatedAt: toIsoDate(anyDoc.updatedAt),
});
} 4) Endpoint factory: spec → ServerFn + query/mutation wrappers
This is the meat.
// src/shared/api/endpoint.ts
import { makeQueryKey, type QueryKey } from "./queryKeys";
export type ApiKind = "query" | "command";
export type EndpointSpec<TKind extends ApiKind, TInput, TOutput> = {
kind: TKind;
path: string;
// purely for typing + tooling; handler lives server-side
// also lets you hang metadata here later (auth, perms, etc.)
};
export type QueryEndpoint<TInput, TOutput> = EndpointSpec<"query", TInput, TOutput>;
export type CommandEndpoint<TInput, TOutput> = EndpointSpec<"command", TInput, TOutput>;
export function defineQuery<TInput, TOutput>(path: string): QueryEndpoint<TInput, TOutput> {
return { kind: "query", path };
}
export function defineCommand<TInput, TOutput>(path: string): CommandEndpoint<TInput, TOutput> {
return { kind: "command", path };
}
export function keyFor<TInput>(
endpoint: { path: string },
params?: Record<string, unknown>,
input?: TInput
): QueryKey {
return makeQueryKey(endpoint.path, params, input);
}

Now a generator that takes:
the endpoint spec
a ServerFn (implementation bound elsewhere)
and produces:
queryOptions(...)
mutationOptions(...)
convenience hooks usage patterns (you’ll call useQuery(queryOptions()) etc.)
// src/shared/api/bindings.ts
import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { keyFor, type QueryEndpoint, type CommandEndpoint } from "./endpoint";
export type ServerFn<I, O> = (input: I) => Promise<O>;
export function bindQuery<I, O>(endpoint: QueryEndpoint<I, O>, fn: ServerFn<I, O>) {
return {
endpoint,
fn,
queryKey: (params?: Record<string, unknown>, input?: I) => keyFor(endpoint, params, input),
queryOptions: (params?: Record<string, unknown>, input?: I) => ({
queryKey: keyFor(endpoint, params, input) as QueryKey,
queryFn: () => fn(input as I),
}),
ensure: async (qc: QueryClient, params?: Record<string, unknown>, input?: I) => {
return qc.ensureQueryData({
queryKey: keyFor(endpoint, params, input) as QueryKey,
queryFn: () => fn(input as I),
});
},
};
}
export function bindCommand<I, O>(endpoint: CommandEndpoint<I, O>, fn: ServerFn<I, O>) {
return {
endpoint,
fn,
mutationOptions: () => ({
mutationFn: (input: I) => fn(input),
}),
};
}

Important note: For queries I’m using fn(input) directly, which fits your “GET ServerFn” mental model even if internally it’s POST. If you need params, include them in input. The params argument above exists mainly for queryKey substitution (like :roomId), but you can also pack that into input. 5) Route helpers: beforeLoad/loader/action wiring
This follows your plan precisely:
beforeLoad: grab queryClient from router context and prefetch/ensure
loader: read loader data OR ensure again
Component: Route.useLoaderData() then useQuery uses the same key so it’s instantly warm
TanStack Router v1 has a few ways to structure this; here’s a pattern that stays clean:
// src/client/router/routeHelpers.ts
import type { QueryClient } from "@tanstack/react-query";
export type RouterContext = {
queryClient: QueryClient;
};
export function makeBeforeLoadEnsure<TParams, TData>(opts: {
ensure: (qc: QueryClient, params: TParams) => Promise<TData>;
}) {
return async ({ context, params }: { context: RouterContext; params: TParams }) => {
await opts.ensure(context.queryClient, params);
return;
};
}
export function makeLoaderFromEnsure<TParams, TData>(opts: {
ensure: (qc: QueryClient, params: TParams) => Promise<TData>;
}) {
return async ({ context, params }: { context: RouterContext; params: TParams }) => {
// Return the ensured data so Route.useLoaderData() has it
return opts.ensure(context.queryClient, params);
};
}

For actions (commands): you usually don’t need a router “action” unless you’re using <Form> submits. But if you want route actions, here’s a helper:
// src/client/router/routeHelpers.ts (continued)
export function makeAction<TInput, TOutput>(opts: {
act: (input: TInput) => Promise<TOutput>;
}) {
return async ({ input }: { input: TInput }) => {
return opts.act(input);
};
} 6) Putting it together: actual “API map” structure
You asked for “map from api → serverFn → loader → action”.
Let’s define endpoints centrally:
// src/shared/api/endpoints.ts
import { defineQuery, defineCommand } from "./endpoint";
export const api = {
auth: {
getSession: defineQuery<void, { userId: string | null; lastRoomId?: string; lastGameId?: string }>(
"/auth/session"
),
login: defineCommand<{ email: string; password: string }, { ok: true }>("/auth/login"),
logout: defineCommand<void, { ok: true }>("/auth/logout"),
},
rooms: {
list: defineQuery<{ q?: string; openOnly?: boolean }, { rooms: Array<{ id: string; name: string }> }>(
"/rooms"
),
get: defineQuery<{ roomId: string }, { room: any }>("/rooms/:roomId"),
create: defineCommand<{ name: string }, { roomId: string }>("/rooms"),
update: defineCommand<{ roomId: string; patch: { name?: string; isOpen?: boolean } }, { ok: true }>(
"/rooms/:roomId"
),
delete: defineCommand<{ roomId: string }, { ok: true }>("/rooms/:roomId/delete"),
startGame: defineCommand<{ roomId: string }, { gameId: string }>("/rooms/:roomId/start"),
},
games: {
get: defineQuery<{ gameId: string }, { game: any }>("/games/:gameId"),
ui: defineQuery<{ gameId: string }, { can: Record<string, boolean> }>("/games/:gameId/ui"),
action: defineCommand<{ gameId: string; action: any }, { ok: true; game?: any }>(
"/games/:gameId/action"
),
},
invites: {
list: defineQuery<{ roomId: string }, { invites: any[] }>("/rooms/:roomId/invites"),
create: defineCommand<{ roomId: string; toUserId: string }, { inviteId: string }>(
"/rooms/:roomId/invites"
),
accept: defineCommand<{ roomId: string; inviteId: string }, { ok: true }>(
"/rooms/:roomId/invites/:inviteId/accept"
),
},
} as const;

Now bind server functions to those endpoints.
ServerFns live server-side
Example (pseudo TanStack Start-ish):
// src/server/fns/rooms.ts
import { createServerFn } from "@tanstack/start"; // adjust import to your setup
import { api } from "../../shared/api/endpoints";
import { bindQuery, bindCommand } from "../../shared/api/bindings";
import { RoomModel } from "../db/models/Room";
import { mapRoom } from "../mappers/roomMapper";
const roomsListFn = createServerFn({ method: "GET" })
.validator((input: { q?: string; openOnly?: boolean }) => input)
.handler(async ({ input }) => {
const query: any = {};
if (input.openOnly) query.isOpen = true;
if (input.q) query.name = { $regex: input.q, $options: "i" };
const rooms = await RoomModel.find(query).limit(50).lean();
return { rooms: rooms.map(mapRoom) };
});
const roomsGetFn = createServerFn({ method: "GET" })
.validator((input: { roomId: string }) => input)
.handler(async ({ input }) => {
const room = await RoomModel.findById(input.roomId).lean();
if (!room) throw new Error("Room not found");
return { room: mapRoom(room as any) };
});
const roomsCreateFn = createServerFn({ method: "POST" })
.validator((input: { name: string }) => input)
.handler(async ({ input }) => {
const created = await RoomModel.create({ name: input.name, isOpen: true });
return { roomId: String(created.\_id) };
});
export const rooms = {
list: bindQuery(api.rooms.list, roomsListFn),
get: bindQuery(api.rooms.get, roomsGetFn),
create: bindCommand(api.rooms.create, roomsCreateFn),
};

Now the client route becomes very clean.
Route file usage (beforeLoad + loader + component)
// src/client/routes/room.$roomId.tsx
import { createFileRoute } from "@tanstack/react-router";
import { makeBeforeLoadEnsure, makeLoaderFromEnsure } from "../router/routeHelpers";
import { rooms } from "../../server/fns/rooms"; // yes, importing serverfns in Start is normal
import { useQuery } from "@tanstack/react-query";
export const Route = createFileRoute("/room/$roomId")({
beforeLoad: makeBeforeLoadEnsure({
ensure: (qc, params) => rooms.get.ensure(qc, { roomId: params.roomId }, { roomId: params.roomId }),
}),
loader: makeLoaderFromEnsure({
ensure: (qc, params) => rooms.get.ensure(qc, { roomId: params.roomId }, { roomId: params.roomId }),
}),
component: RoomPage,
});
function RoomPage() {
const data = Route.useLoaderData() as Awaited<ReturnType<typeof rooms.get.fn>>;
const { roomId } = Route.useParams();
// This hits cache instantly because loader ensured it with same key.
const q = useQuery(rooms.get.queryOptions({ roomId }, { roomId }));
return (
<div className="p-4">
<div className="text-xl font-semibold">{q.data?.room?.name ?? data.room.name}</div>
</div>
);
}

Yes, that ensure(qc, params, input) signature looks repetitive. You can simplify by deciding “params live inside input” and not passing params separately. I kept params separate purely to support :roomId replacement in queryKey.
A cleaner variant: derive params from input (recommended). If you do that, your bindQuery can take a getParams(input) function. 7) Cleaner version (recommended): params derived from input automatically
This removes the duplication and makes everything consistent.
// src/shared/api/bindings2.ts
import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { makeQueryKey } from "./queryKeys";
import type { QueryEndpoint, CommandEndpoint } from "./endpoint";
export type ServerFn<I, O> = (input: I) => Promise<O>;
export function bindQuery<I extends object, O>(opts: {
endpoint: QueryEndpoint<I, O>;
fn: ServerFn<I, O>;
getParams: (input: I) => Record<string, unknown>;
}) {
const { endpoint, fn, getParams } = opts;
return {
endpoint,
fn,
queryKey: (input: I) => makeQueryKey(endpoint.path, getParams(input), input),
queryOptions: (input: I) => ({
queryKey: makeQueryKey(endpoint.path, getParams(input), input) as QueryKey,
queryFn: () => fn(input),
}),
ensure: async (qc: QueryClient, input: I) => {
return qc.ensureQueryData({
queryKey: makeQueryKey(endpoint.path, getParams(input), input) as QueryKey,
queryFn: () => fn(input),
});
},
};
}
export function bindCommand<I, O>(endpoint: CommandEndpoint<I, O>, fn: ServerFn<I, O>) {
return { endpoint, fn, mutationOptions: () => ({ mutationFn: (input: I) => fn(input) }) };
}

Then rooms.get is:
// rooms.get binding
export const rooms = {
get: bindQuery({
endpoint: api.rooms.get,
fn: roomsGetFn,
getParams: (i) => ({ roomId: i.roomId }),
}),
// ...
};

Route usage becomes:
beforeLoad: async ({ context, params }) => {
await rooms.get.ensure(context.queryClient, { roomId: params.roomId });
},
loader: async ({ context, params }) => {
return rooms.get.ensure(context.queryClient, { roomId: params.roomId });
},
component: () => {
const { roomId } = Route.useParams();
const q = useQuery(rooms.get.queryOptions({ roomId }));
// ...
}

That’s the version I’d standardize on. 8) The requested map: API → ServerFn → loader/action
Here’s a direct mapping template you can keep in docs/api-map.md or even generate later:
Queries
api.auth.getSession → server.auth.getSessionFn (GET) → root.beforeLoad (ensure) + root.loader (return) → (no action)
api.rooms.list → server.rooms.listFn (GET) → /lobby.beforeLoad + /lobby.loader → (no action)
api.rooms.get → server.rooms.getFn (GET) → /room/$roomId.beforeLoad + loader → (no action)
api.games.get → server.games.getFn (GET) → /game/$gameId.beforeLoad + loader → (no action)
api.games.ui → server.games.uiFn (GET) → optionally ensure alongside games.get
api.invites.list → server.invites.listFn (GET) → /room/$roomId/invites loader or embedded ensure
Commands
api.auth.login → server.auth.loginFn (POST) → route action only if <Form>; otherwise call useMutation
api.rooms.create → server.rooms.createFn (POST) → optional route action for create form; otherwise mutation
api.rooms.update → server.rooms.updateFn (POST) → mutation; then queryClient.invalidateQueries(rooms.get.queryKey({roomId}))
api.rooms.startGame → server.rooms.startGameFn (POST) → mutation; then navigate to game route
api.games.action → server.games.actionFn (POST) → mutation; typically invalidates games.get and games.ui
api.invites.accept → server.invites.acceptFn (POST) → mutation; invalidates invites.list + rooms.get
If you want, we can actually generate this map automatically from your endpoint registry (since it already has path + kind) and your bindings (which know what exists). But the above is enough to start refactoring today. 9) Plan to move forward (low drama refactor)
Create the shared API layer
src/shared/api/queryKeys.ts
src/shared/api/endpoint.ts
src/shared/api/endpoints.ts
Adopt one binding style
Use the “recommended” bindQuery({ getParams }) version so query keys are always correct and you don’t repeat params/input everywhere.
Move ServerFns into src/server/fns/\*
One file per domain: auth.ts, rooms.ts, games.ts, invites.ts, users.ts
Each exports a { list, get, create, ... } object of bound endpoints.
Route refactor pass (mechanical)
For each route:
beforeLoad: ensure required queries
loader: return ensured data (so Route.useLoaderData() works)
Component uses useQuery with same queryOptions (warm cache)
Mutation rules (consistency)
Every command mutation decides one of:
invalidateQueries(keys...), or
setQueryData with returned snapshot (best for games.action if it returns new state)
Standardize this per command so UI behavior is predictable.
DTO discipline
All ServerFns return DTOs (no raw mongoose docs).
Prefer .lean() and explicit mappers.
Add zod (or similar) validators later if you want runtime safety.
Optional: Codegen-ish niceties
Add a small script that introspects api registry and prints:
endpoint list
which are queries vs commands
query keys examples
Not required, but it’s nerd candy and catches drift.
If you paste (or point to) your current serverFn setup style (TanStack Start version + how you’re exporting them now), I can tailor the exact imports/typing so this drops in without you playing “TypeScript whack-a-mole.”

# 2nd MESSAGE

Here’s how I’d bake updateOne and deleteOne in from day one without turning your API into a swamp:

Put them in a generic “crud bindings” helper you can reuse across models.

Keep them as Commands (POST) even if they conceptually map to PATCH/DELETE.

Make them DTO-returning and safe (filter by id + auth scope, validate patch keys).

Below is a drop-in pattern that adds:

getOne (query)

list (query, optional)

createOne (command, optional)

updateOne (command) ✅

deleteOne (command) ✅

…and they all share consistent query keys based on api.path.

1. Add endpoints for update/delete in your registry

Example for rooms:

// src/shared/api/endpoints.ts
import { defineQuery, defineCommand } from "./endpoint";

export const api = {
rooms: {
get: defineQuery<{ roomId: string }, { room: any }>("/rooms/:roomId"),
list: defineQuery<{ q?: string }, { rooms: any[] }>("/rooms"),
create: defineCommand<{ name: string }, { roomId: string }>("/rooms"),
updateOne: defineCommand<{ roomId: string; patch: { name?: string; isOpen?: boolean } }, { room: any }>(
"/rooms/:roomId/update"
),
deleteOne: defineCommand<{ roomId: string }, { ok: true }>("/rooms/:roomId/delete"),
},
} as const;

Note: I used distinct paths (/update, /delete) to avoid ambiguity and keep it explicit.

2. Generic CRUD factory (mongoose model → serverFns)

This is the reusable chunk. It assumes you’ll provide:

Model

mapDto

optional scopeFilter(input, ctx) for auth/room membership etc.

optional sanitizePatch(patch) to whitelist fields

// src/server/fns/crudFactory.ts
import { createServerFn } from "@tanstack/start"; // adjust to your setup
import type { Model } from "mongoose";
import { bindQuery, bindCommand } from "../../shared/api/bindings2";
import type { QueryEndpoint, CommandEndpoint } from "../../shared/api/endpoint";

type AnyObj = Record<string, any>;

export function makeMongooseCrud<TDoc extends AnyObj, TDto, TIdKey extends string>(opts: {
// endpoints
getEndpoint: QueryEndpoint<Record<TIdKey, string>, { item: TDto }>;
updateEndpoint: CommandEndpoint<Record<TIdKey, string> & { patch: AnyObj }, { item: TDto }>;
deleteEndpoint: CommandEndpoint<Record<TIdKey, string>, { ok: true }>;

idKey: TIdKey; // e.g. "roomId"
Model: Model<any>;

mapDto: (doc: any) => TDto;

// auth / scoping: add additional filters (like { ownerId: session.userId })
scopeFilter?: (input: Record<TIdKey, string>, ctx: AnyObj) => AnyObj | Promise<AnyObj>;

// whitelist / normalize patch fields
sanitizePatch?: (patch: AnyObj) => AnyObj;
}) {
const {
getEndpoint,
updateEndpoint,
deleteEndpoint,
idKey,
Model,
mapDto,
scopeFilter,
sanitizePatch,
} = opts;

const getOneFn = createServerFn({ method: "GET" })
.validator((input: Record<TIdKey, string>) => input)
.handler(async ({ input, context }) => {
const id = input[idKey];
const extra = scopeFilter ? await scopeFilter(input, context) : {};
const doc = await Model.findOne({ \_id: id, ...extra }).lean();
if (!doc) throw new Error("Not found");
return { item: mapDto(doc) };
});

const updateOneFn = createServerFn({ method: "POST" })
.validator((input: Record<TIdKey, string> & { patch: AnyObj }) => input)
.handler(async ({ input, context }) => {
const id = input[idKey];
const extra = scopeFilter ? await scopeFilter(input, context) : {};

      const patch = sanitizePatch ? sanitizePatch(input.patch) : input.patch;

      // Make it “updateOne-like”: update exactly one doc, return updated item
      const updated = await Model.findOneAndUpdate(
        { _id: id, ...extra },
        { $set: patch },
        { new: true, lean: true }
      );

      if (!updated) throw new Error("Not found or not permitted");
      return { item: mapDto(updated) };
    });

const deleteOneFn = createServerFn({ method: "POST" })
.validator((input: Record<TIdKey, string>) => input)
.handler(async ({ input, context }) => {
const id = input[idKey];
const extra = scopeFilter ? await scopeFilter(input, context) : {};

      const res = await Model.deleteOne({ _id: id, ...extra });
      // mongoose deleteOne returns { deletedCount }
      if (!res?.deletedCount) throw new Error("Not found or not permitted");
      return { ok: true as const };
    });

return {
getOne: bindQuery({
endpoint: getEndpoint,
fn: getOneFn,
getParams: (i) => ({ [idKey]: i[idKey] }),
}),
updateOne: bindCommand(updateEndpoint, updateOneFn),
deleteOne: bindCommand(deleteEndpoint, deleteOneFn),
};
}

Why this approach is worth it

You get updateOne/deleteOne everywhere without copy/paste

You still keep strict endpoint types and query keys

You can enforce security via scopeFilter centrally

3. Use it for Rooms (realistic example)
   // src/server/fns/rooms.ts
   import { api } from "../../shared/api/endpoints";
   import { RoomModel } from "../db/models/Room";
   import { mapRoom, type RoomDTO } from "../mappers/roomMapper";
   import { makeMongooseCrud } from "./crudFactory";

function sanitizeRoomPatch(patch: any) {
// whitelist only what you intend to allow
const out: any = {};
if (typeof patch.name === "string") out.name = patch.name;
if (typeof patch.isOpen === "boolean") out.isOpen = patch.isOpen;
if (patch.scriptId === null || typeof patch.scriptId === "string") out.scriptId = patch.scriptId;
return out;
}

export const roomsCrud = makeMongooseCrud({
getEndpoint: api.rooms.get, // expects { roomId } -> { item }
updateEndpoint: api.rooms.updateOne,
deleteEndpoint: api.rooms.deleteOne,
idKey: "roomId",
Model: RoomModel,
mapDto: mapRoom,
sanitizePatch: sanitizeRoomPatch,

// example: enforce that requester is a member/storyteller/etc
// scopeFilter: async (input, ctx) => ({ /_ e.g. ownerId: ctx.session.userId _/ }),
});

Note: this expects your endpoints to return { item: RoomDTO }. If you prefer { room: RoomDTO }, adjust the factory return shape. I like { item } for reusable CRUD, and keep domain-specific wrappers for prettier response names.

4. Route + UI usage (mutation + invalidation)

Even if you “don’t use them yet”, here’s the canonical behavior:

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomsCrud } from "../../server/fns/rooms";

function RoomSettings({ roomId }: { roomId: string }) {
const qc = useQueryClient();

const update = useMutation({
...roomsCrud.updateOne.mutationOptions(),
onSuccess: () => {
// invalidate the get query key based on the same endpoint path
qc.invalidateQueries({ queryKey: roomsCrud.getOne.queryKey({ roomId }) });
},
});

const del = useMutation({
...roomsCrud.deleteOne.mutationOptions(),
onSuccess: () => {
qc.removeQueries({ queryKey: roomsCrud.getOne.queryKey({ roomId }) });
// navigate away etc.
},
});

// ...
}

If your command returns the updated DTO, you can setQueryData instead of invalidating (faster, fewer round-trips). For BOTC game state, you’ll likely do that a lot.

5. Small refinement I recommend now (so you don’t hate yourself later)
   Add “domain wrappers” for nicer output names

Keep CRUD generic returning { item }, but wrap it:

export const rooms = {
get: roomsCrud.getOne,
updateOne: roomsCrud.updateOne,
deleteOne: roomsCrud.deleteOne,

// pretty helpers
invalidateRoom: (qc: any, roomId: string) => qc.invalidateQueries({ queryKey: roomsCrud.getOne.queryKey({ roomId }) }),
};

This keeps your route/component code readable while still being generated.

6. Plan tweak (since you want these “from the jump”)

Update the plan step 2:

Define endpoints for every model domain:

get, list, create, updateOne, deleteOne

Implement them via makeMongooseCrud

Add specialized commands only when they’re not CRUD (e.g. rooms.startGame, games.action)

That gives you a stable “API skeleton” and avoids the “ugh we need delete now” scramble.

Yes on both counts.

1. Zod makes the helpers strictly better

You can use Zod in three places at once:

ServerFn input validation: reject bad inputs on the server before touching DB.

Output validation (optional but awesome): guarantee your ServerFns never leak a weird shape (especially when refactoring mappers).

Typed client bindings: infer input/output types directly from schemas so endpoint defs can’t drift.

That’s the “drift-killer” combo.

A. Upgrade the endpoint spec to carry Zod schemas
// src/shared/api/endpoint.ts
import type { z } from "zod";

export type ApiKind = "query" | "command";

export type EndpointSpec<TKind extends ApiKind, TIn extends z.ZodTypeAny, TOut extends z.ZodTypeAny> = {
kind: TKind;
path: string;
input: TIn;
output: TOut;
};

export type InferInput<E extends EndpointSpec<any, any, any>> = z.infer<E["input"]>;
export type InferOutput<E extends EndpointSpec<any, any, any>> = z.infer<E["output"]>;

export function defineQuery<TIn extends z.ZodTypeAny, TOut extends z.ZodTypeAny>(
path: string,
input: TIn,
output: TOut
): EndpointSpec<"query", TIn, TOut> {
return { kind: "query", path, input, output };
}

export function defineCommand<TIn extends z.ZodTypeAny, TOut extends z.ZodTypeAny>(
path: string,
input: TIn,
output: TOut
): EndpointSpec<"command", TIn, TOut> {
return { kind: "command", path, input, output };
}

Now your registry becomes the source of truth.

B. Bindings that auto-validate input and (optionally) output

This assumes your ServerFn supports .validator(...) and that you can run Zod parse inside handler if needed.

// src/shared/api/bindingsZod.ts
import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { makeQueryKey } from "./queryKeys";
import type { EndpointSpec, InferInput, InferOutput } from "./endpoint";

export type ServerFn<I, O> = (input: I) => Promise<O>;

export function bindQueryZod<E extends EndpointSpec<"query", any, any>>(opts: {
endpoint: E;
fn: ServerFn<InferInput<E>, InferOutput<E>>;
getParams: (input: InferInput<E>) => Record<string, unknown>;
}) {
const { endpoint, fn, getParams } = opts;

return {
endpoint,
fn,
queryKey: (input: InferInput<E>) =>
makeQueryKey(endpoint.path, getParams(input), input),
queryOptions: (input: InferInput<E>) => ({
queryKey: makeQueryKey(endpoint.path, getParams(input), input) as QueryKey,
queryFn: async () => {
// client-side safety (optional; cheap)
const parsedIn = endpoint.input.parse(input);
const out = await fn(parsedIn);
// output safety (optional; enable if you want hard guarantees)
return endpoint.output.parse(out);
},
}),
ensure: (qc: QueryClient, input: InferInput<E>) => {
return qc.ensureQueryData({
queryKey: makeQueryKey(endpoint.path, getParams(input), input) as QueryKey,
queryFn: async () => {
const parsedIn = endpoint.input.parse(input);
const out = await fn(parsedIn);
return endpoint.output.parse(out);
},
});
},
};
}

export function bindCommandZod<E extends EndpointSpec<"command", any, any>>(opts: {
endpoint: E;
fn: ServerFn<InferInput<E>, InferOutput<E>>;
}) {
const { endpoint, fn } = opts;

return {
endpoint,
fn,
mutationOptions: () => ({
mutationFn: async (input: InferInput<E>) => {
const parsedIn = endpoint.input.parse(input);
const out = await fn(parsedIn);
return endpoint.output.parse(out);
},
}),
};
}

If you think output parsing is too strict/slow, you can make it a flag.

C. Use Zod in ServerFn .validator(...) (yes)

If your ServerFn validator expects a function returning validated input, this is perfect:

// server side
const roomsGetFn = createServerFn({ method: "GET" })
.validator((input) => api.rooms.get.input.parse(input))
.handler(async ({ input }) => {
// input is now strongly typed and guaranteed valid
const room = await RoomModel.findById(input.roomId).lean();
if (!room) throw new Error("Room not found");
const dto = mapRoom(room as any);
return api.rooms.get.output.parse({ room: dto }); // optional output validation
});

If your validator API is different (some libs want a schema directly), you can still parse in handler. But when .validator(parse) is available, it’s the cleanest.

2. Codegen-ish nerd candy script ✅

Goal: introspect your api registry and print:

endpoint list

query vs command

example queryKey parts (+ param substitution examples)

A. Script
// scripts/print-api-registry.ts
import { api } from "../src/shared/api/endpoints";
import { pathToKeyParts, makeQueryKey } from "../src/shared/api/queryKeys";

type AnyObj = Record<string, any>;

function walk(obj: AnyObj, prefix: string[] = []): Array<{ name: string; endpoint: any }> {
const out: Array<{ name: string; endpoint: any }> = [];

for (const [k, v] of Object.entries(obj)) {
if (!v) continue;
if (typeof v === "object" && "path" in v && "kind" in v) {
out.push({ name: [...prefix, k].join("."), endpoint: v });
} else if (typeof v === "object") {
out.push(...walk(v, [...prefix, k]));
}
}
return out;
}

function exampleParamsFromPath(path: string): Record<string, unknown> {
// "/rooms/:roomId/invites/:inviteId" -> { roomId:"<roomId>", inviteId:"<inviteId>" }
const params: Record<string, unknown> = {};
for (const part of pathToKeyParts(path)) {
if (part.startsWith(":")) params[part.slice(1)] = `<${part.slice(1)}>`;
}
return params;
}

function main() {
const entries = walk(api);

const rows = entries
.sort((a, b) => a.endpoint.path.localeCompare(b.endpoint.path))
.map(({ name, endpoint }) => {
const params = exampleParamsFromPath(endpoint.path);
const key = makeQueryKey(endpoint.path, params, undefined);
return {
name,
kind: endpoint.kind,
path: endpoint.path,
keyExample: JSON.stringify(key),
};
});

// Pretty print
const byKind = {
query: rows.filter((r) => r.kind === "query"),
command: rows.filter((r) => r.kind === "command"),
};

console.log("\n=== API Registry ===\n");
console.log(`Queries:  ${byKind.query.length}`);
console.log(`Commands: ${byKind.command.length}\n`);

const print = (title: string, items: typeof rows) => {
console.log(`--- ${title} ---`);
for (const r of items) {
console.log(`${r.path}  [${r.kind}]  (${r.name})`);
console.log(`  queryKey: ${r.keyExample}`);
}
console.log("");
};

print("Queries", byKind.query);
print("Commands", byKind.command);
}

main();

B. Add a package.json script (pick one runner)

If you already use tsx (recommended for TS scripts):

{
"scripts": {
"api:print": "tsx scripts/print-api-registry.ts"
}
}

Or if you’re on ts-node, swap accordingly.

This will catch drift immediately: if someone edits paths or moves endpoints around, the printed output changes.

3. Where Zod gives the biggest wins in BOTC specifically

games.action: validate the action union hard. This prevents “client invented an action” bugs and makes cheating harder.

DTOs: validate the server’s returned snapshot. It makes refactors survivable.

Patch sanitization: you can validate patch with a Zod schema that only allows the fields you want.

Example patch schema:

const RoomPatchSchema = z
.object({
name: z.string().min(1).optional(),
isOpen: z.boolean().optional(),
scriptId: z.string().nullable().optional(),
})
.strict();

Then your update endpoint input schema uses it:

const UpdateRoomInput = z.object({
roomId: z.string(),
patch: RoomPatchSchema,
});

No ad-hoc whitelisting needed. Zod becomes the whitelist.
