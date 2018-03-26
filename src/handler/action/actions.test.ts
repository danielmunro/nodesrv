import { newShield } from "../../item/factory"
import { Item } from "../../item/model/item"
import { Request } from "../../server/request/request"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { RequestType } from "./../constants"
import { HandlerDefinition } from "./../handlerDefinition"
import { ATTACK_MOB, doWithItemOrElse, handlers, MOB_NOT_FOUND } from "./actions"
import kill from "./kill"

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
    const useCallback = jest.fn()
    expect.assertions(2)
    return Promise.all([
      doWithItemOrElse(
        null,
        doNotUseCallback,
        ""),
      doWithItemOrElse(
        new Item(),
        useCallback,
        ""),
      ])
    .then(() => {
      expect(doNotUseCallback).not.toBeCalled()
      expect(useCallback).toBeCalled()
    })
  })
})
