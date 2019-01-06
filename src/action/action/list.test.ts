import {cloneDeep} from "lodash"
import * as uuid from "uuid"
import {newItem} from "../../item/factory"
import {ItemType} from "../../item/itemType"
import {Item} from "../../item/model/item"
import {RequestType} from "../../request/requestType"
import doNTimes from "../../support/functional/times"
import TestBuilder from "../../test/testBuilder"

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
    const merchant = testBuilder.withMerchant().mob
    const definition = await testBuilder.getActionDefinition(RequestType.List)
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
})