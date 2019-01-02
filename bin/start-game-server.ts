import * as assert from "assert"
import createEventConsumerTable from "../src/event/eventConsumerTable"
import EventService from "../src/event/eventService"
import { createResetService } from "../src/gameService/factory"
import GameService from "../src/gameService/gameService"
import ItemService from "../src/item/itemService"
import ItemTable from "../src/item/itemTable"
import { getItemRepository } from "../src/item/repository/item"
import { createMobService } from "../src/mob/factory"
import FightBuilder from "../src/mob/fight/fightBuilder"
import LocationService from "../src/mob/locationService"
import MobTable from "../src/mob/mobTable"
import { getMobRepository } from "../src/mob/repository/mob"
import {getPlayerRepository} from "../src/player/repository/player"
import { newExitTable, newRoomTable } from "../src/room/factory"
import ClientService from "../src/server/clientService"
import newServer from "../src/server/factory"
import AuthService from "../src/session/auth/authService"
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
  const [ roomTable, mobTable, exitTable ] = await getAllRoomsAndMobs()
  const mobService = await createMobService(mobTable, locationService)
  console.timeEnd(Timings.roomAndMobTables)

  console.time(Timings.resetService)
  const itemService = new ItemService(new ItemTable(), await getAllItems())
  const resetService = await createResetService(mobService, roomTable, itemService)
  console.timeEnd(Timings.resetService)

  console.time(Timings.seedMobs)
  await resetService.seedMobTable()
  console.timeEnd(Timings.seedMobs)

  console.time(Timings.seedItems)
  await resetService.seedItemRoomResets()
  console.timeEnd(Timings.seedItems)

  console.time(Timings.openPort)
  const eventService = new EventService()
  const gameService = new GameService(mobService, roomTable, itemService, exitTable, eventService)
  const startRoom = roomTable.getRooms().find(room => room.canonicalId === startRoomID)
  const clientService = new ClientService(
    eventService,
    new AuthService(await getPlayerRepository(), mobService),
    mobService.locationService,
    gameService.getActionCollection()
  )
  const server = await newServer(
    gameService,
    port,
    startRoom,
    resetService,
    mobService,
    eventService,
    clientService)
  const eventConsumerTable = await createEventConsumerTable(
    gameService,
    server,
    mobService,
    itemService,
    new FightBuilder(eventService, mobService.locationService))
  eventConsumerTable.forEach(eventConsumer => eventService.addConsumer(eventConsumer))
  await server.start()
  console.timeEnd(Timings.openPort)
  console.timeEnd(Timings.init)
})

async function getAllRoomsAndMobs() {
  return Promise.all([
    newRoomTable(),
    new MobTable(await (await getMobRepository()).findAll()),
    newExitTable(locationService),
  ])
}

async function getAllItems(): Promise<ItemTable> {
  return new ItemTable(await (await getItemRepository()).findAll())
}
