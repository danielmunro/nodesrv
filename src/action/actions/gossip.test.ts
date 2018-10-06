import InputContext from "../../request/context/inputContext"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"

it("should be to handle gossiping", async () => {
  // setup
  const testBuilder = new TestBuilder()
  const actions = await testBuilder.getActionCollection()
  const request = new Request(
    testBuilder.withMob().mob, new InputContext(RequestType.Gossip, "gossip hello world"))
  const handler = actions.getMatchingHandlerDefinitionForRequestType(request.getType())

  // when
  const response = await handler.handle(request)

  // then
  expect(response.message).toEqual("You gossip, 'hello world'")
})
