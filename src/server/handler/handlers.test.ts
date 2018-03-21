import { newShield } from "../../item/factory"
import { Item } from "../../item/model/item"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import { Request } from "../request/request"
import { RequestType } from "./constants"
import { HandlerDefinition } from "./handlerDefinition"
import { ATTACK_MOB, doWithItemOrElse, drop, handlers, kill, MOB_NOT_FOUND } from "./handlers"

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

  it("should not be able to kill a mob that isn't in the same room", () => {
    const player = getTestPlayer()
    const target = getTestMob()

    expect.assertions(1)
    return kill(new Request(player, RequestType.Kill, {request: "kill " + target.name}))
      .then((response) => expect(response.message).toBe(MOB_NOT_FOUND))
  })

  it("should be able to kill a mob in the same room", () => {
    const player = getTestPlayer()
    const target = getTestMob()
    player.moveTo(target.room)

    expect.assertions(1)
    return kill(new Request(player, RequestType.Kill, {request: "kill " + target.name}))
      .then((response) => expect(response.message).toBe(ATTACK_MOB))
  })

  it("should be able to drop an item", () => {
    const player = getTestPlayer()
    const item = newShield("a test shield", "a test fixture")
    player.getInventory().addItem(newShield("a test shield", "a test fixture"))
    expect(player.sessionMob.inventory.items).toHaveLength(1)
    expect(player.sessionMob.room.inventory.items).toHaveLength(0)

    expect.assertions(6)
    return drop(new Request(player, RequestType.Drop, {request: "drop shield"}))
      .then((response) => {
        const message = response.message
        expect(message).toContain("You drop")
        expect(message).toContain(item.name)
        expect(player.sessionMob.room.inventory.items).toHaveLength(1)
        expect(player.sessionMob.inventory.items).toHaveLength(0)
      })
  })
})
