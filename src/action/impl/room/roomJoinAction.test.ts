import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../request/enum/requestType"
import {Direction} from "../../../room/enum/direction"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner
const groupName = "A terrific test group"

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  testRunner.getStartRoom().setGroup(groupName)
})

describe("room join action", () => {
  it("can join with another room", async () => {
    // given
    const room = testRunner.createRoom(Direction.North)

    // when
    const response = await testRunner.invokeAction(RequestType.RoomJoin, "room join north")

    // then
    expect(response.getMessageToRequestCreator()).toBe(`Test room 1 group is updated to '${groupName}'`)
    expect(room.getGroup()).toBe(groupName)
  })

  it("requires a valid destination room", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.RoomJoin, "room join south")

    // then
    expect(response.getMessageToRequestCreator()).toBe("a room does not exist in that direction")
  })

  it("requires a valid direction", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.RoomJoin, "room join floodle")

    // then
    expect(response.getMessageToRequestCreator()).toBe("that is not a valid direction")
  })
})
