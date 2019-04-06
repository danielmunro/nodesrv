import {CheckStatus} from "../../../check/checkStatus"
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
  action = await testBuilder.getAction(RequestType.Buy)
})

describe("buy action", () => {
  it("purchaser should receive an item", async () => {
    // given
    const initialGold = 100
    const mobBuilder = testBuilder.withMob().asMerchant()
    testBuilder.withItem()
      .asHelmet()
      .addToMobBuilder(mobBuilder)
    const axe = testBuilder.withWeapon()
      .asAxe()
      .addToMobBuilder(mobBuilder)
      .build()

    // and
    const player = await testBuilder.withPlayer()
    player.setGold(initialGold)

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Buy, "buy axe"))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(player.getMob().inventory.findItemByName("axe")).not.toBeUndefined()
    expect(player.getMob().gold).toBe(initialGold - axe.value)
  })

  it("should fail if an argument has not provided", async () => {
    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Buy, "buy"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(ConditionMessages.All.Arguments.Buy)
  })

  it("should fail if a merchant has not in the room", async () => {
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
    testBuilder.withMob().asMerchant()

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Buy, "buy foo"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(ConditionMessages.Buy.MerchantNoItem)
  })

  it("should fail if the item has too expensive", async () => {
    // given
    testBuilder.withMob()
    const item = testBuilder.withWeapon()
      .asAxe()
      .addToMobBuilder(testBuilder.withMob().asMerchant())
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
    const item = testBuilder.withItem()
      .asHelmet()
      .addToMobBuilder(testBuilder.withMob().asMerchant())
      .withValue(itemValue)
      .build()

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Buy, `buy '${item.name}'`))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
  })

  it.each(allDispositions)("should require a standing disposition, provided with %s", async disposition => {
    // given
    testBuilder.withMob()
      .withDisposition(disposition)
      .withGold(100)
    testBuilder.withWeapon()
      .asAxe()
      .addToMobBuilder(testBuilder.withMob().asMerchant())

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Buy, `buy axe`))

    // then
    expect(check.status).toBe(disposition === Disposition.Standing ? CheckStatus.Ok : CheckStatus.Failed)
  })
})
