import RequestBuilder from "../../request/requestBuilder"
import { RequestType } from "../../request/requestType"
import { getTestPlayer } from "../../test/player"
import TestBuilder from "../../test/testBuilder"
import { Definition } from "../definition/definition"

it("should be to handle gossiping", async () => {
  // setup
  const testBuilder = new TestBuilder()
  const actions = await testBuilder.getActionCollection()
  const player = getTestPlayer()
  const requestBuilder = new RequestBuilder(player)
  const request = requestBuilder.create(RequestType.Gossip, "gossip hello world")
  const handler = actions.getMatchingHandlerDefinitionForRequestType(
    request.requestType,
    new Definition(await testBuilder.getService(), RequestType.Noop, jest.fn()))

  // when
  const response = await handler.handle(request)

  // then
  expect(response.message).toEqual("You gossip, 'hello world'")
})
