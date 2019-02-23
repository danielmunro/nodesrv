import {CheckStatus} from "../../../check/checkStatus"
import {Equipment} from "../../../item/equipment"
import {newEquipment} from "../../../item/factory"
import {allDispositions, Disposition} from "../../../mob/enum/disposition"
import { RequestType } from "../../../request/requestType"
import { ResponseStatus } from "../../../request/responseStatus"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"
import {ConditionMessages} from "../../constants"

let testBuilder: TestBuilder
let action: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getActionDefinition(RequestType.Buy)
})

describe("buy action", () => {
  it("purchaser should receive an item", async () => {
    // given
    const initialGold = 100
    const mob = testBuilder.withMerchant().mob
    testBuilder.withItem()
      .asHelmet()
      .addToInventory(mob.inventory)
    const axe = testBuilder.withItem()
      .asAxe()
      .addToInventory(mob.inventory)
      .build()

    // and
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.gold = initialGold)
    const player = playerBuilder.player

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Buy, "buy axe"))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(player.sessionMob.inventory.findItemByName("axe")).not.toBeUndefined()
    expect(player.sessionMob.gold).toBe(initialGold - axe.value)
  })

  it("should fail if an argument is not provided", async () => {
    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Buy, "buy"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(ConditionMessages.All.Arguments.Buy)
  })

  it("should fail if a merchant is not in the room", async () => {
    // setup
    await testBuilder.withPlayer()
    testBuilder.withRoom()

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Buy, "buy foo"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(ConditionMessages.All.Item.NoMerchant)
  })

  it("should fail if the merchant doesn't have the item requested", async () => {
    // given
    testBuilder.withMob()

    // and
    testBuilder.withMerchant()

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Buy, "buy foo"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(ConditionMessages.Buy.MerchantNoItem)
  })

  it("should fail if the item is too expensive", async () => {
    // given
    testBuilder.withMob()
    const item = testBuilder.withItem()
      .asAxe()
      .addToInventory(testBuilder.withMerchant().mob.inventory)
      .build()

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Buy, `buy ${item.name}`))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(ConditionMessages.Buy.CannotAfford)
  })

  it("should succeed if all conditions are met", async () => {
    // given
    const initialGold = 100
    const itemValue = 10

    // and
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.player.sessionMob.gold = initialGold
    testBuilder.withRoom()

    // and
    const merch = testBuilder.withMerchant()

    // and
    const eq = newEquipment("a sombrero", "a robust and eye-catching sombrero", Equipment.Head)
    eq.value = itemValue
    merch.mob.inventory.addItem(eq)

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Buy, "buy sombrero"))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
  })

  it.each(allDispositions)("should require a standing disposition, provided with %s", async disposition => {
    // given
    testBuilder.withMob().withDisposition(disposition).withGold(100)
    testBuilder.withItem()
      .asAxe()
      .addToInventory(testBuilder.withMerchant().mob.inventory)

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Buy, `buy axe`))

    // then
    expect(check.status).toBe(disposition === Disposition.Standing ? CheckStatus.Ok : CheckStatus.Failed)
  })
})
