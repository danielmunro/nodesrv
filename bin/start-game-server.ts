import * as assert from "assert"
import { Room } from "../src/room/model/room"
import { findOneRoom } from "../src/room/repository/room"
import newServer from "../src/server/factory"

/**
 * Obtain the start room ID and port from arguments passed in
 */
const startRoomID = +process.argv[2]
const port = +process.argv[3]

assert.ok(startRoomID > 0, "start room ID is required to be a number")
console.info("loading start room", { startRoomID })

function startServer(startRoom: Room) {
  console.info("starting up server", { port })
  newServer(startRoom, port).start()
}

findOneRoom(startRoomID).then(startServer)
