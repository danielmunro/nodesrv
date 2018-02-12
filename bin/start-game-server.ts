import { Server } from "ws"
import { PORT } from "./../src/config"
import { Player } from "./../src/player/player"
import { Room } from "./../src/room/room"
import { GameServer } from "./../src/server/index"
import { LiveTimer } from "./../src/server/timer/liveTimer"
import { readMessages } from "./../src/social/chat"

const startRoom = new Room("default name")

function playerProvider(name: string): Player {
  return new Player(name, startRoom)
}

const gs = new GameServer(
  new Server({ port: PORT }),
  new LiveTimer(),
  readMessages,
  playerProvider,
)
gs.start()

console.log("server listening on port", PORT)
