import { Equipment } from "../../item/equipment"
import { Item } from "../../item/model/item"
import { Player } from "../../player/model/player"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import { getTestPlayer } from "../../test/player"
import remove from "./remove"

function getTestShield(): Item {
  const item = new Item()
  item.equipment = Equipment.Shield
  item.name = "a test shield"

  return item
}

function useRemoveRequest(player: Player, input: string) {
  return remove(new Request(player, RequestType.Remove, input))
}

describe("remove", () => {
  it("can remove an equipped item", async () => {
    // given
    const player = getTestPlayer()
    player.sessionMob.equipped.inventory.addItem(getTestShield())

    // when
    const response = await useRemoveRequest(player, "remove shield")

    // then
    expect(response.status).toBe(ResponseStatus.Info)
    expect(response.message).toContain("You remove")
  })
})
