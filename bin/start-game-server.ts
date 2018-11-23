import * as assert from "assert"
import { getConnection, initializeConnection } from "../src/db/connection"
import ItemTable from "../src/item/itemTable"
import { default as ItemReset } from "../src/item/model/itemReset"
import { getItemRepository } from "../src/item/repository/item"
import LocationService from "../src/mob/locationService"
import { default as MobReset } from "../src/mob/model/mobReset"
import { getMobRepository } from "../src/mob/repository/mob"
import Table from "../src/mob/table"
import ExitTable from "../src/room/exitTable"
import { Room } from "../src/room/model/room"
import { getExitRepository } from "../src/room/repository/exit"
import { getRoomRepository } from "../src/room/repository/room"
import { default as RoomTable } from "../src/room/roomTable"
import newServer from "../src/server/factory"
import ResetService from "../src/service/reset/resetService"
import Service from "../src/service/service"

/**
 * Obtain the start room ID and port from arguments passed in
 */
const startRoomID = process.argv[2]
const port = +process.argv[3]

assert.ok(startRoomID, "start room ID is required to be defined")
console.info("0 - entry point", { startRoomID })

async function startServer(
  service: Service, startRoom: Room, resetService: ResetService, aLocationService: LocationService) {
  console.info(`3 - starting up server on port ${port}`)
  return (await newServer(service, port, startRoom, resetService, aLocationService)).start()
}

export async function newMobTable() {
  // const mobRepository = await getMobRepository()
  // const models = await mobRepository.findAll()
  // console.debug(`2 - mob table initialized with ${models.length} mobs`)
  // return new Table(models)
  return new Table([])
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
  const itemRepository = await getItemRepository()
  const models = await itemRepository.findAll()
  console.debug(`2 - item table initialized with ${models.length} items`)
  return new ItemTable(models)
}

async function createDbConnection(): Promise<void> {
  await initializeConnection()
  console.debug("1 - database connection created")
}

async function createResetService(): Promise<ResetService> {
  const connection = await getConnection()
  const mobResetRepository = await connection.getRepository(MobReset)
  const itemResetRepository = await connection.getRepository(ItemReset)

  return new ResetService(
    await mobResetRepository.find(),
    await itemResetRepository.find())
}

const locationService = new LocationService([])
createDbConnection().then(() =>
  Promise.all([
    newRoomTable(),
    newMobTable(),
    newItemTable(),
    newExitTable(locationService),
  ]).then(async ([roomTable, mobTable, itemTable, exitTable]) =>
    startServer(
      await Service.new(locationService, roomTable, mobTable, itemTable, exitTable),
      roomTable.get(startRoomID),
      await createResetService(),
      locationService)))
