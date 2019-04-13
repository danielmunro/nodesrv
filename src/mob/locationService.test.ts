import {Room} from "../room/model/room"
import TestBuilder from "../support/test/testBuilder"
import { newMobLocation } from "./factory"
import LocationService from "./locationService"
import {Mob} from "./model/mob"

let locationService: LocationService
let mob1: Mob
let mob2: Mob
let room1: Room
let room2: Room

beforeEach(async () => {
  const testBuilder = new TestBuilder()
  room1 = testBuilder.withRoom().room
  room2 = testBuilder.withRoom().room
  mob1 = testBuilder.withMob().mob
  mob2 = testBuilder.withMob().mob
  locationService = await testBuilder.getLocationService()
})

describe("location gameService", () => {
  it("should not add a mob twice, an update should occur", async () => {
    // when
    locationService.addMobLocation(newMobLocation(mob1, room1))
    await locationService.updateMobLocation(mob1, room2)

    // then
    expect(locationService.getLocationForMob(mob1).room).toBe(room2)
    expect(locationService.getMobLocationCount()).toBe(3)
  })

  it("sanity checks", () => {
    // expect
    const location1 = locationService.getLocationForMob(mob1)
    expect(location1.room).toBe(room1)
    const location2 = locationService.getLocationForMob(mob2)
    expect(location2.room).toBe(room1)
    expect(locationService.getMobsByRoom(room1)).toContain(mob1)
    expect(locationService.getMobsByRoom(room2)).toHaveLength(0)
  })
})
