# Project Folder Structure (Proposed)

```
/ (repo root)
├── route-map.md
├── data-model.md
├── folder-struct.md
├── README.md
├── src/
│   ├── assets/
│   ├── client/
│   │   ├── api/                 # client fetch wrappers
│   │   ├── dev/                 # dev-only panels/tools
│   │   └── belief/              # client logic for game state projections
│   ├── components/
│   │   ├── grimoire/
│   │   ├── header/
│   │   └── ui/
│   ├── data/                    # static data (scripts, etc.)
│   ├── db/
│   │   ├── models/
│   │   └── migrations/          # future migrations
│   ├── hooks/
│   ├── machines/                # XState machines
│   ├── routes/
│   │   ├── __root.tsx
│   │   ├── index.tsx            # splash
│   │   ├── lobby.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── forgot-password.tsx
│   │   ├── reset-password.$token.tsx
│   │   ├── profile/
│   │   │   ├── me.tsx
│   │   │   └── $userId.tsx
│   │   ├── games/
│   │   │   ├── $gameId.tsx
│   │   │   ├── $gameId.grimoire.tsx
│   │   │   ├── $gameId.chat.tsx
│   │   │   └── $gameId.storyteller.tsx
│   │   ├── replays/
│   │   │   ├── index.tsx
│   │   │   └── $replayId.tsx
│   │   └── api/
│   │       ├── auth/
│   │       ├── rooms/
│   │       ├── games/
│   │       ├── replays/
│   │       └── users/
│   ├── schemas/
│   ├── server/
│   │   ├── auth/
│   │   ├── realtime/
│   │   └── session/
│   ├── serverFns/
│   ├── types/
│   └── utils/
└── vite.config.ts
```

## Notes
- Keep demo routes under `src/routes/dev` or guard behind `import.meta.env.DEV`.
- Prefer route co-location in `routes/` for page-level state and API handlers.
