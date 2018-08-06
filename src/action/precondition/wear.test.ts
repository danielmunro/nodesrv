import { Equipment } from "../../item/equipment"
import { newEquipment } from "../../item/factory"
import { Item } from "../../item/model/item"
import { Player } from "../../player/model/player"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { getTestPlayer } from "../../test/player"
import { CheckStatus } from "../check"
import wear, { MESSAGE_FAIL_NO_ITEM_FOUND } from "./wear"

function getHatOfMight(): Item {
  return newEquipment("the hat of might", "a mighty hat", Equipment.Head)
}

function useWearRequest(input: string, player: Player = getTestPlayer()) {
  return wear(new Request(player, RequestType.Wear, input))
}

describe("wear", () => {
  it("should not work if an item is not found", async () => {
    // when
    const check = await useWearRequest("wear foo")

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_NO_ITEM_FOUND)
  })

  it("can equip an item", async () => {
    // given
    const player = getTestPlayer()
    const item = getHatOfMight()
    player.sessionMob.inventory.addItem(item)

    // when
    const check = await useWearRequest("wear hat", player)

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result).toBe(item)
  })
})
