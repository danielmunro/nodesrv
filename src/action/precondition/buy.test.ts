import { CheckStatus } from "../../check/checkStatus"
import { Equipment } from "../../item/equipment"
import { newEquipment } from "../../item/factory"
import { Role } from "../../mob/role"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import buy from "./buy"
import { MESSAGE_ERROR_NO_ITEM, Messages } from "./constants"

describe("buy action preconditions", () => {
  it("should fail if a merchant is not in the room", async () => {
    // setup
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer()
    testBuilder.withRoom()

    // when
    const check = await buy(testBuilder.createRequest(RequestType.Buy, "buy foo"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(Messages.All.Item.NoMerchant)
  })

  it("should fail if the merchant doesn't have the item requested", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    testBuilder.withMob()

    // and
    testBuilder.withMob().mob.role = Role.Merchant

    // when
    const check = await buy(testBuilder.createRequest(RequestType.Buy, "buy foo"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_ERROR_NO_ITEM)
  })

  it("should fail if the item is too expensive", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    testBuilder.withMob()

    // and
    const merchBuilder = testBuilder.withMerchant()
    const item = merchBuilder.withAxeEq()

    // when
    const check = await buy(testBuilder.createRequest(RequestType.Buy, `buy ${item.name}`))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(Messages.Buy.CannotAfford)
  })

  it("should succeed if all conditions are met", async () => {
    // given
    const initialGold = 100
    const itemValue = 10

    // and
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.player.sessionMob.gold = initialGold
    testBuilder.withRoom()

    // and
    const merch = testBuilder.withMob()
    merch.mob.role = Role.Merchant

    // and
    const eq = newEquipment("a sombrero", "a robust and eye-catching sombrero", Equipment.Head)
    eq.value = itemValue
    merch.mob.inventory.addItem(eq)

    // when
    const check = await buy(testBuilder.createRequest(RequestType.Buy, "buy sombrero"))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
  })
})
