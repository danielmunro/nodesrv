import { RequestType } from "./constants"
import { RequestTypeMismatch } from "./exceptions"
import { HandlerDefinition } from "./handlerDefinition"
import { Request } from "../request/request"
import { Player } from "../../player/player"
import { getTestPlayer } from "./../../test/common"

function getNewHandlerDefinition(requestType = RequestType.Noop): HandlerDefinition {
  return new HandlerDefinition(requestType, (request, callback) => callback())
}

describe("HandlerDefinition", () => {
  it("isAbleToHandleRequestType should only handle its own request type", () => {
    const def = getNewHandlerDefinition(RequestType.Noop)
    expect(def.isAbleToHandleRequestType(RequestType.Gossip)).toBe(false)
    expect(def.isAbleToHandleRequestType(RequestType.Noop)).toBe(true)
  })

  it("applyCallback should fail on different request types", () => {
    expect(() => {
      getNewHandlerDefinition(RequestType.Noop).handle(new Request(getTestPlayer(), RequestType.Gossip, []))
    }).toThrowError()
  })

  it("applyCallback should succeed on matching request types", () => {
    const callback = jest.fn()
    getNewHandlerDefinition(RequestType.Noop)
      .handle(new Request(getTestPlayer(), RequestType.Noop, []))
      .then(callback)
      .then(() => expect(callback).toBeCalled())
  })

  it("'Any' handler can handle different types of requests", () => {
    const handler = getNewHandlerDefinition(RequestType.Any)
    const testCases = [RequestType.Noop, RequestType.Look, RequestType.Gossip]
    testCases.forEach((requestType) => {
      const callback = jest.fn()
      handler
        .handle(new Request(getTestPlayer(), requestType, []))
        .then(callback)
        .then(() => expect(callback).toBeCalled())
    })
  })
})