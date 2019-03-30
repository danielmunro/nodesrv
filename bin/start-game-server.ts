import * as assert from "assert"
import getActionTable from "../src/action/actionTable"
import createEventConsumerTable from "../src/event/eventConsumerTable"
import EventService from "../src/event/eventService"
import ActionService from "../src/gameService/actionService"
import GameService from "../src/gameService/gameService"
import ResetService from "../src/gameService/resetService"
import TimeService from "../src/gameService/timeService"
import ItemService from "../src/item/itemService"
import ItemTable from "../src/item/itemTable"
import { getItemRepository } from "../src/item/repository/item"
import {getItemContainerResetRepository} from "../src/item/repository/itemContainerReset"
import {getItemMobResetRepository} from "../src/item/repository/itemMobReset"
import {getItemRoomResetRepository} from "../src/item/repository/itemRoomReset"
import {getMobEquipResetRepository} from "../src/item/repository/mobEquipReset"
import { createMobService } from "../src/mob/factory"
import FightBuilder from "../src/mob/fight/fightBuilder"
import LocationService from "../src/mob/locationService"
import MobService from "../src/mob/mobService"
import MobTable from "../src/mob/mobTable"
import { getMobRepository } from "../src/mob/repository/mob"
import {getMobResetRepository} from "../src/mob/repository/mobReset"
import {getPlayerRepository} from "../src/player/repository/player"
import {newExitTable, newRoomTable} from "../src/room/factory"
import {Room} from "../src/room/model/room"
import {default as RoomTable} from "../src/room/roomTable"
import ClientService from "../src/server/clientService"
import newServer from "../src/server/factory"
import AuthService from "../src/session/auth/authService"
import {getSkillTable} from "../src/skill/skillTable"
import getSpellTable from "../src/spell/spellTable"
import { initializeConnection } from "../src/support/db/connection"

const Timings = {
  init: "total game initialization",
  itemService: "item service",
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
let locationService: LocationService
console.log(`startup parameters:  port: ${port}, room: ${startRoomID}`)

initializeConnection().then(async () => {
  const eventService = new EventService()
  console.time(Timings.roomAndMobTables)
  const [ roomTable, mobTable ] = await getAllRoomsAndMobs()
  locationService = new LocationService(roomTable, eventService, await newExitTable())
  const mobService = await createMobService(mobTable, locationService)
  console.timeEnd(Timings.roomAndMobTables)

  console.time(Timings.itemService)
  const itemService = new ItemService(new ItemTable(), await getAllItems())
  console.timeEnd(Timings.itemService)

  console.time(Timings.resetService)
  const resetService = await createResetService(mobService, roomTable, itemService)
  console.timeEnd(Timings.resetService)

  console.time(Timings.seedMobs)
  await resetService.seedMobTable()
  console.timeEnd(Timings.seedMobs)

  console.time(Timings.seedItems)
  await resetService.seedItemRoomResets()
  console.timeEnd(Timings.seedItems)

  console.time(Timings.openPort)
  const timeService = new TimeService()
  const skillTable = getSkillTable(mobService, eventService)
  const spellTable = getSpellTable(mobService, eventService)
  const gameService = new GameService(
    mobService,
    roomTable,
    itemService,
    eventService,
    new ActionService(
      getActionTable(mobService, itemService, timeService, eventService, spellTable),
      skillTable,
      spellTable,
    ),
    timeService)
  const startRoom = roomTable.getRooms().find(room => room.canonicalId === startRoomID) as Room
  const clientService = new ClientService(
    eventService,
    new AuthService(await getPlayerRepository(), mobService),
    mobService.locationService,
    gameService.getActions(),
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
  ])
}

async function getAllItems(): Promise<ItemTable> {
  return new ItemTable(await (await getItemRepository()).findAll())
}

async function createResetService(
  mobService: MobService, roomTable: RoomTable, itemService: ItemService): Promise<ResetService> {
  const mobResetRepository = await getMobResetRepository()
  const itemMobResetRepository = await getItemMobResetRepository()
  const itemRoomResetRepository = await getItemRoomResetRepository()
  const mobEquipResetRepository = await getMobEquipResetRepository()
  const itemContainerResetRepository = await getItemContainerResetRepository()
  const [ mobResets, itemMobResets, itemRoomResets, mobEquipResets, itemContainerResets ] = await Promise.all([
    mobResetRepository.findAll(),
    itemMobResetRepository.findAll(),
    itemRoomResetRepository.findAll(),
    mobEquipResetRepository.findAll(),
    itemContainerResetRepository.findAll(),
  ])

  return new ResetService(
    mobResets,
    itemMobResets,
    itemRoomResets,
    mobEquipResets,
    itemContainerResets,
    mobService,
    roomTable,
    itemService)
}
