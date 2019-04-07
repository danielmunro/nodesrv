import EventService from "../../event/eventService"
import ResetService from "../../gameService/resetService"
import { Disposition } from "../../mob/enum/disposition"
import { newMobReset } from "../../mob/factory"
import FightTable from "../../mob/fight/fightTable"
import LocationService from "../../mob/locationService"
import MobService from "../../mob/mobService"
import { default as MobTable } from "../../mob/mobTable"
import { getMobRepository } from "../../mob/repository/mob"
import ExitTable from "../../room/exitTable"
import RoomTable from "../../room/roomTable"
import {getConnection, initializeConnection} from "../../support/db/connection"
import { getTestMob } from "../../support/test/mob"
import { getTestRoom } from "../../support/test/room"
import Respawner from "./respawner"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

describe("respawner", () => {
  it("should reset dispositions for dead mobs", async () => {
    // setup
    const startRoom = getTestRoom()
    const currentRoom = getTestRoom()

    // dead
    const mob1 = getTestMob()

    // dead
    const mob2 = getTestMob()

    // not dead
    const mob3 = getTestMob()

    const mobRepository = await getMobRepository()
    await mobRepository.save([mob1, mob2, mob3])

    // given
    const roomTable = RoomTable.new([currentRoom, startRoom])
    const eventService = new EventService()
    const locationService = new LocationService(roomTable, eventService, new ExitTable())
    const mobTable = new MobTable()
    const mobService = new MobService(
      mobTable,
      new MobTable([mob1, mob2, mob3]),
      new FightTable(),
      locationService)
    const respawner = new Respawner(
      new ResetService([
        newMobReset(mob1, startRoom, 1, 1),
        newMobReset(mob2, startRoom, 1, 1),
        newMobReset(mob3, startRoom, 1, 1),
      ], [], [], [], [], mobService, roomTable, null))
    await respawner.seedMobTable()
    mobTable.getMobs().forEach(async mob => {
      mob.disposition = Disposition.Dead
      await mobService.locationService.updateMobLocation(mob, currentRoom)
    })

    // when
    await respawner.notify()

    const mobs = mobService.mobTable.getMobs()
    expect(mobs.every(mob =>
      mob.disposition === Disposition.Standing && locationService.getLocationForMob(mob).room === startRoom))
  })
})
