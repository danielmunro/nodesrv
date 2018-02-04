import { Server } from "ws"
import { PORT } from "./../src/config"
import { GameServer } from "./../src/server/index"
import { LiveTimer } from "./../src/server/timer/live-timer"

const gs = new GameServer(new Server({ port: PORT }))
gs.start(new LiveTimer())

console.log("server listening on port", PORT)
