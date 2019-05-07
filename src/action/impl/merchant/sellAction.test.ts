import {createTestAppContainer} from "../../../inversify.config"
import {allDispositions, Disposition} from "../../../mob/enum/disposition"
import { RequestType } from "../../../request/requestType"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {ConditionMessages} from "../../constants"

let testRunner: TestRunner
let seller: MobBuilder
let merchant: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  seller = testRunner.createMob()
  merchant = testRunner.createMob().asMerchant()
})

describe("sell action", () => {
  it("sanity check", async () => {
    // setup
    const item = testRunner.createItem()
      .asHelmet()
      .build()
    seller.addItem(item)

    // given
    const initialWorth = seller.mob.gold

    // when
    const response = await testRunner.invokeAction(RequestType.Sell, "sell cap")

    // then
    expect(response.isSuccessful()).toBeTruthy()
    expect(seller.mob.gold).toBeGreaterThan(initialWorth)
    expect(seller.getItems()).not.toContain(item)
  })

  it("fails if a merchant is not in the room", async () => {
    // setup
    const room = testRunner.createRoom().get()

    // given
    await testRunner.updateMobLocation(merchant.mob, room)

    // when
    const response = await testRunner.invokeAction(RequestType.Sell, "sell foo")

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Item.NoMerchant)
  })

  it("fails when the seller does not have the item",  async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Sell, "sell foo")

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Item.NotOwned)
  })

  it("generates accurate messages", async () => {
    // setup
    const item = testRunner.createWeapon()
      .asAxe()
      .build()
    seller.addItem(item)

    // when
    const response = await testRunner.invokeAction(RequestType.Sell, `sell ${item.name}`)

    // then
    expect(response.isSuccessful()).toBeTruthy()
    expect(response.getMessageToRequestCreator())
      .toBe(`you sell ${item.name} for ${item.value} gold`)
    expect(response.message.getMessageToTarget())
      .toBe(`${seller.getMobName()} sell ${item.name} for ${item.value} gold`)
    expect(response.message.getMessageToObservers())
      .toBe(`${seller.getMobName()} sells ${item.name} for ${item.value} gold`)
  })

  it.each(allDispositions)("requires a standing disposition, provided with %s", async disposition => {
    // given
    const item = testRunner.createWeapon()
      .asAxe()
      .build()
    seller.addItem(item)
    seller.withDisposition(disposition)

    // when
    const response = await testRunner.invokeAction(RequestType.Sell, "sell axe")

    // then
    expect(response.isSuccessful()).toBe(disposition === Disposition.Standing)
  })
})
