import {AffectType} from "../affect/affectType"
import {createTestAppContainer} from "../inversify.config"
import LocationService from "../mob/locationService"
import {RequestType} from "../request/requestType"
import {Direction} from "../room/constants"
import Door from "../room/model/door"
import MobBuilder from "../support/test/mobBuilder"
import RoomBuilder from "../support/test/roomBuilder"
import TestRunner from "../support/test/testRunner"
import {Types} from "../support/types"
import {ConditionMessages, MESSAGE_DIRECTION_DOES_NOT_EXIST, MESSAGE_OUT_OF_MOVEMENT} from "./constants"

let testRunner: TestRunner
let mobBuilder: MobBuilder
let destination: RoomBuilder
let locationService: LocationService

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  locationService = app.get<LocationService>(Types.LocationService)
  mobBuilder = testRunner.createMob()
  destination = testRunner.createRoom(Direction.East)
})

describe("move", () => {
  it("allows movement where rooms connect", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.East)

    // then
    expect(response.isSuccessful()).toBeTruthy()
    expect(locationService.getRoomForMob(mobBuilder.mob)).toBe(destination.room)
  })

  it("does not cost movement if flying", async () => {
    // given
    mobBuilder.addAffectType(AffectType.Fly)

    // when
    await testRunner.invokeAction(RequestType.East)

    // then
    const attr = mobBuilder.mob.attribute()
    expect(attr.getMv()).toBe(attr.getMaxMv())
  })

  it("cannot move if immobilized", async () => {
    // given
    mobBuilder.addAffectType(AffectType.Immobilize)

    // when
    const response = await testRunner.invokeAction(RequestType.East)

    // then
    expect(response.isError()).toBeTruthy()
    expect(locationService.getRoomForMob(mobBuilder.mob)).toBe(testRunner.getStartRoom().get())
  })

  it("does not allow movement when an exit has a closed door", async () => {
    // given
    const door = new Door()
    door.isClosed = true
    testRunner.getStartRoom().addDoor(door)

    // when
    const response = await testRunner.invokeAction(RequestType.East)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Move.Fail.DoorIsClosed)
  })

  it("does not allow movement where an exit does not exist", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.North)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(MESSAGE_DIRECTION_DOES_NOT_EXIST)
  })

  it("does not allow movement when movement points are depleted", async () => {
    // given
    mobBuilder.setMv(0)

    // when
    const response = await testRunner.invokeAction(RequestType.East)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(MESSAGE_OUT_OF_MOVEMENT)
  })
})
