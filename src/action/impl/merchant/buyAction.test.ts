import {createTestAppContainer} from "../../../app/factory/testFactory"
import {allDispositions, Disposition} from "../../../mob/enum/disposition"
import { RequestType } from "../../../request/enum/requestType"
import {ResponseStatus} from "../../../request/enum/responseStatus"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {ConditionMessages} from "../../constants"

let testRunner: TestRunner
let buyer: MobBuilder
const initialGold = 100

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  buyer = testRunner.createMob()
    .setGold(initialGold)
})

describe("buy action", () => {
  it("purchaser should receive an item", async () => {
    // given
    const merchant = testRunner.createMob().asMerchant()
    const item1 = testRunner.createItem()
      .asHelmet()
      .build()
    const item2 = testRunner.createWeapon()
      .asAxe()
      .build()
    merchant.addItem(item1)
    merchant.addItem(item2)

    // when
    const response = await testRunner.invokeAction(RequestType.Buy, "buy axe")

    // then
    expect(response.isSuccessful()).toBeTruthy()
    expect(buyer.getItems()).toHaveLength(1)
    expect(buyer.mob.gold).toBe(initialGold - item2.value)
  })

  it("fails when an argument is not provided", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Buy, "buy")

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Arguments.Buy)
  })

  it("fails when a merchant is not in the room", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Buy, "buy foo")

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Item.NoMerchant)
  })

  it("fails when the merchant doesn't have the item requested", async () => {
    // given
    testRunner.createMob().asMerchant()

    // when
    const response = await testRunner.invokeAction(RequestType.Buy, "buy foo")

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Buy.MerchantNoItem)
  })

  it("fails when the item is too expensive", async () => {
    // given
    const item = testRunner.createWeapon()
      .asAxe()
      .withValue(initialGold + 1)
      .build()

    testRunner.createMob().asMerchant().addItem(item)

    // when
    const response = await testRunner.invokeAction(RequestType.Buy, `buy ${item.name}`)

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Buy.CannotAfford)
  })

  it("should succeed if all conditions are met", async () => {
    // given
    const item = testRunner.createItem()
      .asHelmet()
      .withValue(initialGold)
      .build()
    testRunner.createMob().asMerchant().addItem(item)

    // when
    const response = await testRunner.invokeAction(RequestType.Buy, `buy '${item.name}'`)

    // then
    expect(response.isSuccessful()).toBeTruthy()
  })

  it.each(allDispositions)("should require a standing disposition, provided with %s", async disposition => {
    // given
    const item = testRunner.createWeapon()
      .asAxe()
      .build()
    testRunner.createMob().asMerchant().addItem(item)
    buyer.withDisposition(disposition)
    buyer.setGold(initialGold)

    // when
    const response = await testRunner.invokeAction(RequestType.Buy, `buy axe`)

    // then
    expect(response.status)
      .toBe(disposition === Disposition.Standing ? ResponseStatus.Success : ResponseStatus.PreconditionsFailed)
  })
})
