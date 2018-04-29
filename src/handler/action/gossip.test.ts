import { createRequestArgs, Request } from "../../server/request/request"
import { getTestPlayer } from "../../test/player"
import { actions } from "../actions"
import { RequestType } from "../constants"
import { HandlerDefinition } from "../handlerDefinition"

it("should be to handle gossiping", async () => {
  const request = new Request(getTestPlayer(), RequestType.Gossip, createRequestArgs("gossip hello world"))
  const handler = actions.getMatchingHandlerDefinitionForRequestType(
    request.requestType,
    new HandlerDefinition(RequestType.Noop, jest.fn()))
  expect.assertions(1)

  await handler.handle(request)
    .then((response) => {
      expect(response.message).toContain("You gossip, 'hello world'")
    })
})
