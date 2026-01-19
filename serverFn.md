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
1) Core idea: define an API “endpoint spec” once
Make a tiny spec object per endpoint:
path: canonical string used for queryKeys
kind: "query" or "command"
input / output types
handler: server-side implementation (where you touch Mongoose)
Everything else (ServerFn + query options + route loader/action helpers) is generated.
2) Helpers: query key generation from api.path
// src/shared/api/queryKeys.ts
export type QueryKey = readonly (string | number | boolean | null | undefined | object)[];
export function pathToKeyParts(path: string): string[] {
  // "/rooms/:roomId" => ["rooms", ":roomId"]  (we’ll replace params later)
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
"/rooms/:roomId/invites" → ["rooms","abc","invites"]
3) Helpers: safe DTO mapping for Mongoose
You want consistent output shapes (no _id, no __v, no weird getters).
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
/**
 * “Lean-first” rule:
 * - Prefer `doc.toObject({ getters:false, virtuals:false })` OR `.lean()` on queries.
 * - Then map fields explicitly into DTOs.
 */
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
    id: idToString(anyDoc._id ?? anyDoc.id),
    name: String(anyDoc.name ?? ""),
    isOpen: Boolean(anyDoc.isOpen),
    scriptId: anyDoc.scriptId ? String(anyDoc.scriptId) : null,
    createdAt: toIsoDate(anyDoc.createdAt),
    updatedAt: toIsoDate(anyDoc.updatedAt),
  });
}
4) Endpoint factory: spec → ServerFn + query/mutation wrappers
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

Important note: For queries I’m using fn(input) directly, which fits your “GET ServerFn” mental model even if internally it’s POST. If you need params, include them in input. The params argument above exists mainly for queryKey substitution (like :roomId), but you can also pack that into input.
5) Route helpers: beforeLoad/loader/action wiring
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
}
6) Putting it together: actual “API map” structure
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
    return { roomId: String(created._id) };
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
A cleaner variant: derive params from input (recommended). If you do that, your bindQuery can take a getParams(input) function.
7) Cleaner version (recommended): params derived from input automatically
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

That’s the version I’d standardize on.
8) The requested map: API → ServerFn → loader/action
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
If you want, we can actually generate this map automatically from your endpoint registry (since it already has path + kind) and your bindings (which know what exists). But the above is enough to start refactoring today.
9) Plan to move forward (low drama refactor)
Create the shared API layer
src/shared/api/queryKeys.ts
src/shared/api/endpoint.ts
src/shared/api/endpoints.ts
Adopt one binding style
Use the “recommended” bindQuery({ getParams }) version so query keys are always correct and you don’t repeat params/input everywhere.
Move ServerFns into src/server/fns/*
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