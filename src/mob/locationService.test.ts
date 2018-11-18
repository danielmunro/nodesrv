import { getTestMob } from "../test/mob"
import { getTestRoom } from "../test/room"
import { newMobLocation } from "./factory"
import LocationService from "./locationService"

describe("location service", () => {
  it("should not add a mob twice, an update should occur", () => {
    // setup
    const locationService = new LocationService([])
    const mob = getTestMob()
    const room1 = getTestRoom()
    const room2 = getTestRoom()

    // when
    locationService.addMobLocation(newMobLocation(mob, room1))
    locationService.addMobLocation(newMobLocation(mob, room2))

    // then
    expect(locationService.getLocationForMob(mob).room).toBe(room2)
    expect(locationService.getMobLocationCount()).toBe(1)
  })

  it("sanity checks", () => {
    // setup
    const mob1 = getTestMob()
    const room1 = getTestRoom()
    const mob2 = getTestMob()
    const room2 = getTestRoom()

    // when
    const locationService = new LocationService([
      newMobLocation(mob1, room1),
      newMobLocation(mob2, room2),
    ])

    // then
    expect(locationService.getLocationForMob(mob1).room).toBe(room1)
    expect(locationService.getLocationForMob(mob2).room).toBe(room2)

    // and
    expect(locationService.getMobsByRoom(room1)).toContain(mob1)
    expect(locationService.getMobsByRoom(room2)).toContain(mob2)
  })
})
