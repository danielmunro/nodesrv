import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { CheckStatus } from "../../check/checkStatus"
import { Equipment } from "../../item/equipment"
import { newEquipment } from "../../item/factory"
import { Player } from "../../player/model/player"
import InputContext from "../../request/context/inputContext"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { format } from "../../support/string"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import TestBuilder from "../../test/testBuilder"
import { MESSAGE_REMOVE_FAIL, Messages } from "./constants"
import remove from "./remove"

function useRemoveRequest(player: Player, input: string) {
  return remove(new Request(player.sessionMob, getTestRoom(), new InputContext(RequestType.Remove, input)))
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

  it("cannot remove cursed items", async () => {
    // given
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const item = playerBuilder.equip().withMaceEq()
    item.affects.push(newAffect(AffectType.Curse))

    // when
    const check = await remove(testBuilder.createRequest(RequestType.Remove, "remove mace"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(format(Messages.All.Item.CannotRemoveCursedItem, item.toString()))
  })

  it("cannot remove no-remove items", async () => {
    // given
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const item = playerBuilder.equip().withMaceEq()
    item.affects.push(newAffect(AffectType.NoRemove))

    // when
    const check = await remove(testBuilder.createRequest(RequestType.Remove, "remove mace"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(format(Messages.All.Item.NoRemoveItem, item.toString()))
  })
})
