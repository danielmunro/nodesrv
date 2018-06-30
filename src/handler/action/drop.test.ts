import { newShield } from "../../item/factory"
import { createRequestArgs, Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { getTestPlayer } from "../../test/player"
import Check from "../check"
import CheckedRequest from "../checkedRequest"
import drop from "./drop"

describe("drop", () => {
  it("should be able to drop an item", async () => {
    // given
    const player = getTestPlayer()
    const item = newShield("a test shield", "a test fixture")
    player.sessionMob.inventory.addItem(item)

    // expect
    expect(player.sessionMob.inventory.items).toHaveLength(1)
    expect(player.sessionMob.room.inventory.items).toHaveLength(0)

    // when
    const response = await drop(
      new CheckedRequest(
        new Request(player, RequestType.Drop, createRequestArgs("drop shield")),
        await Check.ok(item)))

    // then
    const message = response.message
    expect(message).toContain("You drop")
    expect(message).toContain(item.name)
    expect(player.sessionMob.room.inventory.items).toHaveLength(1)
    expect(player.sessionMob.inventory.items).toHaveLength(0)
  })
})
