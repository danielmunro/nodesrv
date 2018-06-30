import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { MESSAGE_ITEM_NOT_FOUND } from "./constants"
import get from "./get"

describe("get action handler", () => {
  it("should be able to get an item from a room inventory", async () => {
    // setup
    const testBuilder = new TestBuilder()
    testBuilder.withRoom().withTestEquipment()
    const player = testBuilder.withPlayer().player
    const itemCount = player.sessionMob.inventory.items.length

    // when
    const response = await get(testBuilder.createRequest(RequestType.Get, "get cap"))

    // then
    expect(player.sessionMob.inventory.items.length).toBe(itemCount + 1)
    expect(response.message).toContain("cap")
  })

  it("should not be able to get an item that is not there", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player

    // when
    const response = await get(testBuilder.createRequest(RequestType.Get, "get foo"))

    // then
    expect(player.sessionMob.inventory.items.length).toBe(0)
    expect(response.message).toBe(MESSAGE_ITEM_NOT_FOUND)
  })
})
