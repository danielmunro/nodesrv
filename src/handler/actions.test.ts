import { Item } from "../item/model/item"
import { createRequestArgs, Request } from "../server/request/request"
import { getTestPlayer } from "../test/player"
import { actions, doWithItemOrElse } from "./actions"
import { RequestType } from "./constants"
import { HandlerDefinition } from "./handlerDefinition"

describe("handlers", () => {
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

  it("should recognize all directions as valid actions", async () => {
    const defaultHandler = new HandlerDefinition(
      RequestType.Any,
      () => new Promise((resolve) => resolve(defaultHandler)))
    const handleRepeater = (requestType: RequestType, args: string) =>
      actions.getMatchingHandlerDefinitionForRequestType(requestType, defaultHandler)
        .handle(new Request(getTestPlayer(), requestType, createRequestArgs(args)))

    expect(await handleRepeater(RequestType.Noop, "")).toBe(defaultHandler)
    expect(await handleRepeater(RequestType.North, "north")).not.toBe(defaultHandler)
    expect(await handleRepeater(RequestType.South, "south")).not.toBe(defaultHandler)
    expect(await handleRepeater(RequestType.East, "east")).not.toBe(defaultHandler)
    expect(await handleRepeater(RequestType.West, "west")).not.toBe(defaultHandler)
    expect(await handleRepeater(RequestType.Up, "up")).not.toBe(defaultHandler)
    expect(await handleRepeater(RequestType.Down, "down")).not.toBe(defaultHandler)
  })
})
