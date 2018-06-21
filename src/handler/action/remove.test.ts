import { Equipment } from "../../item/equipment"
import { Item } from "../../item/model/item"
import { Player } from "../../player/model/player"
import { createRequestArgs, Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { getTestPlayer } from "../../test/player"
import remove, { MESSAGE_FAIL } from "./remove"
import { ResponseStatus } from "../../request/responseStatus"

function getTestShield(): Item {
  const item = new Item()
  item.equipment = Equipment.Shield
  item.name = "a test shield"

  return item
}

function useRemoveRequest(player: Player, input: string) {
  return remove(new Request(player, RequestType.Remove, createRequestArgs(input)))
}

describe("remove", () => {
  it("should not work if an item is not equipped", async () => {
    // when
    const response = await useRemoveRequest(getTestPlayer(), "remove foo")

    // then
    // expect(response.status).toBe(ResponseStatus.ActionFailed)
    expect(response.message).toBe(MESSAGE_FAIL)
  })

  it("can remove an equipped item", async () => {
    // given
    const player = getTestPlayer()
    player.sessionMob.equipped.inventory.addItem(getTestShield())

    // when
    const response = await useRemoveRequest(player, "remove shield")

    // then
    expect(response.status).toBe(ResponseStatus.Ok)
    expect(response.message).toContain("You remove")
  })
})
