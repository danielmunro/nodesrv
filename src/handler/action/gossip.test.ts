import { Request } from "../../server/request/request"
import { getTestPlayer } from "../../test/player"
import { RequestType } from "../constants"
import { HandlerDefinition } from "../handlerDefinition"
import { handlers } from "./actions"

it("should be to handle gossiping", () => {
  const request = new Request(getTestPlayer(), RequestType.Gossip, {request: "gossip hello world"})
  const handler = handlers.getMatchingHandlerDefinitionForRequestType(
    request.requestType,
    new HandlerDefinition(RequestType.Noop, jest.fn()))
  expect.assertions(1)
  return handler.handle(request)
    .then((response) => {
      expect(response.message).toContain("You gossip, 'hello world'")
    })
})
