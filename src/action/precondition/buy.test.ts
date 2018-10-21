import { CheckStatus } from "../../check/checkStatus"
import { Equipment } from "../../item/equipment"
import { newEquipment } from "../../item/factory"
import { Role } from "../../mob/role"
import InputContext from "../../request/context/inputContext"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import TestBuilder from "../../test/testBuilder"
import buy from "./buy"
import { MESSAGE_ERROR_NO_ITEM, Messages } from "./constants"

describe("buy action precondition", () => {
  it("should fail if a merchant is not in the room", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // when
    const check = await buy(
      new Request(testBuilder.withMob().mob, new InputContext(RequestType.Buy, "buy foo")))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(Messages.All.Item.NoMerchant)
  })

  it("should fail if the merchant doesn't have the item requested", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const mobBuilder = testBuilder.withMob()
    const mob = mobBuilder.mob

    // and
    testBuilder.withMob().mob.role = Role.Merchant

    // when
    const check = await buy(new Request(mob, new InputContext(RequestType.Buy, "buy foo")))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_ERROR_NO_ITEM)
  })

  it("should fail if the item is too expensive", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const mobBuilder = testBuilder.withMob()
    const mob = mobBuilder.mob

    // and
    const merchBuilder = testBuilder.withMerchant()
    const item = merchBuilder.withAxeEq()

    // when
    const check = await buy(new Request(mob, new InputContext(RequestType.Buy, `buy ${item.name}`)))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(Messages.Buy.CannotAfford)
  })

  it("should succeed if all conditions are met", async () => {
    // given
    const initialGold = 100
    const itemValue = 10

    // and
    const player = getTestPlayer()
    player.sessionMob.gold = initialGold
    const room = getTestRoom()
    room.addMob(player.sessionMob)

    // and
    const merch = getTestMob()
    merch.role = Role.Merchant
    room.addMob(merch)

    // and
    const eq = newEquipment("a sombrero", "a robust and eye-catching sombrero", Equipment.Head)
    eq.value = itemValue
    merch.inventory.addItem(eq)

    // when
    const check = await buy(new Request(player.sessionMob, new InputContext(RequestType.Buy, "buy sombrero")))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
  })
})
