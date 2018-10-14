import * as assert from "assert"
import { initializeConnection } from "../src/db/connection"
import ItemTable from "../src/item/itemTable"
import { getItemRepository } from "../src/item/repository/item"
import { getMobRepository } from "../src/mob/repository/mob"
import Table from "../src/mob/table"
import { Room } from "../src/room/model/room"
import { getRoomRepository } from "../src/room/repository/room"
import { default as RoomTable } from "../src/room/table"
import newServer from "../src/server/factory"
import Service from "../src/service/service"

/**
 * Obtain the start room ID and port from arguments passed in
 */
const startRoomID = process.argv[2]
const port = +process.argv[3]

assert.ok(startRoomID, "start room ID is required to be defined")
console.info("0 - entry point", { startRoomID })

async function startServer(service: Service, startRoom: Room) {
  console.info(`3 - starting up server on port ${port}`)
  return newServer(service, port, startRoom).start()
}

export async function newMobTable() {
  const mobRepository = await getMobRepository()
  const models = await mobRepository.findAll()
  console.debug(`2 - mob table initialized with ${models.length} mobs`)
  return new Table(models)
}

async function newRoomTable(): Promise<RoomTable> {
  const roomRepository = await getRoomRepository()
  const models = await roomRepository.findAll()
  console.debug(`2 - room table initialized with ${models.length} rooms`)
  return RoomTable.new(models)
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

createDbConnection().then(() =>
  Promise.all([
    newRoomTable(),
    newMobTable(),
    newItemTable(),
  ]).then(async ([roomTable, mobTable, itemTable]) =>
    startServer(await Service.new(roomTable, mobTable, itemTable), roomTable.get(startRoomID))))
