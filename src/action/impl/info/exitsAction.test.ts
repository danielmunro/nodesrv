import {createTestAppContainer} from "../../../inversify.config"
import {RequestType} from "../../../request/requestType"
import {Direction} from "../../../room/constants"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

describe("exits action", () => {
  it("should describe room exits", async () => {
    // setup
    const  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
    testRunner.createMob()
    const room = testRunner.getStartRoom()

    // given
    testRunner.createRoomOffOf(room, Direction.West)
    testRunner.createRoomOffOf(room, Direction.South)
    testRunner.createRoomOffOf(room, Direction.East)

    // when
    const response = await testRunner.invokeAction(RequestType.Exits)

    // then
    expect(response.getMessageToRequestCreator()).toBe("Your exits: west, south, east")
  })
})
