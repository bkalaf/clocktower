=== API Registry ===

Queries: 6
Commands: 9

--- Queries ---
/auth/session [query] (auth.getSession)
queryKey: ["auth","session"]
/games/:gameId [query] (games.get)
queryKey: ["games","<gameId>"]
/games/:gameId/ui [query] (games.ui)
queryKey: ["games","<gameId>","ui"]
/rooms [query] (rooms.list)
queryKey: ["rooms"]
/rooms/:roomId [query] (rooms.get)
queryKey: ["rooms","<roomId>"]
/rooms/:roomId/invites [query] (invites.list)
queryKey: ["rooms","<roomId>","invites"]

--- Commands ---
/auth/login [command] (auth.login)
queryKey: ["auth","login"]
/auth/logout [command] (auth.logout)
queryKey: ["auth","logout"]
/games/:gameId/action [command] (games.action)
queryKey: ["games","<gameId>","action"]
/rooms [command] (rooms.create)
queryKey: ["rooms"]
/rooms/:roomId/delete [command] (rooms.deleteOne)
queryKey: ["rooms","<roomId>","delete"]
/rooms/:roomId/invites [command] (invites.create)
queryKey: ["rooms","<roomId>","invites"]
/rooms/:roomId/invites/:inviteId/accept [command] (invites.accept)
queryKey: ["rooms","<roomId>","invites","<inviteId>","accept"]
/rooms/:roomId/start [command] (rooms.startGame)
queryKey: ["rooms","<roomId>","start"]
/rooms/:roomId/update [command] (rooms.updateOne)
queryKey: ["rooms","<roomId>","update"]
