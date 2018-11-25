import * as assert from "assert"
import { getConnection, initializeConnection } from "../src/support/db/connection"
import GameService from "../src/gameService/gameService"
import ResetService from "../src/gameService/resetService"
import ItemTable from "../src/item/itemTable"
import { default as ItemReset } from "../src/item/model/itemReset"
import { getItemRepository } from "../src/item/repository/item"
import FightTable from "../src/mob/fight/fightTable"
import LocationService from "../src/mob/locationService"
import MobService from "../src/mob/mobService"
import MobTable from "../src/mob/mobTable"
import { default as MobReset } from "../src/mob/model/mobReset"
import { getMobRepository } from "../src/mob/repository/mob"
import ExitTable from "../src/room/exitTable"
import { Room } from "../src/room/model/room"
import { getExitRepository } from "../src/room/repository/exit"
import { getRoomRepository } from "../src/room/repository/room"
import { default as RoomTable } from "../src/room/roomTable"
import newServer from "../src/server/factory"
import ItemService from "../src/item/itemService"

/**
 * Obtain the start room ID and port from arguments passed in
 */
const startRoomID = process.argv[2]
const port = +process.argv[3]

assert.ok(startRoomID, "start room ID is required to be defined")
console.info("0 - entry point", { startRoomID })

async function startServer(
  service: GameService, startRoom: Room, resetService: ResetService, mobService: MobService) {
  console.info(`4 - starting up server on port ${port}`)
  return (await newServer(service, port, startRoom, resetService, mobService)).start()
}

export async function newMobTable() {
  return new MobTable([])
}

async function newRoomTable(): Promise<RoomTable> {
  const roomRepository = await getRoomRepository()
  const models = await roomRepository.findAll()
  console.debug(`2 - room table initialized with ${models.length} rooms`)
  return RoomTable.new(models)
}

async function newExitTable(service: LocationService): Promise<ExitTable> {
  const exitRepository = await getExitRepository()
  const models = await exitRepository.findAll()
  console.log(`2 - exit table initialized with ${models.length} exits`)

  return new ExitTable(service, models)
}

async function newItemTable(): Promise<ItemTable> {
  return new ItemTable([])
}

async function createDbConnection(): Promise<void> {
  await initializeConnection()
  console.debug("1 - database connection created")
}

async function createResetService(mobService: MobService, roomTable: RoomTable): Promise<ResetService> {
  const connection = await getConnection()
  const mobResetRepository = await connection.getRepository(MobReset)
  const itemResetRepository = await connection.getRepository(ItemReset)

  const resetService = new ResetService(
    await mobResetRepository.find(),
    await itemResetRepository.find(),
    mobService,
    roomTable)

  console.log("2 - seeding world")
  await resetService.seedMobTable()
  await resetService.seedItemTable()

  /*tslint:disable*/
  console.log(`2 - reset service initialized with ${resetService.mobResets.length} mob resets, and ${resetService.itemResets.length} item resets`)

  return resetService
}

async function createItemService(itemTable: ItemTable) {
  return new ItemService(
    await getItemRepository(),
    itemTable)
}

const locationService = new LocationService([])
createDbConnection().then(() =>
  Promise.all([
    newRoomTable(),
    newMobTable(),
    newItemTable(),
    newExitTable(locationService),
  ]).then(async ([roomTable, mobTable, itemTable, exitTable]) => {
    const mobService = await createMobService(mobTable, locationService)
    const resetService = await createResetService(mobService, roomTable)
    await startServer(
      await GameService.new(mobService, roomTable, itemTable, exitTable),
      roomTable.get(startRoomID),
      resetService,
      await createMobService(mobTable, locationService))
  }))
async function createMobService(mobTable: MobTable, aLocationService: LocationService) {
  return new MobService(mobTable, await getMobRepository(), new FightTable(), aLocationService)
}
