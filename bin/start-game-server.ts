import * as assert from "assert"
import { initialize as mobInitialize } from "../src/mob/table"
import { Room } from "../src/room/model/room"
import { findOneRoom } from "../src/room/repository/room"
import { initialize as roomInitialize } from "../src/room/table"
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

Promise.all([
  roomInitialize(),
  mobInitialize(),
]).then(() => findOneRoom(startRoomID).then(startServer))
