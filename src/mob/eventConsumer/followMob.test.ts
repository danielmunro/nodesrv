import {createTestAppContainer} from "../../app/factory/testFactory"
import {RequestType} from "../../request/enum/requestType"
import {Direction} from "../../room/enum/direction"
import RoomTable from "../../room/table/roomTable"
import RoomBuilder from "../../support/test/roomBuilder"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import {Mob} from "../model/mob"
import LocationService from "../service/locationService"

let testRunner: TestRunner
let locationService: LocationService
let mob1: Mob
let mob2: Mob
let room1: RoomBuilder
let room2: RoomBuilder

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  room1 = testRunner.createRoomOffOf(testRunner.getStartRoom(), Direction.South)
  room2 = testRunner.createRoomOffOf(room1, Direction.South)
  const roomTable = app.get<RoomTable>(Types.RoomTable)
  roomTable.add(room1.get())
  roomTable.add(room2.get())
  mob1 = testRunner.createMob().get()
  mob2 = testRunner.createMob().get()
  locationService = app.get<LocationService>(Types.LocationService)
})

describe("follow mob event consumer", () => {
  it("follows a mob to a new room", async () => {
    // given
    mob2.follows = mob1

    // when
    await testRunner.invokeAction(RequestType.South)

    // then
    expect(locationService.getLocationForMob(mob1).room).toBe(room1.get())
    expect(locationService.getLocationForMob(mob2).room).toBe(room1.get())
  })

  it("does not follow a mob if not following", async () => {
    // when
    await testRunner.invokeAction(RequestType.South)

    // then
    expect(locationService.getLocationForMob(mob1).room).toBe(room1.get())
    expect(locationService.getLocationForMob(mob2).room).toBe(testRunner.getStartRoom().get())
  })

  it("should not follow a mob if not in the same room", async () => {
    // setup
    await locationService.moveMob(mob1, Direction.South)

    // given
    mob2.follows = mob1

    // when
    await locationService.moveMob(mob1, Direction.South)

    // then
    expect(locationService.getLocationForMob(mob2).room).toBe(testRunner.getStartRoom().get())
  })
})
