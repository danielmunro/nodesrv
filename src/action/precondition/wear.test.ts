import { CheckStatus } from "../../check/checkStatus"
import { Equipment } from "../../item/equipment"
import { newEquipment } from "../../item/factory"
import { Item } from "../../item/model/item"
import { allDispositions, Disposition } from "../../mob/disposition"
import { Player } from "../../player/model/player"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { getTestPlayer } from "../../test/player"
import TestBuilder from "../../test/testBuilder"
import { Messages } from "./constants"
import wear from "./wear"

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
    expect(check.result).toBe(Messages.All.Item.NotOwned)
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

  it("can't equip if not standing", () => {
    allDispositions.forEach(async disposition => {
      const testBuilder = new TestBuilder()
      const playerBuilder = await testBuilder.withPlayer()
      playerBuilder.withAxeEq()
      const player = playerBuilder.player
      player.sessionMob.disposition = disposition
      const check = await useWearRequest("wear axe", player)
      expect(check.status).toBe(disposition === Disposition.Standing ? CheckStatus.Ok : CheckStatus.Failed)
    })
  })
})
