import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import { Request } from "../request/request"
import { RequestType } from "./constants"
import { HandlerDefinition } from "./handlerDefinition"
import { handlers } from "./handlers"

describe("handlers", () => {
  it("should be to handle gossiping", () => {
    const request = new Request(getTestPlayer(), RequestType.Gossip, {request: "gossip hello world"})
    const handler = handlers.getMatchingHandlerDefinitionForRequestType(
      request.requestType,
      new HandlerDefinition(RequestType.Noop, () => {}))
    expect.assertions(1)
    return handler.handle(request)
      .then((response) => {
        expect(response.message).toContain("You gossip, 'hello world'")
      })
  })
})
