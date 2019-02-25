import Action from "../../action/action"
import {RequestType} from "../../request/requestType"
import {Direction} from "../../room/constants"
import {Room} from "../../room/model/room"
import TestBuilder from "../../test/testBuilder"
import LocationService from "../locationService"
import {Mob} from "../model/mob"

let testBuilder: TestBuilder
let locationService: LocationService
let action: Action
let mob1: Mob
let mob2: Mob
let room1: Room
let room2: Room
let room3: Room

beforeEach(async () => {
  testBuilder = new TestBuilder()
  room1 = testBuilder.withRoom().room
  room1.name = "test room 1"
  room2 = testBuilder.addRoomToPreviousRoom(Direction.South).room
  room2.name = "test room 2"
  room3 = testBuilder.addRoomToPreviousRoom(Direction.South).room
  room3.name = "test room 3"
  mob1 = testBuilder.withMob().mob
  mob2 = testBuilder.withMob().mob
  action = await testBuilder.getAction(RequestType.South)
  const service = await testBuilder.getService()
  locationService = service.mobService.locationService
})

describe("follow mob event consumer", () => {
  it("should follow a mob to a new room", async () => {
    // given
    mob2.follows = mob1

    // when
    await action.handle(testBuilder.createRequest(RequestType.South))

    // then
    expect(locationService.getLocationForMob(mob1).room).toBe(room2)
    expect(locationService.getLocationForMob(mob2).room).toBe(room2)
  })

  it("should not follow a mob if not following", async () => {
    // when
    await action.handle(testBuilder.createRequest(RequestType.South))

    // then
    expect(locationService.getLocationForMob(mob1).room).toBe(room2)
    expect(locationService.getLocationForMob(mob2).room).toBe(room1)
  })

  it("should not follow a mob if not in the same room", async () => {
    // setup
    await locationService.moveMob(mob1, Direction.South)
    mob2.follows = mob1

    // when
    await locationService.moveMob(mob1, Direction.South)

    // then
    expect(locationService.getLocationForMob(mob2).room).toBe(room1)
    expect(locationService.getLocationForMob(mob1).room).toBe(room3)
  })
})
