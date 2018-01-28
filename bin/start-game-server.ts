import { Server } from "ws"
import { PORT } from "./../src/config"
import start from "./../src/server/index"

start(new Server({ port: PORT }))

console.log("server listening on port", PORT)
