import {createTestAppContainer} from "../../app/factory/testFactory"
import {RoomEntity} from "../../room/entity/roomEntity"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import { newMobLocation } from "../factory/mobFactory"
import {Mob} from "../model/mob"
import LocationService from "./locationService"

let locationService: LocationService
let mob1: Mob
let mob2: Mob
let room1: RoomEntity
let room2: RoomEntity

beforeEach(async () => {
  const app = await createTestAppContainer()
  const testRunner = app.get<TestRunner>(Types.TestRunner)
  room1 = testRunner.getStartRoom().get()
  room2 = testRunner.createRoom().get()
  mob1 = testRunner.createMob().get()
  mob2 = testRunner.createMob().get()
  locationService = app.get<LocationService>(Types.LocationService)
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
