import { newShield } from "../../item/factory"
import { createRequestArgs, Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { getTestPlayer } from "../../test/player"
import inventory from "./inventory"

describe("inventory action handler", () => {
  it("should return a mob's inventory", async () => {
    // given
    const player = getTestPlayer()
    const inv = player.sessionMob.inventory
    const item1 = newShield("a wooden shield", "")
    const item2 = newShield("a metal shield", "")
    inv.addItem(item1)
    inv.addItem(item2)

    // when
    const response = await inventory(new Request(player, RequestType.Inventory, createRequestArgs("inventory")))

    // then
    expect(response.message).toContain(item1.name)
    expect(response.message).toContain(item2.name)
  })
})
