import * as assert from "assert"
import { initialize as mobInitialize } from "../src/mob/table"
import { Room } from "../src/room/model/room"
import Service from "../src/room/service"
import { newTable } from "../src/room/table"
import newServer from "../src/server/factory"

/**
 * Obtain the start room ID and port from arguments passed in
 */
const startRoomID = process.argv[2]
const port = +process.argv[3]

assert.ok(startRoomID, "start room ID is required to be defined")
console.info("loading start room", { startRoomID })

async function startServer(service: Service, startRoom: Room) {
  console.info("starting up server", { port })
  return newServer(service, port, startRoom).start()
}

Promise.all([
  newTable(),
  mobInitialize(),
]).then(async ([table, thing]) =>
  startServer(await Service.new(table), table.get(startRoomID)))
