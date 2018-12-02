import * as assert from "assert"
import GameService from "../src/gameService/gameService"
import ResetService from "../src/gameService/resetService"
import ItemService from "../src/item/itemService"
import ItemTable from "../src/item/itemTable"
import { getItemRepository } from "../src/item/repository/item"
import { getItemContainerResetRepository } from "../src/item/repository/itemContainerReset"
import { getItemRoomResetRepository } from "../src/item/repository/itemRoomReset"
import { getMobEquipResetRepository } from "../src/item/repository/mobEquipReset"
import FightTable from "../src/mob/fight/fightTable"
import LocationService from "../src/mob/locationService"
import MobService from "../src/mob/mobService"
import MobTable from "../src/mob/mobTable"
import { getMobRepository } from "../src/mob/repository/mob"
import { getMobResetRepository } from "../src/mob/repository/mobReset"
import ExitTable from "../src/room/exitTable"
import { Room } from "../src/room/model/room"
import { getExitRepository } from "../src/room/repository/exit"
import { getRoomRepository } from "../src/room/repository/room"
import { default as RoomTable } from "../src/room/roomTable"
import newServer from "../src/server/factory"
import { initializeConnection } from "../src/support/db/connection"

const Timings = {
  exitTable: "exit table initialization",
  init: "total game initialization",
  openPort: "open server port",
  resetService: "create reset service initialization",
  roomAndMobTables: "room and mob table initialization",
  seedWorld: "seeding world",
}

/**
 * Obtain the start room ID and port from arguments passed in
 */
const startRoomID = process.argv[2]
const port = +process.argv[3]
console.time(Timings.init)
assert.ok(startRoomID, "start room ID is required to be defined")
const locationService = new LocationService()
console.log(`startup parameters:  port: ${port}, room: ${startRoomID}`)

createDbConnection().then(async () => {
  console.time(Timings.roomAndMobTables)
  const tables = await Promise.all([
    await newRoomTable(),
    await createMobService(new MobTable(), locationService),
  ])
  const roomTable = tables[0]
  const mobService = tables[1]
  console.debug(`room table initialized with ${roomTable.count()} rooms`)
  console.timeEnd(Timings.roomAndMobTables)

  console.time(Timings.resetService)
  const itemService = await new ItemService(await getItemRepository(), new ItemTable())
  const resetService = await createResetService(mobService, roomTable, itemService)
  console.timeEnd(Timings.resetService)

  console.time(Timings.seedWorld)
  const results = await Promise.all([
    newExitTable(locationService),
    resetService.seedMobTable(),
    resetService.seedItemRoomResets()])
  console.timeEnd(Timings.seedWorld)

  console.time(Timings.exitTable)
  const exitTable = results[0]
  console.timeEnd(Timings.exitTable)

  console.time(Timings.openPort)
  const gameService = await GameService.new(mobService, itemService, roomTable, exitTable)
  await startServer(
    gameService,
    roomTable.get(startRoomID),
    resetService,
    mobService)
  console.timeEnd(Timings.openPort)
  console.timeEnd(Timings.init)
})

async function startServer(
  service: GameService, startRoom: Room, resetService: ResetService, mobService: MobService) {
  return (await newServer(service, port, startRoom, resetService, mobService)).start()
}

async function newRoomTable(): Promise<RoomTable> {
  const roomRepository = await getRoomRepository()
  const models = await roomRepository.findAll()
  return RoomTable.new(models)
}

async function newExitTable(service: LocationService): Promise<ExitTable> {
  const exitRepository = await getExitRepository()
  const models = await exitRepository.findAll()
  return new ExitTable(service, models)
}

async function createDbConnection(): Promise<void> {
  await initializeConnection()
}

async function createResetService(
  mobService: MobService, roomTable: RoomTable, itemService: ItemService): Promise<ResetService> {
  const mobResetRepository = await getMobResetRepository()
  const itemRoomResetRepository = await getItemRoomResetRepository()
  const mobEquipResetRepository = await getMobEquipResetRepository()
  const itemContainerResetRepository = await getItemContainerResetRepository()

  return new ResetService(
    await mobResetRepository.findAll(),
    await itemRoomResetRepository.findAll(),
    await mobEquipResetRepository.findAll(),
    await itemContainerResetRepository.findAll(),
    mobService,
    roomTable,
    itemService)
}

async function createMobService(mobTable: MobTable, aLocationService: LocationService) {
  return new MobService(mobTable, await getMobRepository(), new FightTable(), aLocationService)
}
