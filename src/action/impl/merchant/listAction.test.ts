import {cloneDeep} from "lodash"
import * as uuid from "uuid"
import {CheckStatus} from "../../../check/checkStatus"
import {ItemType} from "../../../item/enum/itemType"
import {newItem} from "../../../item/factory"
import {Item} from "../../../item/model/item"
import {allDispositions, Disposition} from "../../../mob/enum/disposition"
import {RequestType} from "../../../request/requestType"
import doNTimes from "../../../support/functional/times"
import TestBuilder from "../../../support/test/testBuilder"

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

describe("list action", () => {
  it("should list items in a merchant's inventory", async () => {
    // setup
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer()
    const merchant = testBuilder.withMob().asMerchant().mob
    const definition = await testBuilder.getAction(RequestType.List)
    const count1 = 3
    const count2 = 1

    // given
    const item1 = getItem1()
    await doNTimes(count1, () => merchant.inventory.addItem(cloneDeep(item1)))
    const item2 = getItem2()
    await doNTimes(count2, () => merchant.inventory.addItem(cloneDeep(item2)))

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.List))

    // then
    const message = response.message.getMessageToRequestCreator()
    expect(message).toContain("[ 3 100 ] a test item")
    expect(message).toContain("[ 1 20 ] a different test item")
  })

  it.each(allDispositions)("should require a standing disposition, provided with %s", async disposition => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withMob().withDisposition(disposition)
    testBuilder.withWeapon()
      .asAxe()
      .addToMobBuilder(testBuilder.withMob().asMerchant())
      .build()
    const definition = await testBuilder.getAction(RequestType.List)

    // when
    const check = await definition.check(testBuilder.createRequest(RequestType.List))

    // then
    expect(check.status).toBe(disposition === Disposition.Standing ? CheckStatus.Ok : CheckStatus.Failed)
  })
})
