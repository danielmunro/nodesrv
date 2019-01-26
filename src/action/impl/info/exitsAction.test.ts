import {RequestType} from "../../../request/requestType"
import {Direction} from "../../../room/constants"
import TestBuilder from "../../../test/testBuilder"

describe("exits action", () => {
  it("should describe room exits", async () => {
    // setup
    const  testBuilder = new TestBuilder()
    const action = await testBuilder.getActionDefinition(RequestType.Exits)
    testBuilder.withRoom()
    testBuilder.withRoom(Direction.South)
    testBuilder.withRoom(Direction.Up)
    testBuilder.withRoom(Direction.East)

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Exits))

    // then
    const message = response.message.getMessageToRequestCreator()
    expect(message).toBe("Your exits: south, up, east")
  })
})
