import {cloneDeep} from "lodash"
import * as uuid from "uuid"
import {createTestAppContainer} from "../../../inversify.config"
import {ItemType} from "../../../item/enum/itemType"
import {newItem} from "../../../item/factory"
import {Item} from "../../../item/model/item"
import {allDispositions, Disposition} from "../../../mob/enum/disposition"
import {RequestType} from "../../../request/requestType"
import doNTimes from "../../../support/functional/times"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

function getItem1(): Item {
  const item = newItem(ItemType.Light, "name", "description")
  item.brief = "a test item"
  item.value = 100
  item.canonicalId = uuid()
  return item
}

function getItem2(): Item {
  const item = newItem(ItemType.Light, "name", "description")
  item.brief = "a different test item"
  item.value = 20
  item.canonicalId = uuid()
  return item
}

let testRunner: TestRunner
let buyer: MobBuilder
let merchant: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  buyer = testRunner.createMob()
  merchant = testRunner.createMob().asMerchant()
})

describe("list action", () => {
  it("should list items in a merchant's inventory", async () => {
    // setup
    const count1 = 3
    const count2 = 1

    // given
    const item1 = getItem1()
    await doNTimes(count1, () => merchant.addItem(cloneDeep(item1)))
    const item2 = getItem2()
    await doNTimes(count2, () => merchant.addItem(cloneDeep(item2)))

    // when
    const response = await testRunner.invokeAction(RequestType.List)

    // then
    const message = response.getMessageToRequestCreator()
    expect(message).toContain("[ 3 100 ] a test item")
    expect(message).toContain("[ 1 20 ] a different test item")
  })

  it.each(allDispositions)("should require a standing disposition, provided with %s", async disposition => {
    // setup
    const item = testRunner.createWeapon()
      .asAxe()
      .build()
    merchant.addItem(item)

    // given
    buyer.withDisposition(disposition)

    // when
    const response = await testRunner.invokeAction(RequestType.List)

    // then
    expect(response.isSuccessful()).toBe(disposition === Disposition.Standing)
  })
})
