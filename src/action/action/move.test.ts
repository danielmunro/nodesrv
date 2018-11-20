import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import { Direction } from "../../room/constants"
import TestBuilder from "../../test/testBuilder"
import getActionCollection from "../actionCollection"

describe("move", () => {
  it("should allow movement where rooms connect", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withRoom()
    const destination = testBuilder.withRoom(Direction.East).room
    const mob = (await testBuilder.withPlayer()).player.sessionMob
    const service = await testBuilder.getService()
    const actionCollection = await getActionCollection(service)
    const definition = await actionCollection.getMatchingHandlerDefinitionForRequestType(RequestType.East)

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.East))

    // then
    expect(response.status).toBe(ResponseStatus.Info)
    expect(service.getMobLocation(mob).room).toEqual(destination)
  })
})
