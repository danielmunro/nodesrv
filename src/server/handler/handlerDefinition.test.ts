import { RequestType } from "./constants"
import { RequestTypeMismatch } from "./exceptions"
import { HandlerDefinition } from "./handlerDefinition"
import { Request } from "../request/request"
import { Player } from "../../player/player"

function getNewHandlerDefinition(): HandlerDefinition {
  return new HandlerDefinition(
    RequestType.Noop,
    (request, callback) => {
      callback()
    }
  )
}

describe("HandlerDefinition", () => {
  it("isAbleToHandleRequestType should only handle its own request type", () => {
    const def = getNewHandlerDefinition()

    expect(def.isAbleToHandleRequestType(RequestType.Social)).toBe(false)
    expect(def.isAbleToHandleRequestType(RequestType.Noop)).toBe(true)
  })

  it("applyCallback should fail on different request types", () => {
    const def = getNewHandlerDefinition()

    expect(() => {
      def.applyCallback(
        new Request(new Player(), RequestType.Move, []),
        () => {}
      )
    }).toThrowError()
  })

  it("applyCallback should succeed on matching request types", () => {
    const def = getNewHandlerDefinition()
    const callback = jest.fn()
    def.applyCallback(
      new Request(new Player(), RequestType.Noop, []),
      callback
    )
    expect(callback).toBeCalled()
  })
})