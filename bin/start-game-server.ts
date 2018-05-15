import * as assert from "assert"
import { Server as WebSocketServer } from "ws"
import { PORT } from "../src/constants"
import { getPlayerProvider } from "../src/player/fixture/player"
import { findOneRoom } from "../src/room/repository/room"
import addObservers from "../src/server/observerDecorator"
import { GameServer } from "../src/server/server"

const startRoomID = +process.argv[2]
assert.ok(startRoomID > 0, "start room ID is required to be a number")
console.log("starting up", { port: PORT, startRoomID })

findOneRoom(startRoomID).then((startRoom) =>
  addObservers(new GameServer(new WebSocketServer({ port: PORT }), startRoom)).start())
