import { newShield } from "../../item/factory"
import { createRequestArgs, Request } from "../../request/request"
import { getTestPlayer } from "../../test/player"
import { RequestType } from "../../request/requestType"
import inventory from "./inventory"

describe("inventory action handler", () => {
  it("should return a mob's inventory", async () => {
    const player = getTestPlayer()
    const inv = player.sessionMob.inventory
    const item1 = newShield("a wooden shield", "")
    const item2 = newShield("a metal shield", "")
    inv.addItem(item1)
    inv.addItem(item2)
    const response = await inventory(new Request(player, RequestType.Inventory, createRequestArgs("inventory")))
    expect(response.inventory.items).toContain(item1)
    expect(response.inventory.items).toContain(item2)
  })
})
