import * as assert from "assert"
import eventConsumerTable from "../src/event/eventConsumerTable"
import EventService from "../src/event/eventService"
import { createResetService } from "../src/gameService/factory"
import GameService from "../src/gameService/gameService"
import ItemService from "../src/item/itemService"
import ItemTable from "../src/item/itemTable"
import { getItemRepository } from "../src/item/repository/item"
import { createMobService } from "../src/mob/factory"
import LocationService from "../src/mob/locationService"
import MobTable from "../src/mob/mobTable"
import { getMobRepository } from "../src/mob/repository/mob"
import { newExitTable, newRoomTable } from "../src/room/factory"
import newServer from "../src/server/factory"
import { initializeConnection } from "../src/support/db/connection"

const Timings = {
  init: "total game initialization",
  openPort: "open server port",
  resetService: "create reset service initialization",
  roomAndMobTables: "room, mob, and exit table initialization",
  seedItems: "seeding items",
  seedMobs: "seeding world",
}

/**
 * Obtain the start room ID and port from arguments passed in
 */
const startRoomID = +process.argv[2]
const port = +process.argv[3]
console.time(Timings.init)
assert.ok(startRoomID, "start room ID is required to be defined")
const locationService = new LocationService()
console.log(`startup parameters:  port: ${port}, room: ${startRoomID}`)

initializeConnection().then(async () => {
  console.time(Timings.roomAndMobTables)
  const tables = await initializeRoomAndMobTables()
  const roomTable = tables[0]
  const mobTable = tables[1]
  const exitTable = tables[2]
  const mobService = await createMobService(mobTable, locationService)
  console.debug(`room table initialized with ${roomTable.count()} rooms`)
  console.timeEnd(Timings.roomAndMobTables)

  console.time(Timings.resetService)
  const itemService = new ItemService(
    new ItemTable(), new ItemTable(await (await getItemRepository()).findAll()))
  const resetService = await createResetService(mobService, roomTable, itemService)
  console.timeEnd(Timings.resetService)

  console.time(Timings.seedMobs)
  await resetService.seedMobTable()
  console.timeEnd(Timings.seedMobs)

  console.time(Timings.seedItems)
  await resetService.seedItemRoomResets()
  console.timeEnd(Timings.seedItems)

  console.time(Timings.openPort)
  const gameService = await GameService.new(
    mobService, itemService, roomTable, exitTable, new EventService(eventConsumerTable))
  const server = await newServer(
    gameService,
    port,
    roomTable.getRooms().find(room => room.canonicalId === startRoomID),
    resetService,
    mobService)
  await server.start()
  console.timeEnd(Timings.openPort)
  console.timeEnd(Timings.init)
})

async function initializeRoomAndMobTables() {
  return Promise.all([
    newRoomTable(),
    new MobTable(await (await getMobRepository()).findAll()),
    newExitTable(locationService),
  ])
}
