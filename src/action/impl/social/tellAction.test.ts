import {RequestType} from "../../../request/requestType"
import TestBuilder from "../../../test/testBuilder"

describe("tell social action", () => {
  it("should be to handle telling", async () => {
    // setup
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer()
    const mob = testBuilder.withMob("foo").mob
    const action = await testBuilder.getActionDefinition(RequestType.Tell)
    const request = testBuilder.createRequest(RequestType.Tell, "tell foo hello world")

    // when
    const response = await action.handle(request)

    // then
    expect(response.message.getMessageToRequestCreator()).toEqual(`You tell ${mob.name}, \"hello world\"`)
  })
})
