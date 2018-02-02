import { Server } from "ws"
import { PORT } from "./../src/config"
import GameServer from "./../src/server/index"

const gs = new GameServer(new Server({ port: PORT }))
gs.start()

console.log("server listening on port", PORT)
