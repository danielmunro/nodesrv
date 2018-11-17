import LocationService from "./locationService"
import { getTestMob } from "../test/mob"
import { getTestRoom } from "../test/room"
import { newMobLocation } from "./factory"

describe("location service", () => {
  it("should not add a mob twice, an update should occur", () => {
    const locationService = new LocationService([])
    const mob = getTestMob()
    const room1 = getTestRoom()
    const room2 = getTestRoom()
    locationService.addMobLocation(newMobLocation(mob, room1))
    locationService.addMobLocation(newMobLocation(mob, room2))
    expect(locationService.getLocationForMob(mob).room).toBe(room2)
    expect(locationService.getMobLocationCount()).toBe(1)
  })
})
