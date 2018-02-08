import { WebSocket } from "mock-socket"
import { Request } from "./request"
import { Player } from "../../player/player"
import { Client } from "../../client/client"
import { RequestType } from "./constants"
import { HandlerDefinition } from "./handlerDefinition"
import { handlers } from "./index"

function getRequest(handler: RequestType): Request {
  return new Request(
    new Player(new Client(new WebSocket('ws://localhost:1111'))),
    handler
  )
}

test("basic failure mode where there is no handler for the request", () => {
  getRequest(RequestType.Noop).applyHandlerDefinitionsToRequest(
    [],
    (result) => {
      fail("successfully applied a handler to a request without handlers")
    },
    () => {}
  )
})

test("gossip request happy path", () => {
  getRequest(RequestType.Social).applyHandlerDefinitionsToRequest(
    handlers,
    (result) => {
      expect(result).toEqual({ acknowledged: true })
    },
    () => fail("was not able to invoke the noop handler")
  )
})