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

/**
 * Obtain the start room ID and port from arguments passed in
 */
const startRoomID = process.argv[2]
const port = +process.argv[3]

assert.ok(startRoomID, "start room ID is required to be defined")
console.info("0 - entry point", { startRoomID })

async function startServer(
  service: GameService, startRoom: Room, resetService: ResetService, mobService: MobService) {
  console.info(`3 - starting up server on port ${port}`)
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
  console.log(`2 - exit table initialized with ${models.length} exits`)

  return new ExitTable(service, models)
}

async function createDbConnection(): Promise<void> {
  await initializeConnection()
  console.debug("1 - database connection created")
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

const locationService = new LocationService([])
createDbConnection().then(async () => {
  const roomTable = await newRoomTable()
  console.debug(`2 - room table initialized with ${roomTable.count()} rooms`)
  const mobService = await createMobService(new MobTable(), locationService)
  const itemService = await new ItemService(await getItemRepository(), new ItemTable())
  const resetService = await createResetService(mobService, roomTable, itemService)
  console.log("3 - seeding world")
  await resetService.seedMobTable()
  await resetService.seedItemRoomResets()
  console.log(`4 - creating server on port ${port}`)
  await startServer(
    await GameService.new(mobService, itemService, roomTable, await newExitTable(locationService)),
    roomTable.get(startRoomID),
    resetService,
    mobService)
})

async function createMobService(mobTable: MobTable, aLocationService: LocationService) {
  return new MobService(mobTable, await getMobRepository(), new FightTable(), aLocationService)
}
