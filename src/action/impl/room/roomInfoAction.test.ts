import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../request/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("room info action", () => {
  it("generates accurate message for public room", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.RoomInfo)

    // then
    expect(response.getMessageToRequestCreator()).toBe("Test room 1 is public. The room is not owned.")
  })

  it("generates accurate message for private rooms", async () => {
    // given
    const room = testRunner.getStartRoom().get()
    room.isOwnable = true

    // when
    const response = await testRunner.invokeAction(RequestType.RoomInfo)

    // then
    expect(response.getMessageToRequestCreator()).toBe("Test room 1 is not public. The room is not owned.")
  })

  it("generates accurate message for private rooms that are owned", async () => {
    // setup
    const mob = await testRunner.createMob()
    const room = testRunner.getStartRoom().get()
    room.isOwnable = true

    // given
    room.owner = mob.get()

    // when
    const response = await testRunner.invokeAction(RequestType.RoomInfo)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`Test room 1 is not public. The room is owned by ${mob.getMobName()}.`)
  })

  it("generates accurate message for public rooms that are owned", async () => {
    // setup
    const mob = await testRunner.createMob()
    const room = testRunner.getStartRoom().get()

    // given
    room.owner = mob.get()

    // when
    const response = await testRunner.invokeAction(RequestType.RoomInfo)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe(`Test room 1 is public. The room is owned by ${mob.getMobName()}.`)
  })
})
