import EventService from "../../event/service/eventService"
import ResetService from "../../gameService/resetService"
import { Disposition } from "../../mob/enum/disposition"
import FightTable from "../../mob/fight/fightTable"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import { default as MobTable } from "../../mob/table/mobTable"
import ExitTable from "../../room/table/exitTable"
import RoomTable from "../../room/table/roomTable"
import { getTestMob } from "../../support/test/mob"
import { getTestRoom } from "../../support/test/room"
import Respawner from "./respawner"

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

    // given
    const roomTable = RoomTable.new([currentRoom, startRoom])
    const eventService = new EventService()
    const locationService = new LocationService(roomTable, eventService, new ExitTable(), startRoom)
    const mobTable = new MobTable()
    const mobService = new MobService(new MobTable([mob1, mob2, mob3]), locationService, mobTable, new FightTable())
    const respawner = new Respawner(
      new ResetService([], [], [], [], [], mobService, [], null))
    await respawner.seedMobTable()
    mobTable.getMobs().forEach(async mob => {
      mob.disposition = Disposition.Dead
      await mobService.updateMobLocation(mob, currentRoom)
    })

    // when
    await respawner.notify()

    const mobs = mobService.mobTable.getMobs()
    expect(mobs.every(mob =>
      mob.disposition === Disposition.Standing && locationService.getLocationForMob(mob).room === startRoom))
  }, 20000)
})
