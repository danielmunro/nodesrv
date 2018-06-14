import { newShield } from "../../item/factory"
import { createRequestArgs, Request } from "../../request/request"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import { RequestType } from "../../request/requestType"
import { MESSAGE_ITEM_NOT_FOUND } from "./constants"
import get from "./get"

describe("get action handler", () => {
  it("should be able to get an item from a room inventory", async () => {
    // setup
    const room = getTestRoom()
    const itemName = "a wooden shield"
    const item = newShield(itemName, "test")
    room.inventory.addItem(item)
    const player = getTestPlayer()
    room.addMob(player.sessionMob)
    const mobInv = player.sessionMob.inventory

    // expect
    expect(mobInv.items.length).toBe(0)

    // when
    const response = await get(new Request(player, RequestType.Get, createRequestArgs("get shield")))

    // then
    expect(mobInv.items.length).toBe(1)
    expect(response.message).toContain(itemName)
  })

  it("should not be able to get an item that is not there", async () => {
    // setup
    const room = getTestRoom()
    const player = getTestPlayer()
    const item = newShield("a wooden shield", "test")
    room.inventory.addItem(item)
    room.addMob(player.sessionMob)

    // when
    const response = await get(new Request(player, RequestType.Get, createRequestArgs("get foo")))

    // then
    expect(player.sessionMob.inventory.items.length).toBe(0)
    expect(response.message).toBe(MESSAGE_ITEM_NOT_FOUND)
  })
})
