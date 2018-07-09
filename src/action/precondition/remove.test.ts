import { Equipment } from "../../item/equipment"
import { newEquipment } from "../../item/factory"
import { Player } from "../../player/model/player"
import { createRequestArgs, Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { getTestPlayer } from "../../test/player"
import { CheckStatus } from "../check"
import remove, { MESSAGE_REMOVE_FAIL } from "./remove"

function useRemoveRequest(player: Player, input: string) {
  return remove(new Request(player, RequestType.Remove, createRequestArgs(input)))
}

describe("remove", () => {
  it("should not work if an item is not equipped", async () => {
    // when
    const check = await useRemoveRequest(getTestPlayer(), "remove foo")

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_REMOVE_FAIL)
  })

  it("should be successful if the item is equipped", async () => {
    // given
    const player = getTestPlayer()
    const eq = newEquipment("a cowboy hat", "a sturdy cowboy hat", Equipment.Head)
    player.sessionMob.equipped.inventory.addItem(eq)

    // when
    const check = await useRemoveRequest(player, "remove cowboy")

    // then
    expect(check.status).toBe(CheckStatus.Ok)
  })
})
