import { Server } from "ws"
import { PORT } from "./../src/config"
import { GameServer } from "./../src/server/index"
import { LiveTimer } from "./../src/server/timer/live-timer"
import { readMessages } from "./../src/social/chat"

const gs = new GameServer(
  new Server({ port: PORT }),
  new LiveTimer(),
  readMessages,
)
gs.start()

console.log("server listening on port", PORT)
