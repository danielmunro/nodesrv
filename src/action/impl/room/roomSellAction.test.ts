import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner
const input = "room sell 10"

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("room sell action", () => {
  it("can list a room that is owned", async () => {
    // setup
    const mob = (await testRunner.createMob()).get()
    const room = testRunner.getStartRoom().get()

    // given
    room.isOwnable = true
    room.owner = mob

    // when
    const response = await testRunner.invokeAction(RequestType.RoomSell, input)

    // then
    expect(response.getMessageToRequestCreator()).toBe("You have successfully listed Test room 1 for 10 gold.")
  })

  it("cannot list a room that is owned by someone else", async () => {
    // setup
    (await testRunner.createMob()).get()
    const owner = (await testRunner.createMob()).get()
    const room = testRunner.getStartRoom().get()

    // given
    room.isOwnable = true
    room.owner = owner

    // when
    const response = await testRunner.invokeAction(RequestType.RoomSell, input)

    // then
    expect(response.getMessageToRequestCreator()).toBe("You do not own this room.")
  })

  it("cannot list a room that is not ownable", async () => {
    // setup
    (await testRunner.createMob()).get()
    const room = testRunner.getStartRoom().get()

    // given
    room.isOwnable = false

    // when
    const response = await testRunner.invokeAction(RequestType.RoomSell, input)

    // then
    expect(response.getMessageToRequestCreator()).toBe("The room is not owned.")
  })
})
