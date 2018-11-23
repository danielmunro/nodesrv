import { Disposition } from "../../mob/disposition"
import { newMobLocation, newMobReset } from "../../mob/factory"
import LocationService from "../../mob/locationService"
import { default as MobTable } from "../../mob/table"
import RoomTable from "../../room/roomTable"
import ResetService from "../../service/reset/resetService"
import { getTestMob } from "../../test/mob"
import { getTestRoom } from "../../test/room"
import Respawner from "./respawner"
import { getMobRepository } from "../../mob/repository/mob"

describe("respawner", () => {
  it("should reset dispositions for dead mobs", async () => {
    // setup
    const startRoom = getTestRoom()
    const currentRoom = getTestRoom()

    // dead
    const mob1 = getTestMob()
    mob1.disposition = Disposition.Dead

    // dead
    const mob2 = getTestMob()
    mob2.disposition = Disposition.Dead

    // not dead
    const mob3 = getTestMob()
    mob3.disposition = Disposition.Sitting

    // given
    const locationService = new LocationService([
      newMobLocation(mob1, currentRoom),
      newMobLocation(mob2, currentRoom),
      newMobLocation(mob3, currentRoom),
    ])
    const respawner = new Respawner(
      await getMobRepository(),
      new MobTable([mob1, mob2, mob3]),
      RoomTable.new([currentRoom, startRoom]),
      new ResetService([
        newMobReset(mob1, startRoom),
        newMobReset(mob2, startRoom),
        newMobReset(mob3, startRoom),
      ], []),
      locationService)

    // when
    await respawner.notify([])

    // then
    expect(mob1.disposition).toBe(Disposition.Standing)
    expect(locationService.getLocationForMob(mob1).room).toBe(startRoom)
    expect(mob2.disposition).toBe(Disposition.Sitting)
    expect(locationService.getLocationForMob(mob2).room).toBe(startRoom)
    expect(mob3.disposition).toBe(Disposition.Sitting)
    expect(locationService.getLocationForMob(mob3).room).toBe(startRoom)
  })
})
