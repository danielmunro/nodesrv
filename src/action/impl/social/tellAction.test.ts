import {RequestType} from "../../../request/requestType"
import TestBuilder from "../../../support/test/testBuilder"

describe("tell social action", () => {
  it("should be to handle telling", async () => {
    // setup
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer()
    const mob = testBuilder.withMob().mob
    const action = await testBuilder.getAction(RequestType.Tell)
    const request = testBuilder.createRequest(RequestType.Tell, `tell '${mob.name}' hello world`)

    // when
    const response = await action.handle(request)

    // then
    expect(response.message.getMessageToRequestCreator()).toEqual(`You tell ${mob.name}, \"hello world\"`)
  })
})
