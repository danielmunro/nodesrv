import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { getTestPlayer } from "../../test/player"
import TestBuilder from "../../test/testBuilder"
import { Definition } from "../definition/definition"

it("should be to handle gossiping", async () => {
  // setup
  const testBuilder = new TestBuilder()
  const actions = await testBuilder.getActionCollection()
  const mob = testBuilder.withMob().mob
  const request = new Request(mob, RequestType.Gossip, "gossip hello world")
  const handler = actions.getMatchingHandlerDefinitionForRequestType(request.requestType)

  // when
  const response = await handler.handle(request)

  // then
  expect(response.message).toEqual("You gossip, 'hello world'")
})
