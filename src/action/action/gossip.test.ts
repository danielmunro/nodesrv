import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"

it("should be to handle gossiping", async () => {
  // setup
  const testBuilder = new TestBuilder()
  await testBuilder.withPlayer()
  const actions = await testBuilder.getActionCollection()
  const request = testBuilder.createRequest(RequestType.Gossip, "gossip hello world")
  const handler = actions.getMatchingHandlerDefinitionForRequestType(request.getType())

  // when
  const response = await handler.handle(request)

  // then
  expect(response.message.getMessageToRequestCreator()).toEqual("You gossip, 'hello world'")
})
