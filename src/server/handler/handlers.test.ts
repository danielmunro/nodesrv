import { Item } from "../../item/model/item"
import { getTestPlayer } from "../../test/player"
import { Request } from "../request/request"
import { RequestType } from "./constants"
import { HandlerDefinition } from "./handlerDefinition"
import { doWithItemOrElse, handlers } from "./handlers"

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
  it("should do with item or else", () => {
    const doNotUseCallback = jest.fn()
    doWithItemOrElse(
      null,
      doNotUseCallback,
      "")
    expect(doNotUseCallback).not.toBeCalled()
    const useCallback = jest.fn()
    doWithItemOrElse(
      new Item(),
      useCallback,
      "")
    expect(useCallback).toBeCalled()
  })
})
