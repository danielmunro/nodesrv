import { Server } from "ws"
import { PORT } from "./../src/constants"
import { Player } from "./../src/player/player"
import { Room } from "./../src/room/room"
import { GameServer } from "./../src/server/index"
import { LiveTimer } from "./../src/server/timer/liveTimer"
import { readMessages } from "./../src/social/chat"

const startRoom = new Room(1, "default name")

function playerProvider(name: string): Player {
  return new Player(name, startRoom)
}

new GameServer(
  new Server({ port: PORT }),
  new LiveTimer(),
  readMessages,
  playerProvider,
).start()

console.log("server listening on port", PORT)
