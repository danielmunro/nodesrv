import { Request } from "./request"
import { Player } from "../../player/player"
import { RequestType } from "./../handler/constants"
import { HandlerDefinition } from "./../handler/handlerDefinition"
import { handlers } from "./../handler/index"

function getRequest(handler: RequestType): Request {
  return new Request(
    new Player(),
    handler
  )
}

describe("request handlers", () => {
  it("basic failure mode where no handler matches the request", () => {
    getRequest(RequestType.Noop).applyHandlerDefinitionsToRequest(
      [],
      (result) => {
        fail("successfully applied a handler to a request without handlers")
      },
      () => {}
    )
  })
  it("happy path for the gossip request handler", () => {
    getRequest(RequestType.Social).applyHandlerDefinitionsToRequest(
      handlers,
      (result) => {
        expect(result).toEqual({ acknowledged: true })
      },
      () => fail("was not able to invoke the noop handler")
    )
  })
})

