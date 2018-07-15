import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import get from "./get"

describe("get actions actions", () => {
  it("should be able to get an item from a room inventory", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const item = testBuilder.withRoom().withTestEquipment()
    const player = testBuilder.withPlayer().player
    const itemCount = player.sessionMob.inventory.items.length

    // when
    const response = await get(testBuilder.createOkCheckedRequest(RequestType.Get, "get cap", item))

    // then
    expect(player.sessionMob.inventory.items.length).toBe(itemCount + 1)
    expect(response.message).toContain("cap")
  })
})
