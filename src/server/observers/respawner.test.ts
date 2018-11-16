import { Disposition } from "../../mob/disposition"
import { newMobLocation, newMobReset } from "../../mob/factory"
import LocationService from "../../mob/locationService"
import { default as MobTable } from "../../mob/table"
import ResetService from "../../service/reset/resetService"
import { getTestMob } from "../../test/mob"
import { getTestRoom } from "../../test/room"
import Respawner from "./respawner"

describe("respawner", () => {
  it("should reset dispositions for dead mobs", async () => {
    // setup
    const startRoom = getTestRoom()
    const currentRoom = getTestRoom()

    // dead
    const mob1 = getTestMob()
    mob1.disposition = Disposition.Dead
    mob1.reset.disposition = Disposition.Standing
    mob1.reset.room = startRoom

    // dead
    const mob2 = getTestMob()
    mob2.disposition = Disposition.Dead
    mob2.reset.disposition = Disposition.Sitting
    mob2.reset.room = startRoom

    // not dead
    const mob3 = getTestMob()
    mob3.disposition = Disposition.Sitting
    mob3.reset.disposition = Disposition.Standing
    mob3.reset.room = startRoom

    // given
    const locationService = new LocationService([
      newMobLocation(mob1, currentRoom),
      newMobLocation(mob2, currentRoom),
      newMobLocation(mob3, currentRoom),
    ])
    const respawner = new Respawner(
      new MobTable([mob1, mob2, mob3]),
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
    expect(locationService.getLocationForMob(mob3).room).not.toBe(startRoom)
  })
})
