import { newShield } from "../../item/factory"
import { createRequestArgs, Request } from "../../server/request/request"
import { getTestPlayer } from "../../test/player"
import { RequestType } from "../constants"
import drop from "./drop"

describe("drop", () => {
  it("should be able to drop an item", () => {
    const player = getTestPlayer()
    const item = newShield("a test shield", "a test fixture")
    player.getInventory().addItem(newShield("a test shield", "a test fixture"))
    expect(player.sessionMob.inventory.items).toHaveLength(1)
    expect(player.sessionMob.room.inventory.items).toHaveLength(0)

    expect.assertions(6)
    return drop(new Request(player, RequestType.Drop, createRequestArgs("drop shield")))
      .then((response) => {
        const message = response.message
        expect(message).toContain("You drop")
        expect(message).toContain(item.name)
        expect(player.sessionMob.room.inventory.items).toHaveLength(1)
        expect(player.sessionMob.inventory.items).toHaveLength(0)
      })
  })
})
